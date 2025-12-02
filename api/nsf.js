const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Search NSF awards
router.post('/search-awards', [
  body('keyword').optional().isString().withMessage('Keyword must be a string'),
  body('agency').optional().isString().withMessage('Agency must be a string'),
  body('year').optional().isInt({ min: 2000, max: 2024 }).withMessage('Year must be between 2000 and 2024'),
  body('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  body('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { keyword = '', agency = '', year = 2024, offset = 0, limit = 10 } = req.body;
    
    // Simulate NSF awards search
    const awards = [];
    for (let i = 1; i <= Math.min(limit, 10); i++) {
      awards.push({
        awardId: `NSF-${year}-${String(i).padStart(6, '0')}`,
        title: `Research on ${keyword || 'Advanced Technologies'} - Project ${i}`,
        abstract: `This project investigates innovative approaches to ${keyword || 'scientific research'}. The research aims to advance understanding in the field and develop practical applications for the benefit of society.`,
        agency: agency || 'Directorate for Computer & Information Science & Engineering',
        PI: {
          firstName: 'John',
          lastName: `Doe${i}`,
          email: `jdoe${i}@university.edu`
        },
        organization: `University ${i}`,
        state: 'CA',
        country: 'United States',
        startDate: `${year}-01-01`,
        endDate: `${year + 3}-12-31`,
        awardAmount: `$${(Math.random() * 500000 + 100000).toFixed(2)}`,
        fundsObligated: `$${(Math.random() * 400000 + 80000).toFixed(2)}`,
        researchArea: 'Computer Science',
        program: 'Computer and Information Science and Engineering'
      });
    }
    
    res.json({
      success: true,
      searchCriteria: {
        keyword,
        agency,
        year,
        offset,
        limit
      },
      totalResults: awards.length,
      awards: awards
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get award details
router.post('/award-details', [
  body('awardId').notEmpty().withMessage('Award ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { awardId } = req.body;
    
    // Simulate detailed award information
    const awardDetails = {
      awardId: awardId,
      title: 'Advanced Machine Learning for Scientific Discovery',
      abstract: 'This research project focuses on developing novel machine learning algorithms for accelerating scientific discovery across multiple domains. The project will create scalable AI systems that can analyze large-scale datasets, identify patterns, and generate hypotheses for experimental validation.',
      narrative: 'The proposed research addresses critical challenges in the intersection of artificial intelligence and scientific research. By developing interpretable and efficient ML models, we aim to enhance the capabilities of researchers in fields ranging from biology to materials science.',
      benefits: 'The project will benefit society through improved healthcare diagnostics, accelerated drug discovery, and enhanced understanding of complex systems.',
      PI: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jsmith@research.edu',
        phoneNumber: '555-0123',
        position: 'Professor'
      },
      CoPI: [
        {
          firstName: 'Robert',
          lastName: 'Johnson',
          email: 'rjohnson@research.edu',
          position: 'Associate Professor'
        }
      ],
      organization: {
        name: 'Advanced Research Institute',
        city: 'Stanford',
        state: 'CA',
        country: 'United States',
        congressionalDistrict: 'CA-16'
      },
      program: {
        name: 'Artificial Intelligence',
        code: '7495',
        directorate: 'Computer & Information Science & Engineering'
      },
      dates: {
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        lastUpdateDate: '2024-01-15'
      },
      funding: {
        awardAmount: '$450,000.00',
        fundsObligated: '$450,000.00',
        fundsObligatedDate: '2024-01-01'
      },
      keywords: ['Machine Learning', 'AI', 'Scientific Computing', 'Data Analysis'],
      researchAreas: ['Artificial Intelligence', 'Computer Science', 'Data Science']
    };
    
    res.json({
      success: true,
      awardDetails: awardDetails
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get NSF programs
router.post('/programs', [
  body('directorate').optional().isString().withMessage('Directorate must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { directorate } = req.body;
    
    // Simulate NSF programs
    const programs = [
      {
        code: '7495',
        name: 'Artificial Intelligence',
        description: 'Supports research and education in artificial intelligence, machine learning, and related fields.',
        directorate: 'Computer & Information Science & Engineering'
      },
      {
        code: '8069',
        name: 'Cyber-Physical Systems',
        description: 'Focuses on the co-design of cyber and physical components of systems.',
        directorate: 'Computer & Information Science & Engineering'
      },
      {
        code: '8394',
        name: 'Robotics',
        description: 'Supports research in robotics science and engineering.',
        directorate: 'Computer & Information Science & Engineering'
      },
      {
        code: '8233',
        name: 'Quantum Information Science',
        description: 'Advances quantum computing and quantum information processing.',
        directorate: 'Mathematical & Physical Sciences'
      }
    ];
    
    const filteredPrograms = directorate 
      ? programs.filter(p => p.directorate.toLowerCase().includes(directorate.toLowerCase()))
      : programs;
    
    res.json({
      success: true,
      directorate: directorate || 'All',
      totalPrograms: filteredPrograms.length,
      programs: filteredPrograms
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get NSF institutions
router.post('/institutions', [
  body('state').optional().isString().withMessage('State must be a string'),
  body('institutionType').optional().isIn(['university', 'college', 'research_institute', 'nonprofit']).withMessage('Invalid institution type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { state, institutionType } = req.body;
    
    // Simulate NSF institutions
    const institutions = [
      {
        name: 'Massachusetts Institute of Technology',
        city: 'Cambridge',
        state: 'MA',
        type: 'university',
        totalAwards: 156,
        totalFunding: '$125,000,000',
        recentAwards: 12
      },
      {
        name: 'Stanford University',
        city: 'Stanford',
        state: 'CA',
        type: 'university',
        totalAwards: 142,
        totalFunding: '$118,000,000',
        recentAwards: 10
      },
      {
        name: 'University of California, Berkeley',
        city: 'Berkeley',
        state: 'CA',
        type: 'university',
        totalAwards: 138,
        totalFunding: '$110,000,000',
        recentAwards: 9
      }
    ];
    
    let filteredInstitutions = institutions;
    
    if (state) {
      filteredInstitutions = filteredInstitutions.filter(i => 
        i.state.toLowerCase() === state.toLowerCase()
      );
    }
    
    if (institutionType) {
      filteredInstitutions = filteredInstitutions.filter(i => 
        i.type === institutionType
      );
    }
    
    res.json({
      success: true,
      criteria: { state, institutionType },
      totalInstitutions: filteredInstitutions.length,
      institutions: filteredInstitutions
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get research trends
router.post('/research-trends', [
  body('field').optional().isString().withMessage('Field must be a string'),
  body('years').optional().isArray({ min: 1, max: 10 }).withMessage('Years must be an array with 1-10 items')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { field = 'Computer Science', years = [2020, 2021, 2022, 2023, 2024] } = req.body;
    
    // Simulate research trends
    const trends = {
      field: field,
      trendsByYear: years.map(year => ({
        year: year,
        totalAwards: Math.floor(Math.random() * 500) + 200,
        totalFunding: `$${(Math.random() * 50 + 20).toFixed(1)}M`,
        averageAwardAmount: `$${(Math.random() * 200 + 100).toFixed(0)}K`,
        topKeywords: [
          'Artificial Intelligence',
          'Machine Learning',
          'Data Science',
          'Quantum Computing',
          'Cybersecurity'
        ].slice(0, 3)
      })),
      summary: {
        totalAwards: Math.floor(Math.random() * 2000) + 1000,
        totalFunding: `$${(Math.random() * 200 + 100).toFixed(1)}M`,
        growthRate: `${(Math.random() * 20 + 5).toFixed(1)}%`,
        emergingTopics: [
          'Quantum Machine Learning',
          'Neuromorphic Computing',
          'Edge AI',
          'Federated Learning',
          'Explainable AI'
        ]
      }
    };
    
    res.json({
      success: true,
      researchTrends: trends
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;