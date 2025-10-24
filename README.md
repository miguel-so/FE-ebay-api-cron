# eBay Listing Monitor

A proof-of-concept application that monitors eBay listings and sends email notifications before they end. Built with a simple HTML frontend and Node.js backend.

## Features

- 🔍 **Search Interface**: Clean HTML form to set search criteria (keywords, category, price range, condition, etc.)
- ⏰ **Hourly Monitoring**: Automated cron job that checks for listings ending within the next hour
- 📧 **Email Notifications**: Sends email alerts with direct links to ending listings
- 💾 **Criteria Storage**: Saves search preferences locally and on the server
- 🎨 **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
# eBay API Configuration (get from https://developer.ebay.com/)
EBAY_APP_ID=your_ebay_app_id
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Get eBay API Credentials

1. Go to [eBay Developer Program](https://developer.ebay.com/)
2. Create a new application
3. Get your App ID, Client ID, and Client Secret
4. Add them to your `.env` file

### 4. Set Up Email (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords
3. Use your Gmail address and the App Password in `.env`

### 5. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Run cron job only:**
```bash
npm run cron
```

**Test cron job once:**
```bash
node cron-job.js --once
```

### 6. Access the Application

Open your browser to `http://localhost:3000`

## Usage

1. **Set Search Criteria**: Fill out the form with your desired search parameters
2. **Save Criteria**: Click "Save Search Criteria" to store your preferences
3. **Automatic Monitoring**: The cron job runs every hour and checks for listings ending soon
4. **Email Notifications**: Receive emails with direct links to ending listings

## API Endpoints

- `GET /` - Main application page
- `POST /api/save-criteria` - Save search criteria
- `GET /api/criteria` - Get saved criteria
- `POST /api/search` - Search listings (mock data for now)
- `GET /api/health` - Health check

## File Structure

```
├── index.html          # Frontend HTML page
├── server.js           # Express server
├── ebay-api.js         # eBay API integration
├── email-service.js    # Email notification service
├── cron-job.js         # Scheduled monitoring job
├── package.json        # Dependencies and scripts
├── env.example         # Environment configuration template
└── README.md           # This file
```

## Deployment Options

### Option 1: VPS/Server with Cron

1. Deploy to a VPS (DigitalOcean, Linode, etc.)
2. Install Node.js and dependencies
3. Set up a system cron job:
   ```bash
   # Add to crontab (crontab -e)
   0 * * * * cd /path/to/app && node cron-job.js --once
   ```

### Option 2: AWS Lambda + EventBridge

1. Package the cron job as a Lambda function
2. Set up EventBridge rule to trigger every hour
3. Deploy the web app to AWS Amplify or S3

### Option 3: Heroku with Scheduler

1. Deploy to Heroku
2. Add Heroku Scheduler add-on
3. Set up hourly job: `node cron-job.js --once`

## Configuration

### Search Criteria Fields

- **Keyword**: Search terms (required)
- **Category**: eBay category ID (optional)
- **Condition**: New, Used, etc. (optional)
- **Price Range**: Min/max price (optional)
- **Minimum Bids**: Filter by bid count (optional)
- **Max Results**: Limit results (1-100)

### Email Templates

The system sends both HTML and plain text emails with:
- Listing title and price
- Number of bids
- Time remaining
- Direct eBay links
- Search criteria used

## Troubleshooting

### Common Issues

1. **eBay API Errors**: Check your API credentials and rate limits
2. **Email Not Sending**: Verify email credentials and app passwords
3. **No Listings Found**: Try broader search criteria or check if items are actually ending soon

### Debug Mode

Set `RUN_IMMEDIATELY=true` in `.env` to run the cron job immediately on startup for testing.

### Logs

Check the console output for detailed logging of:
- API calls and responses
- Email sending status
- Error messages and stack traces

## Limitations

This is a proof-of-concept with some limitations:

- Uses mock data for listings (eBay API integration needs real credentials)
- Stores criteria in JSON file (use database in production)
- Single user system (no user authentication)
- Basic error handling

## Next Steps for Production

1. **Database**: Replace JSON file storage with PostgreSQL/MongoDB
2. **Authentication**: Add user accounts and login system
3. **Real eBay API**: Complete the eBay API integration
4. **Advanced Filters**: Add more search options (seller, location, etc.)
5. **Webhooks**: Real-time notifications instead of hourly checks
6. **Analytics**: Track user preferences and popular searches

## License

MIT License - feel free to use and modify for your needs.