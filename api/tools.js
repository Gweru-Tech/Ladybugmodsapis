const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// URL shortener
router.post('/shorten-url', [
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    const shortCode = Math.random().toString(36).substring(2, 8);
    const shortUrl = `https://short.link/${shortCode}`;
    
    res.json({
      success: true,
      originalUrl: url,
      shortUrl: shortUrl,
      shortCode: shortCode,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// QR code generator
router.post('/generate-qr', [
  body('text').notEmpty().withMessage('Text or URL is required'),
  body('size').optional().isInt({ min: 100, max: 500 }).withMessage('Size must be between 100 and 500')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, size = 200 } = req.body;
    
    res.json({
      success: true,
      text: text,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`,
      size: `${size}x${size}`,
      format: 'PNG'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Password generator
router.post('/generate-password', [
  body('length').optional().isInt({ min: 8, max: 32 }).withMessage('Length must be between 8 and 32'),
  body('includeUppercase').optional().isBoolean(),
  body('includeLowercase').optional().isBoolean(),
  body('includeNumbers').optional().isBoolean(),
  body('includeSymbols').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      length = 12,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true
    } = req.body;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
      return res.status(400).json({ error: 'At least one character type must be selected' });
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    res.json({
      success: true,
      password: password,
      length: length,
      strength: calculatePasswordStrength(password),
      options: {
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Text utilities
router.post('/text-utils', [
  body('text').notEmpty().withMessage('Text is required'),
  body('operations').isArray().withMessage('Operations must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, operations } = req.body;
    let result = text;
    const results = {};
    
    operations.forEach(operation => {
      switch (operation) {
        case 'uppercase':
          results.uppercase = text.toUpperCase();
          break;
        case 'lowercase':
          results.lowercase = text.toLowerCase();
          break;
        case 'reverse':
          results.reverse = text.split('').reverse().join('');
          break;
        case 'wordCount':
          results.wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
          break;
        case 'characterCount':
          results.characterCount = text.length;
          break;
        case 'removeSpaces':
          results.removeSpaces = text.replace(/\s+/g, '');
          break;
        case 'capitalize':
          results.capitalize = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
          break;
      }
    });
    
    res.json({
      success: true,
      originalText: text,
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Color converter
router.post('/convert-color', [
  body('color').notEmpty().withMessage('Color value is required'),
  body('fromFormat').optional().isIn(['hex', 'rgb', 'hsl']).withMessage('Invalid from format'),
  body('toFormat').optional().isIn(['hex', 'rgb', 'hsl']).withMessage('Invalid to format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { color, fromFormat = 'hex', toFormat = 'rgb' } = req.body;
    
    // Simulate color conversion
    const conversions = {
      'rgb': 'rgb(255, 99, 71)',
      'hex': '#FF6347',
      'hsl': 'hsl(9, 100%, 64%)'
    };
    
    res.json({
      success: true,
      originalColor: color,
      originalFormat: fromFormat,
      convertedColor: conversions[toFormat],
      targetFormat: toFormat,
      allFormats: conversions
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// JSON formatter
router.post('/format-json', [
  body('json').notEmpty().withMessage('JSON string is required'),
  body('indent').optional().isInt({ min: 0, max: 8 }).withMessage('Indent must be between 0 and 8')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { json, indent = 2 } = req.body;
    
    try {
      const parsedJson = JSON.parse(json);
      const formattedJson = JSON.stringify(parsedJson, null, indent);
      
      res.json({
        success: true,
        originalJson: json,
        formattedJson: formattedJson,
        indent: indent,
        isValid: true
      });
    } catch (parseError) {
      res.status(400).json({
        success: false,
        error: 'Invalid JSON',
        message: parseError.message
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return strengthLevels[Math.min(strength, 5)];
}

module.exports = router;