# API Hub - Comprehensive API Platform

A powerful, modern API platform offering 8 different API categories with 50+ endpoints for various use cases including AI processing, YouTube data, image manipulation, business analytics, and more.

## 🚀 Features

### API Categories
- **Download APIs** - File downloads, video info extraction, batch URL processing
- **AI APIs** - Text summarization, sentiment analysis, language detection, text generation
- **YouTube APIs** - Video information, transcript extraction, channel data, search
- **Tools APIs** - URL shortener, QR code generator, password generator, text utilities
- **Image APIs** - Image resize, filters, format conversion, optimization
- **NSF APIs** - National Science Foundation data, research awards, trends
- **Imagine APIs** - Story generation, poetry, character creation, dialogue
- **Business APIs** - Company data, stock prices, financial ratios, market data

### Platform Features
- 🎨 Modern, responsive web interface
- 📖 Comprehensive API documentation
- 🔍 Interactive API testing interface
- 🛡️ Built-in security with Helmet.js
- ⚡ Rate limiting and request validation
- 📊 Real-time health monitoring
- 🌐 CORS support for cross-origin requests
- 📱 Mobile-responsive design

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Security**: Helmet.js, CORS, Express Rate Limiter
- **Image Processing**: Sharp.js
- **File Uploads**: Multer
- **Validation**: Express Validator
- **Deployment**: Render.com compatible

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/api-hub.git
   cd api-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser
   - API documentation: http://localhost:3000/docs
   - Health check: http://localhost:3000/health

## 🌐 Deployment on Render.com

### Quick Deploy (One Click)

1. **Fork this repository** to your GitHub account
2. **Go to Render.com** and click "New Web Service"
3. **Connect your GitHub account** and select the forked repository
4. **Configure deployment settings**:
   - Name: `api-hub`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free` or `Starter`
5. **Add Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `ALLOWED_ORIGINS`: `https://your-app-name.onrender.com`
6. **Deploy!**

### Manual Deploy with render.yaml

1. **Create a Render account** at [render.com](https://render.com)
2. **Fork this repository** to your GitHub account
3. **Push the render.yaml file** (already included) to your repository
4. **In Render dashboard**, click "New" → "Web Service"
5. **Connect your GitHub repository**
6. **Render will automatically detect** the render.yaml configuration
7. **Review and deploy**

### Environment Variables for Production

Set these in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://your-app-name.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

### Base URL
```
Production: https://your-app-name.onrender.com
Development: http://localhost:3000
```

### Authentication
Currently, all APIs are open and don't require authentication. API keys will be introduced in future versions.

### Rate Limiting
- **Free Tier**: 100 requests per 15 minutes per IP
- **Pro Tier**: 1000 requests per 15 minutes per IP
- **Enterprise**: Unlimited requests

### Quick API Examples

#### Text Summarization
```bash
curl -X POST https://your-app-name.onrender.com/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text here...",
    "length": "medium"
  }'
```

#### YouTube Video Info
```bash
curl -X POST https://your-app-name.onrender.com/api/youtube/video-info \
  -H "Content-Type: application/json" \
  -d '{"videoId": "dQw4w9WgXcQ"}'
```

#### Image Resize
```bash
curl -X POST https://your-app-name.onrender.com/api/image/resize \
  -F "image=@your-image.jpg" \
  -F "width=800" \
  -F "height=600"
```

## 🎯 API Endpoints Overview

### Download APIs
- `POST /api/download/file` - Get file download info
- `POST /api/download/video-info` - Extract video information
- `POST /api/download/batch` - Process multiple URLs
- `POST /api/download/validate` - Validate URLs

### AI APIs
- `POST /api/ai/summarize` - Text summarization
- `POST /api/ai/sentiment` - Sentiment analysis
- `POST /api/ai/generate` - Text generation
- `POST /api/ai/detect-language` - Language detection
- `POST /api/ai/extract-text` - Text extraction

### YouTube APIs
- `POST /api/youtube/video-info` - Video information
- `POST /api/youtube/transcript` - Transcript extraction
- `POST /api/youtube/search` - Video search
- `POST /api/youtube/channel-info` - Channel data
- `POST /api/youtube/playlist` - Playlist videos

### Tools APIs
- `POST /api/tools/shorten-url` - URL shortener
- `POST /api/tools/generate-qr` - QR code generator
- `POST /api/tools/generate-password` - Password generator
- `POST /api/tools/text-utils` - Text utilities
- `POST /api/tools/convert-color` - Color converter
- `POST /api/tools/format-json` - JSON formatter

### Image APIs
- `POST /api/image/resize` - Resize images
- `POST /api/image/convert` - Format conversion
- `POST /api/image/filter` - Apply filters
- `POST /api/image/placeholder` - Generate placeholders
- `POST /api/image/metadata` - Extract metadata
- `POST /api/image/optimize` - Optimize images

### NSF APIs
- `POST /api/nsf/search-awards` - Search NSF awards
- `POST /api/nsf/award-details` - Get award details
- `POST /api/nsf/programs` - List programs
- `POST /api/nsf/institutions` - Institution data
- `POST /api/nsf/research-trends` - Research trends

### Imagine APIs
- `POST /api/imagine/generate-story` - Generate stories
- `POST /api/imagine/generate-poem` - Create poetry
- `POST /api/imagine/generate-character` - Character design
- `POST /api/imagine/generate-dialogue` - Dialogue generation
- `POST /api/imagine/generate-world` - World building

### Business APIs
- `POST /api/business/company-info` - Company information
- `POST /api/business/stock-data` - Stock price data
- `POST /api/business/financial-ratios` - Financial metrics
- `POST /api/business/market-indices` - Market indices
- `POST /api/business/economic-indicators` - Economic data
- `POST /api/business/industry-analysis` - Industry analysis
- `POST /api/business/company-news` - Company news

## 🧪 Testing

### Running Tests
```bash
# Install test dependencies
npm test

# Run with coverage
npm run test:coverage
```

### Interactive Testing
- Visit http://localhost:3000 for the web interface
- Use the built-in API testing tools
- Check /docs for detailed API documentation

## 📝 Development

### Project Structure
```
api-hub/
├── api/                    # API route handlers
│   ├── download.js        # Download APIs
│   ├── ai.js             # AI APIs
│   ├── youtube.js        # YouTube APIs
│   ├── tools.js          # Tools APIs
│   ├── image.js          # Image APIs
│   ├── nsf.js            # NSF APIs
│   ├── imagine.js        # Imagine APIs
│   └── business.js       # Business APIs
├── public/               # Frontend assets
│   ├── index.html       # Main page
│   ├── docs.html        # Documentation
│   ├── style.css        # Styles
│   └── script.js        # Frontend JavaScript
├── server.js            # Main server file
├── package.json         # Dependencies
├── render.yaml          # Render.com configuration
├── .env.example         # Environment template
└── README.md           # This file
```

### Adding New APIs

1. **Create a new route file** in the `api/` directory
2. **Implement your endpoints** with proper validation
3. **Add documentation** to `docs.html`
4. **Update the main page** in `index.html`
5. **Test thoroughly** before deploying

### Code Style
- Use ES6+ features
- Follow JavaScript Standard Style
- Add proper error handling
- Include validation for all inputs
- Document complex logic

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

## 🚨 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Input Validation** - Request sanitization
- **File Upload Limits** - Size and type restrictions
- **Error Handling** - Secure error responses

## 📊 Monitoring

### Health Check
- Endpoint: `/health`
- Returns: Server status, uptime, version
- Used by: Load balancers, monitoring systems

### Logging
- Request logging with Morgan
- Error logging with timestamps
- Structured log format for easy parsing

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Keep PRs focused and atomic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: https://your-app-name.onrender.com/docs
- **Issues**: [GitHub Issues](https://github.com/your-username/api-hub/issues)
- **Email**: support@api-hub.com

## 🎉 Acknowledgments

- Express.js team for the amazing framework
- Sharp.js for image processing
- Font Awesome for icons
- The open-source community

## 📈 Roadmap

### Version 2.0 (Coming Soon)
- [ ] API key authentication
- [ ] User dashboard
- [ ] Usage analytics
- [ ] Advanced rate limiting
- [ ] Webhook support
- [ ] API versioning

### Version 3.0 (Future)
- [ ] GraphQL support
- [ ] Real-time WebSocket APIs
- [ ] Machine learning model hosting
- [ ] Custom API endpoints
- [ ] Enterprise SSO integration

---

**Built with ❤️ by the API Hub Team**