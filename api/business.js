const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Company information
router.post('/company-info', [
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('ticker').optional().isString().withMessage('Ticker must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, ticker } = req.body;
    
    // Simulate company information
    const companyInfo = {
      name: companyName,
      ticker: ticker || `${companyName.substring(0, 3).toUpperCase()}`,
      description: `${companyName} is a leading technology company specializing in innovative solutions for businesses worldwide.`,
      industry: 'Technology',
      sector: 'Software',
      founded: '2010',
      employees: Math.floor(Math.random() * 10000) + 1000,
      headquarters: {
        city: 'San Francisco',
        state: 'CA',
        country: 'United States'
      },
      website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      marketCap: `$${(Math.random() * 100 + 1).toFixed(2)}B`,
      revenue: `$${(Math.random() * 10 + 1).toFixed(2)}B`,
      profitMargin: `${(Math.random() * 20 + 5).toFixed(1)}%`,
      competitors: ['TechCorp', 'InnoSoft', 'DataSystems'],
      keyExecutives: [
        { name: 'John Doe', position: 'CEO', tenure: '5 years' },
        { name: 'Jane Smith', position: 'CTO', tenure: '3 years' }
      ]
    };
    
    res.json({
      success: true,
      companyInfo: companyInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Stock price data
router.post('/stock-data', [
  body('ticker').notEmpty().withMessage('Ticker symbol is required'),
  body('period').optional().isIn(['1d', '1w', '1m', '3m', '6m', '1y', '5y']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ticker, period = '1m' } = req.body;
    
    // Generate historical stock data
    const historicalData = [];
    const days = period === '1d' ? 1 : period === '1w' ? 7 : period === '1m' ? 30 : period === '3m' ? 90 : period === '6m' ? 180 : period === '1y' ? 365 : 1825;
    let basePrice = Math.random() * 200 + 50;
    
    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      basePrice += (Math.random() - 0.5) * 10;
      const open = basePrice;
      const close = basePrice + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      historicalData.unshift({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume,
        adjClose: parseFloat(close.toFixed(2))
      });
    }
    
    const currentPrice = historicalData[historicalData.length - 1].close;
    const previousClose = historicalData[historicalData.length - 2].close;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose * 100).toFixed(2);
    
    res.json({
      success: true,
      ticker: ticker,
      period: period,
      currentPrice: currentPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent),
      dayHigh: Math.max(...historicalData.slice(-5).map(d => d.high)),
      dayLow: Math.min(...historicalData.slice(-5).map(d => d.low)),
      volume: historicalData[historicalData.length - 1].volume,
      marketCap: `$${(currentPrice * Math.random() * 1000000000).toExponential(2)}`,
      historicalData: historicalData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Financial ratios
router.post('/financial-ratios', [
  body('ticker').notEmpty().withMessage('Ticker symbol is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ticker } = req.body;
    
    // Simulate financial ratios
    const ratios = {
      profitability: {
        grossMargin: `${(Math.random() * 40 + 30).toFixed(1)}%`,
        operatingMargin: `${(Math.random() * 25 + 10).toFixed(1)}%`,
        netMargin: `${(Math.random() * 20 + 5).toFixed(1)}%`,
        returnOnAssets: `${(Math.random() * 15 + 2).toFixed(1)}%`,
        returnOnEquity: `${(Math.random() * 25 + 5).toFixed(1)}%`
      },
      liquidity: {
        currentRatio: (Math.random() * 2 + 1).toFixed(2),
        quickRatio: (Math.random() * 1.5 + 0.5).toFixed(2),
        cashRatio: (Math.random() * 0.8 + 0.2).toFixed(2)
      },
      solvency: {
        debtToEquity: (Math.random() * 1.5).toFixed(2),
        debtToAssets: (Math.random() * 0.6).toFixed(2),
        interestCoverage: (Math.random() * 10 + 2).toFixed(1)
      },
      efficiency: {
        assetTurnover: (Math.random() * 2 + 0.5).toFixed(2),
        inventoryTurnover: (Math.random() * 10 + 2).toFixed(1),
        receivablesTurnover: (Math.random() * 15 + 5).toFixed(1)
      },
      valuation: {
        priceToEarnings: (Math.random() * 30 + 10).toFixed(1),
        priceToSales: (Math.random() * 5 + 1).toFixed(2),
        priceToBook: (Math.random() * 8 + 1).toFixed(2),
        priceToCash: (Math.random() * 20 + 5).toFixed(1)
      }
    };
    
    res.json({
      success: true,
      ticker: ticker,
      lastUpdated: new Date().toISOString(),
      ratios: ratios
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Market indices
router.post('/market-indices', [
  body('indices').optional().isArray().withMessage('Indices must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { indices = ['S&P 500', 'NASDAQ', 'DOW JONES'] } = req.body;
    
    // Simulate market indices data
    const indicesData = indices.map(index => ({
      name: index,
      symbol: index === 'S&P 500' ? 'GSPC' : index === 'NASDAQ' ? 'IXIC' : 'DJI',
      value: parseFloat((Math.random() * 5000 + 3000).toFixed(2)),
      change: parseFloat((Math.random() * 200 - 100).toFixed(2)),
      changePercent: parseFloat((Math.random() * 4 - 2).toFixed(2)),
      dayHigh: parseFloat((Math.random() * 5000 + 3000 + 100).toFixed(2)),
      dayLow: parseFloat((Math.random() * 5000 + 3000 - 100).toFixed(2)),
      volume: Math.floor(Math.random() * 1000000000) + 500000000
    }));
    
    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      indices: indicesData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Economic indicators
router.post('/economic-indicators', [
  body('country').optional().isString().withMessage('Country must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { country = 'United States' } = req.body;
    
    // Simulate economic indicators
    const indicators = {
      gdp: {
        current: `$${(Math.random() * 20 + 20).toFixed(2)} Trillion`,
        growthRate: `${(Math.random() * 4 + 1).toFixed(2)}%`,
        perCapita: `$${(Math.random() * 50000 + 30000).toFixed(0)}`
      },
      inflation: {
        rate: `${(Math.random() * 5 + 1).toFixed(2)}%`,
        cpiIndex: parseFloat((Math.random() * 50 + 250).toFixed(1)),
        coreInflation: `${(Math.random() * 4 + 1).toFixed(2)}%`
      },
      employment: {
        unemploymentRate: `${(Math.random() * 5 + 3).toFixed(1)}%`,
        laborForce: Math.floor(Math.random() * 50000000) + 150000000,
        participationRate: `${(Math.random() * 10 + 60).toFixed(1)}%`,
        jobGrowth: `${(Math.random() * 300000 + 100000).toFixed(0)}`
      },
      interestRates: {
        federalFunds: `${(Math.random() * 3 + 2).toFixed(2)}%`,
        primeRate: `${(Math.random() * 3 + 4).toFixed(2)}%`,
        mortgageRate: `${(Math.random() * 3 + 5).toFixed(2)}%`
      },
      trade: {
        exports: `$${(Math.random() * 2 + 1).toFixed(2)} Trillion`,
        imports: `$${(Math.random() * 2.5 + 1.5).toFixed(2)} Trillion`,
        tradeBalance: `-$${(Math.random() * 0.5 + 0.2).toFixed(2)} Trillion`
      }
    };
    
    res.json({
      success: true,
      country: country,
      lastUpdated: new Date().toISOString(),
      indicators: indicators
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Industry analysis
router.post('/industry-analysis', [
  body('industry').notEmpty().withMessage('Industry name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { industry } = req.body;
    
    // Simulate industry analysis
    const analysis = {
      industry: industry,
      marketSize: `$${(Math.random() * 500 + 100).toFixed(2)} Billion`,
      growthRate: `${(Math.random() * 15 + 3).toFixed(2)}%`,
      projectedGrowth: `${(Math.random() * 20 + 5).toFixed(2)}%`,
      keyDrivers: [
        'Technological innovation',
        'Increasing demand',
        'Regulatory changes',
        'Market expansion'
      ],
      challenges: [
        'Competition',
        'Supply chain disruptions',
        'Regulatory compliance',
        'Talent acquisition'
      ],
      topCompanies: [
        { name: 'Market Leader', marketShare: '25%' },
        { name: 'Second Player', marketShare: '18%' },
        { name: 'Third Company', marketShare: '12%' }
      ],
      trends: [
        'Digital transformation',
        'Sustainability focus',
        'AI integration',
        'Remote work adoption'
      ],
      outlook: 'Positive',
      recommendation: 'Buy'
    };
    
    res.json({
      success: true,
      analysis: analysis,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Company news
router.post('/company-news', [
  body('ticker').notEmpty().withMessage('Ticker symbol is required'),
  body('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ticker, limit = 5 } = req.body;
    
    // Generate company news
    const news = [];
    for (let i = 1; i <= Math.min(limit, 10); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      news.push({
        headline: `${ticker} Announces Q${Math.floor(Math.random() * 4) + 1} Earnings Beat Expectations`,
        source: 'Financial News Network',
        date: date.toISOString().split('T')[0],
        summary: `The company reported strong quarterly results, exceeding analyst expectations with revenue growth of ${(Math.random() * 20 + 5).toFixed(1)}%. Management raised guidance for the upcoming quarter citing strong demand and successful product launches.`,
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        url: `https://financialnews.com/articles/${ticker.toLowerCase()}-earnings-${date.getTime()}`
      });
    }
    
    res.json({
      success: true,
      ticker: ticker,
      totalNews: news.length,
      news: news
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;