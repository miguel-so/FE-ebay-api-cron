# 🚀 Quick Start Guide

## What You Get

A complete eBay listing monitor that:
- ✅ **Clean HTML Interface** - Set search criteria with a beautiful form
- ✅ **Real-time Search** - See listings ending in the next hour
- ✅ **Email Notifications** - Get alerts before listings end
- ✅ **Automated Monitoring** - Runs every hour automatically
- ✅ **Criteria Storage** - Saves your search preferences

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Credentials
```bash
cp env.example .env
# Edit .env with your credentials (see below)
```

### 3. Start the Application
```bash
npm start
```

### 4. Open Your Browser
Go to `http://localhost:3000`

## Required Credentials

### eBay API (Get from https://developer.ebay.com/)
```env
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
```

### Email (Gmail Example)
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**For Gmail:** Enable 2FA → Google Account → Security → App passwords

## How to Use

1. **Set Search Criteria**
   - Enter keywords (e.g., "vintage camera")
   - Choose category, condition, price range
   - Set minimum bids if desired
   - Add your email address

2. **Save & Monitor**
   - Click "Save Search Criteria"
   - The system will check every hour
   - You'll get email alerts for ending listings

3. **Get Notifications**
   - Emails contain direct eBay links
   - Shows price, bids, time remaining
   - Only for listings ending within 1 hour

## Test the System

```bash
# Run demo to see how it works
node demo.js

# Test the application
node test.js

# Run cron job once for testing
node cron-job.js --once
```

## Deployment Options

### Option 1: VPS with Cron
```bash
# Add to crontab (crontab -e)
0 * * * * cd /path/to/app && node cron-job.js --once
```

### Option 2: Heroku
```bash
# Add Heroku Scheduler add-on
# Set job: node cron-job.js --once
```

### Option 3: AWS Lambda
- Package cron-job.js as Lambda function
- Set EventBridge rule for hourly execution

## File Structure
```
├── index.html          # Frontend web page
├── server.js           # Express web server
├── ebay-api.js         # eBay API integration
├── email-service.js    # Email notifications
├── cron-job.js         # Hourly monitoring
├── package.json        # Dependencies
├── env.example         # Configuration template
├── README.md           # Full documentation
├── QUICKSTART.md       # This file
├── test.js             # Test suite
├── demo.js             # Demo mode
└── deploy.sh           # Deployment script
```

## Troubleshooting

**No listings found?**
- Try broader search criteria
- Check if items are actually ending soon
- Verify eBay API credentials

**Emails not sending?**
- Check email credentials
- Use App Password for Gmail
- Check spam folder

**API errors?**
- Verify eBay API credentials
- Check rate limits
- See console logs for details

## Next Steps

1. **Production Database** - Replace JSON file with PostgreSQL
2. **User Accounts** - Add authentication system
3. **Advanced Filters** - More search options
4. **Real-time Updates** - WebSocket notifications
5. **Analytics** - Track popular searches

## Support

- 📚 Full docs: `README.md`
- 🧪 Test suite: `node test.js`
- 🎬 Demo mode: `node demo.js`
- 🚀 Deploy help: `./deploy.sh`

---

**Ready to monitor eBay listings? Start with `npm install` and follow the steps above!**
