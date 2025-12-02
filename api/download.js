const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Download file from URL
router.post('/file', [
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    
    try {
      const response = await axios.head(url, { timeout: 10000 });
      const fileSize = response.headers['content-length'];
      const contentType = response.headers['content-type'];
      
      res.json({
        success: true,
        url: url,
        fileInfo: {
          size: fileSize,
          type: contentType,
          downloadable: true
        },
        downloadUrl: url
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Unable to access the URL',
        message: error.message
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get video download info
router.post('/video-info', [
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    
    // Simulate video info extraction
    const videoInfo = {
      title: 'Sample Video Title',
      duration: '5:30',
      format: 'mp4',
      quality: ['720p', '1080p'],
      size: '25.6 MB',
      thumbnail: `https://img.youtube.com/vi/sample/maxresdefault.jpg`
    };
    
    res.json({
      success: true,
      url: url,
      videoInfo: videoInfo,
      downloadOptions: [
        { quality: '720p', format: 'mp4', size: '15.2 MB' },
        { quality: '1080p', format: 'mp4', size: '25.6 MB' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Batch URL processing
router.post('/batch', [
  body('urls').isArray({ min: 1, max: 10 }).withMessage('Provide 1-10 URLs')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { urls } = req.body;
    const results = [];
    
    for (const url of urls) {
      try {
        const response = await axios.head(url, { timeout: 5000 });
        results.push({
          url: url,
          status: 'accessible',
          size: response.headers['content-length'],
          type: response.headers['content-type']
        });
      } catch (error) {
        results.push({
          url: url,
          status: 'inaccessible',
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      processed: urls.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// URL validation
router.post('/validate', [
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    
    try {
      const response = await axios.head(url, { timeout: 5000 });
      const isValid = response.status === 200;
      
      res.json({
        valid: isValid,
        url: url,
        status: response.status,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length']
      });
    } catch (error) {
      res.json({
        valid: false,
        url: url,
        error: error.message
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;