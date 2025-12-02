const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Image resize
router.post('/resize', upload.single('image'), [
  body('width').optional().isInt({ min: 1, max: 4000 }).withMessage('Width must be between 1 and 4000'),
  body('height').optional().isInt({ min: 1, max: 4000 }).withMessage('Height must be between 1 and 4000')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { width = 300, height = 300 } = req.body;
    
    try {
      const resizedImageBuffer = await sharp(req.file.path)
        .resize(parseInt(width), parseInt(height))
        .toBuffer();
      
      const resizedImageBase64 = resizedImageBuffer.toString('base64');
      
      res.json({
        success: true,
        originalSize: {
          width: 'original_width',
          height: 'original_height'
        },
        newSize: { width, height },
        format: 'JPEG',
        imageSize: resizedImageBuffer.length,
        imageData: `data:image/jpeg;base64,${resizedImageBase64}`
      });
    } catch (error) {
      res.status(500).json({ error: 'Image processing failed', message: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Image format conversion
router.post('/convert', upload.single('image'), [
  body('format').isIn(['jpeg', 'png', 'webp', 'gif']).withMessage('Format must be jpeg, png, webp, or gif')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { format } = req.body;
    
    try {
      const convertedImageBuffer = await sharp(req.file.path)
        .toFormat(format)
        .toBuffer();
      
      const convertedImageBase64 = convertedImageBuffer.toString('base64');
      
      res.json({
        success: true,
        originalFormat: req.file.mimetype.split('/')[1],
        targetFormat: format,
        fileSize: convertedImageBuffer.length,
        imageData: `data:image/${format};base64,${convertedImageBase64}`
      });
    } catch (error) {
      res.status(500).json({ error: 'Image conversion failed', message: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Image filters
router.post('/filter', upload.single('image'), [
  body('filter').isIn(['grayscale', 'blur', 'sharpen', 'brightness', 'contrast', 'sepia']).withMessage('Invalid filter type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { filter } = req.body;
    
    try {
      let imageProcessor = sharp(req.file.path);
      
      switch (filter) {
        case 'grayscale':
          imageProcessor = imageProcessor.grayscale();
          break;
        case 'blur':
          imageProcessor = imageProcessor.blur(5);
          break;
        case 'sharpen':
          imageProcessor = imageProcessor.sharpen();
          break;
        case 'brightness':
          imageProcessor = imageProcessor.modulate({ brightness: 1.5 });
          break;
        case 'contrast':
          imageProcessor = imageProcessor.linear(1.5, 0);
          break;
        case 'sepia':
          imageProcessor = imageProcessor.tint({ r: 255, g: 238, b: 196 });
          break;
      }
      
      const filteredImageBuffer = await imageProcessor.toBuffer();
      const filteredImageBase64 = filteredImageBuffer.toString('base64');
      
      res.json({
        success: true,
        filter: filter,
        fileSize: filteredImageBuffer.length,
        imageData: `data:image/jpeg;base64,${filteredImageBase64}`
      });
    } catch (error) {
      res.status(500).json({ error: 'Image filtering failed', message: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Generate placeholder image
router.post('/placeholder', [
  body('width').isInt({ min: 50, max: 1000 }).withMessage('Width must be between 50 and 1000'),
  body('height').isInt({ min: 50, max: 1000 }).withMessage('Height must be between 50 and 1000'),
  body('text').optional().isString().withMessage('Text must be a string'),
  body('backgroundColor').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Background color must be a valid hex color'),
  body('textColor').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Text color must be a valid hex color')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      width, 
      height, 
      text = `${width}x${height}`, 
      backgroundColor = '#cccccc', 
      textColor = '#666666' 
    } = req.body;
    
    // Generate placeholder image URL using a service
    const placeholderUrl = `https://via.placeholder.com/${width}x${height}/${backgroundColor.substring(1)}/${textColor.substring(1)}?text=${encodeURIComponent(text)}`;
    
    res.json({
      success: true,
      width: width,
      height: height,
      text: text,
      backgroundColor: backgroundColor,
      textColor: textColor,
      imageUrl: placeholderUrl,
      format: 'PNG'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Image metadata
router.post('/metadata', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    try {
      const metadata = await sharp(req.file.path).metadata();
      
      res.json({
        success: true,
        filename: req.file.originalname,
        fileSize: req.file.size,
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation,
        colorSpace: metadata.space,
        exif: metadata.exif ? 'EXIF data available' : 'No EXIF data'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to extract metadata', message: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Image optimization
router.post('/optimize', upload.single('image'), [
  body('quality').optional().isInt({ min: 1, max: 100 }).withMessage('Quality must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { quality = 80 } = req.body;
    
    try {
      const optimizedImageBuffer = await sharp(req.file.path)
        .jpeg({ quality: parseInt(quality) })
        .toBuffer();
      
      const optimizedImageBase64 = optimizedImageBuffer.toString('base64');
      const compressionRatio = ((req.file.size - optimizedImageBuffer.length) / req.file.size * 100).toFixed(2);
      
      res.json({
        success: true,
        originalSize: req.file.size,
        optimizedSize: optimizedImageBuffer.length,
        compressionRatio: compressionRatio + '%',
        quality: quality,
        imageData: `data:image/jpeg;base64,${optimizedImageBase64}`
      });
    } catch (error) {
      res.status(500).json({ error: 'Image optimization failed', message: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;