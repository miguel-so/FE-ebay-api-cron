const axios = require('axios');

class EBayAPI {
    constructor() {
        this.baseURL = 'https://api.ebay.com/buy/browse/v1';
        this.appId = process.env.EBAY_APP_ID;
        this.clientId = process.env.EBAY_CLIENT_ID;
        this.clientSecret = process.env.EBAY_CLIENT_SECRET;
        this.accessToken = null;
    }

    // Get OAuth access token
    async getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        }

        try {
            const response = await axios.post('https://api.ebay.com/identity/v1/oauth2/token', 
                'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
                    }
                }
            );

            this.accessToken = response.data.access_token;
            return this.accessToken;
        } catch (error) {
            console.error('Error getting eBay access token:', error.response?.data || error.message);
            throw error;
        }
    }

    // Search for items ending within the next hour
    async searchItemsEndingSoon(criteria) {
        try {
            const token = await this.getAccessToken();
            const now = new Date();
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
            
            // Build search parameters
            const params = {
                q: criteria.keyword || '',
                limit: Math.min(parseInt(criteria.maxResults) || 20, 100),
                sort: 'endTime',
                filter: `itemEndDate:[${now.toISOString()}..${oneHourFromNow.toISOString()}]`
            };

            // Add category filter if specified
            if (criteria.category) {
                params.filter += `,categoryId:${criteria.category}`;
            }

            // Add condition filter if specified
            if (criteria.condition) {
                params.filter += `,conditionIds:{${criteria.condition}}`;
            }

            // Add price range filter
            if (criteria.minPrice || criteria.maxPrice) {
                let priceFilter = 'price:[';
                if (criteria.minPrice) {
                    priceFilter += criteria.minPrice;
                } else {
                    priceFilter += '0';
                }
                priceFilter += '..';
                if (criteria.maxPrice) {
                    priceFilter += criteria.maxPrice;
                } else {
                    priceFilter += '999999';
                }
                priceFilter += ']';
                params.filter += `,${priceFilter}`;
            }

            // Add bid count filter if specified
            if (criteria.minBids) {
                params.filter += `,bidCount:[${criteria.minBids}..]`;
            }

            const response = await axios.get(`${this.baseURL}/item_summary/search`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: params
            });

            return this.formatListings(response.data.itemSummaries || []);
        } catch (error) {
            console.error('Error searching eBay:', error.response?.data || error.message);
            throw error;
        }
    }

    // Format eBay API response to our standard format
    formatListings(items) {
        return items.map(item => ({
            title: item.title,
            price: item.price?.value || 'N/A',
            bids: item.bidCount || 0,
            endTime: item.itemEndDate,
            condition: item.condition || 'Unknown',
            url: item.itemWebUrl,
            image: item.image?.imageUrl,
            seller: item.seller?.username,
            shipping: item.shippingOptions?.[0]?.shippingCost?.value || 'Free'
        }));
    }

    // Get item details by ID
    async getItemDetails(itemId) {
        try {
            const token = await this.getAccessToken();
            const response = await axios.get(`${this.baseURL}/item/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error getting item details:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = EBayAPI;
