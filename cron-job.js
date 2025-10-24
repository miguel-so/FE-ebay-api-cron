const cron = require('node-cron');
const fs = require('fs');
const EBayAPI = require('./ebay-api');
const EmailService = require('./email-service');
require('dotenv').config();

class CronJobService {
    constructor() {
        this.ebayAPI = new EBayAPI();
        this.emailService = new EmailService();
        this.criteriaFile = 'search-criteria.json';
    }

    // Load search criteria from file
    loadCriteria() {
        try {
            if (fs.existsSync(this.criteriaFile)) {
                return JSON.parse(fs.readFileSync(this.criteriaFile, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading criteria:', error);
        }
        return null;
    }

    // Main cron job function
    async runCheck() {
        console.log(`\n🕐 Running eBay listing check at ${new Date().toLocaleString()}`);
        
        try {
            const criteria = this.loadCriteria();
            if (!criteria || !criteria.email) {
                console.log('❌ No search criteria or email found');
                return;
            }

            console.log(`📧 Checking listings for: ${criteria.email}`);
            console.log(`🔍 Search criteria:`, {
                keyword: criteria.keyword,
                category: criteria.category,
                condition: criteria.condition,
                priceRange: `${criteria.minPrice || 0} - ${criteria.maxPrice || '∞'}`,
                minBids: criteria.minBids
            });

            // Search for listings ending soon
            const listings = await this.ebayAPI.searchItemsEndingSoon(criteria);
            
            if (listings.length > 0) {
                console.log(`✅ Found ${listings.length} listing(s) ending soon`);
                
                // Send email notification
                await this.emailService.sendNotification(criteria.email, listings, criteria);
                
                // Log the listings found
                listings.forEach((listing, index) => {
                    console.log(`  ${index + 1}. ${listing.title} - $${listing.price} (${listing.bids} bids)`);
                });
            } else {
                console.log('ℹ️  No listings found ending within the next hour');
            }

        } catch (error) {
            console.error('❌ Error in cron job:', error);
            
            // Send error notification to admin email if configured
            if (process.env.ADMIN_EMAIL) {
                try {
                    await this.emailService.sendMail({
                        to: process.env.ADMIN_EMAIL,
                        subject: 'eBay Monitor - Error Alert',
                        text: `Error in eBay listing monitor: ${error.message}`,
                        html: `<h2>eBay Monitor Error</h2><p>${error.message}</p><pre>${error.stack}</pre>`
                    });
                } catch (emailError) {
                    console.error('Failed to send error notification:', emailError);
                }
            }
        }
    }

    // Start the cron job (runs every hour)
    start() {
        console.log('🚀 Starting eBay Listing Monitor Cron Job');
        console.log('⏰ Will run every hour at minute 0');
        
        // Test email configuration
        this.emailService.testConnection();
        
        // Schedule the job to run every hour
        cron.schedule('0 * * * *', () => {
            this.runCheck();
        }, {
            scheduled: true,
            timezone: "UTC"
        });

        // Run immediately for testing (optional)
        if (process.env.RUN_IMMEDIATELY === 'true') {
            console.log('🏃 Running immediately for testing...');
            setTimeout(() => this.runCheck(), 2000);
        }

        console.log('✅ Cron job scheduled successfully');
    }

    // Manual run for testing
    async runOnce() {
        console.log('🧪 Running manual check...');
        await this.runCheck();
    }
}

// Start the service if this file is run directly
if (require.main === module) {
    const service = new CronJobService();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--once')) {
        // Run once and exit
        service.runOnce().then(() => {
            console.log('✅ Manual run completed');
            process.exit(0);
        }).catch(error => {
            console.error('❌ Manual run failed:', error);
            process.exit(1);
        });
    } else {
        // Start the cron job
        service.start();
        
        // Keep the process running
        process.on('SIGINT', () => {
            console.log('\n👋 Shutting down eBay Monitor...');
            process.exit(0);
        });
    }
}

module.exports = CronJobService;
