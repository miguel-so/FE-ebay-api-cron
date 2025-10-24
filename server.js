const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store for search criteria (in production, use a database)
const criteriaFile = 'search-criteria.json';

// Load search criteria from file
function loadCriteria() {
    try {
        if (fs.existsSync(criteriaFile)) {
            return JSON.parse(fs.readFileSync(criteriaFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading criteria:', error);
    }
    return {};
}

// Save search criteria to file
function saveCriteria(criteria) {
    try {
        fs.writeFileSync(criteriaFile, JSON.stringify(criteria, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving criteria:', error);
        return false;
    }
}

// API Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Save search criteria
app.post('/api/save-criteria', (req, res) => {
    const criteria = req.body;
    
    if (saveCriteria(criteria)) {
        res.json({ success: true, message: 'Criteria saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save criteria' });
    }
});

// Get search criteria
app.get('/api/criteria', (req, res) => {
    const criteria = loadCriteria();
    res.json(criteria);
});

// Search listings using eBay API
app.post('/api/search', async (req, res) => {
    const criteria = req.body;
    
    try {
        const EBayAPI = require('./ebay-api');
        const ebayAPI = new EBayAPI();
        
        // Try to use real eBay API if credentials are available
        if (process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET) {
            const listings = await ebayAPI.searchItemsEndingSoon(criteria);
            res.json({ 
                success: true, 
                listings: listings,
                criteria: criteria
            });
        } else {
            // Fallback to mock data if no eBay credentials
            console.log('⚠️  No eBay API credentials found, using mock data');
            const mockListings = [
                {
                    title: "Vintage Camera - Canon AE-1 Program",
                    price: "125.50",
                    bids: "3",
                    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                    condition: "Used",
                    url: "https://www.ebay.com/itm/example1"
                },
                {
                    title: "iPhone 12 Pro Max 256GB",
                    price: "650.00",
                    bids: "7",
                    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
                    condition: "New",
                    url: "https://www.ebay.com/itm/example2"
                }
            ];
            
            res.json({ 
                success: true, 
                listings: mockListings,
                criteria: criteria,
                note: "Using mock data - configure eBay API credentials for real results"
            });
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error searching listings',
            error: error.message 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 eBay Listing Monitor running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
});
