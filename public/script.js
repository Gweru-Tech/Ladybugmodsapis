// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('apiModal');
const modalTitle = document.getElementById('modalTitle');
const apiTestArea = document.getElementById('apiTestArea');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// API Testing Functions
function testAPI(category) {
    openModal();
    modalTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} API Testing`;
    
    const testForms = {
        download: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="downloadUrl">URL to Test:</label>
                    <input type="url" id="downloadUrl" placeholder="https://example.com/file.pdf" required>
                </div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testDownloadAPI()">Test Download Info</button>
                    <button class="btn btn-outline" onclick="testBatchDownload()">Test Batch URLs</button>
                </div>
                <div id="downloadResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="downloadResult"></pre>
                </div>
            </div>
        `,
        ai: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="aiText">Text to Process:</label>
                    <textarea id="aiText" placeholder="Enter your text here..." required>This is a sample text for AI processing. The AI will analyze this text and provide various insights such as sentiment analysis, language detection, and summarization based on your selection.</textarea>
                </div>
                <div class="form-group">
                    <label for="aiOperation">Operation:</label>
                    <select id="aiOperation">
                        <option value="summarize">Summarize</option>
                        <option value="sentiment">Sentiment Analysis</option>
                        <option value="generate">Generate Text</option>
                        <option value="detect">Detect Language</option>
                    </select>
                </div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testAIAPI()">Process Text</button>
                </div>
                <div id="aiResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="aiResult"></pre>
                </div>
            </div>
        `,
        youtube: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="youtubeVideoId">YouTube Video ID:</label>
                    <input type="text" id="youtubeVideoId" placeholder="dQw4w9WgXcQ" required>
                </div>
                <div class="form-group">
                    <label for="youtubeOperation">Operation:</label>
                    <select id="youtubeOperation">
                        <option value="info">Get Video Info</option>
                        <option value="transcript">Get Transcript</option>
                        <option value="search">Search Videos</option>
                    </select>
                </div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testYouTubeAPI()">Execute Request</button>
                </div>
                <div id="youtubeResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="youtubeResult"></pre>
                </div>
            </div>
        `,
        tools: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="toolOperation">Tool:</label>
                    <select id="toolOperation" onchange="updateToolForm()">
                        <option value="shorten">URL Shortener</option>
                        <option value="qr">QR Code Generator</option>
                        <option value="password">Password Generator</option>
                        <option value="text">Text Utilities</option>
                        <option value="color">Color Converter</option>
                    </select>
                </div>
                <div id="toolForm"></div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testToolsAPI()">Execute Tool</button>
                </div>
                <div id="toolsResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="toolsResult"></pre>
                </div>
            </div>
        `,
        image: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="imageOperation">Image Operation:</label>
                    <select id="imageOperation">
                        <option value="resize">Resize Image</option>
                        <option value="convert">Convert Format</option>
                        <option value="filter">Apply Filter</option>
                        <option value="optimize">Optimize Image</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="imageFile">Upload Image:</label>
                    <input type="file" id="imageFile" accept="image/*" onchange="previewImage()">
                </div>
                <div id="imageOptions"></div>
                <div id="imagePreview" style="margin: 1rem 0;"></div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testImageAPI()">Process Image</button>
                </div>
                <div id="imageResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="imageResult"></pre>
                </div>
            </div>
        `,
        nsf: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="nsfOperation">NSF Operation:</label>
                    <select id="nsfOperation">
                        <option value="search">Search Awards</option>
                        <option value="programs">Get Programs</option>
                        <option value="institutions">Get Institutions</option>
                        <option value="trends">Research Trends</option>
                    </select>
                </div>
                <div id="nsfOptions"></div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testNSFAPI()">Get NSF Data</button>
                </div>
                <div id="nsfResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="nsfResult"></pre>
                </div>
            </div>
        `,
        imagine: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="imagineOperation">Creative Operation:</label>
                    <select id="imagineOperation" onchange="updateImagineForm()">
                        <option value="story">Generate Story</option>
                        <option value="poem">Generate Poem</option>
                        <option value="character">Create Character</option>
                        <option value="dialogue">Generate Dialogue</option>
                        <option value="world">Build World</option>
                    </select>
                </div>
                <div id="imagineForm"></div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testImagineAPI()">Create Content</button>
                </div>
                <div id="imagineResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="imagineResult"></pre>
                </div>
            </div>
        `,
        business: `
            <div class="api-test-form">
                <div class="form-group">
                    <label for="businessOperation">Business Operation:</label>
                    <select id="businessOperation">
                        <option value="company">Company Info</option>
                        <option value="stock">Stock Data</option>
                        <option value="ratios">Financial Ratios</option>
                        <option value="indices">Market Indices</option>
                        <option value="economic">Economic Indicators</option>
                    </select>
                </div>
                <div id="businessForm"></div>
                <div class="test-buttons">
                    <button class="btn btn-primary" onclick="testBusinessAPI()">Get Business Data</button>
                </div>
                <div id="businessResponse" class="api-response" style="display: none;">
                    <h4>Response:</h4>
                    <pre id="businessResult"></pre>
                </div>
            </div>
        `
    };
    
    apiTestArea.innerHTML = testForms[category] || '<p>API testing not available for this category.</p>';
    
    // Initialize specific forms
    if (category === 'tools') updateToolForm();
    if (category === 'imagine') updateImagineForm();
    if (category === 'nsf') updateNSFForm();
    if (category === 'business') updateBusinessForm();
}

// Download API Tests
async function testDownloadAPI() {
    const url = document.getElementById('downloadUrl').value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    showLoading('downloadResponse');
    
    try {
        const response = await fetch('/api/download/file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        displayResult('downloadResponse', 'downloadResult', data);
    } catch (error) {
        displayResult('downloadResponse', 'downloadResult', { error: error.message });
    }
}

async function testBatchDownload() {
    const urls = [
        'https://example.com/file1.pdf',
        'https://example.com/file2.jpg',
        'https://example.com/file3.png'
    ];
    
    showLoading('downloadResponse');
    
    try {
        const response = await fetch('/api/download/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls })
        });
        
        const data = await response.json();
        displayResult('downloadResponse', 'downloadResult', data);
    } catch (error) {
        displayResult('downloadResponse', 'downloadResult', { error: error.message });
    }
}

// AI API Tests
async function testAIAPI() {
    const text = document.getElementById('aiText').value;
    const operation = document.getElementById('aiOperation').value;
    
    if (!text) {
        alert('Please enter text to process');
        return;
    }
    
    showLoading('aiResponse');
    
    try {
        let endpoint = '/api/ai/';
        let body = { text };
        
        switch (operation) {
            case 'summarize':
                endpoint += 'summarize';
                body.length = 'medium';
                break;
            case 'sentiment':
                endpoint += 'sentiment';
                break;
            case 'generate':
                endpoint += 'generate';
                body.prompt = text;
                delete body.text;
                break;
            case 'detect':
                endpoint += 'detect-language';
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResult('aiResponse', 'aiResult', data);
    } catch (error) {
        displayResult('aiResponse', 'aiResult', { error: error.message });
    }
}

// YouTube API Tests
async function testYouTubeAPI() {
    const videoId = document.getElementById('youtubeVideoId').value;
    const operation = document.getElementById('youtubeOperation').value;
    
    if (!videoId) {
        alert('Please enter a YouTube video ID');
        return;
    }
    
    showLoading('youtubeResponse');
    
    try {
        let endpoint = '/api/youtube/';
        let body = { videoId };
        
        switch (operation) {
            case 'info':
                endpoint += 'video-info';
                break;
            case 'transcript':
                endpoint += 'transcript';
                break;
            case 'search':
                endpoint += 'search';
                body.query = videoId;
                delete body.videoId;
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResult('youtubeResponse', 'youtubeResult', data);
    } catch (error) {
        displayResult('youtubeResponse', 'youtubeResult', { error: error.message });
    }
}

// Tools API Tests
function updateToolForm() {
    const operation = document.getElementById('toolOperation').value;
    const toolForm = document.getElementById('toolForm');
    
    const forms = {
        shorten: `
            <div class="form-group">
                <label for="toolUrl">URL to Shorten:</label>
                <input type="url" id="toolUrl" placeholder="https://example.com/very-long-url" required>
            </div>
        `,
        qr: `
            <div class="form-group">
                <label for="qrText">Text or URL:</label>
                <input type="text" id="qrText" placeholder="Enter text or URL" required>
            </div>
            <div class="form-group">
                <label for="qrSize">Size:</label>
                <input type="number" id="qrSize" value="200" min="100" max="500">
            </div>
        `,
        password: `
            <div class="form-group">
                <label for="passLength">Length:</label>
                <input type="number" id="passLength" value="12" min="8" max="32">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="includeUppercase" checked> Include Uppercase
                </label>
                <label>
                    <input type="checkbox" id="includeLowercase" checked> Include Lowercase
                </label>
                <label>
                    <input type="checkbox" id="includeNumbers" checked> Include Numbers
                </label>
                <label>
                    <input type="checkbox" id="includeSymbols" checked> Include Symbols
                </label>
            </div>
        `,
        text: `
            <div class="form-group">
                <label for="textContent">Text:</label>
                <textarea id="textContent" placeholder="Enter your text here..." required>Hello World! This is a sample text for testing text utilities.</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="uppercase"> Uppercase
                </label>
                <label>
                    <input type="checkbox" id="lowercase"> Lowercase
                </label>
                <label>
                    <input type="checkbox" id="reverse"> Reverse
                </label>
                <label>
                    <input type="checkbox" id="wordCount"> Word Count
                </label>
            </div>
        `,
        color: `
            <div class="form-group">
                <label for="colorValue">Color Value:</label>
                <input type="text" id="colorValue" placeholder="#FF6347" required>
            </div>
            <div class="form-group">
                <label for="fromFormat">From Format:</label>
                <select id="fromFormat">
                    <option value="hex">Hex</option>
                    <option value="rgb">RGB</option>
                    <option value="hsl">HSL</option>
                </select>
            </div>
            <div class="form-group">
                <label for="toFormat">To Format:</label>
                <select id="toFormat">
                    <option value="rgb">RGB</option>
                    <option value="hex">Hex</option>
                    <option value="hsl">HSL</option>
                </select>
            </div>
        `
    };
    
    toolForm.innerHTML = forms[operation] || '';
}

async function testToolsAPI() {
    const operation = document.getElementById('toolOperation').value;
    
    showLoading('toolsResponse');
    
    try {
        let endpoint = '/api/tools/';
        let body = {};
        
        switch (operation) {
            case 'shorten':
                endpoint += 'shorten-url';
                body.url = document.getElementById('toolUrl').value;
                break;
            case 'qr':
                endpoint += 'generate-qr';
                body.text = document.getElementById('qrText').value;
                body.size = parseInt(document.getElementById('qrSize').value);
                break;
            case 'password':
                endpoint += 'generate-password';
                body.length = parseInt(document.getElementById('passLength').value);
                body.includeUppercase = document.getElementById('includeUppercase').checked;
                body.includeLowercase = document.getElementById('includeLowercase').checked;
                body.includeNumbers = document.getElementById('includeNumbers').checked;
                body.includeSymbols = document.getElementById('includeSymbols').checked;
                break;
            case 'text':
                endpoint += 'text-utils';
                body.text = document.getElementById('textContent').value;
                body.operations = [];
                if (document.getElementById('uppercase').checked) body.operations.push('uppercase');
                if (document.getElementById('lowercase').checked) body.operations.push('lowercase');
                if (document.getElementById('reverse').checked) body.operations.push('reverse');
                if (document.getElementById('wordCount').checked) body.operations.push('wordCount');
                break;
            case 'color':
                endpoint += 'convert-color';
                body.color = document.getElementById('colorValue').value;
                body.fromFormat = document.getElementById('fromFormat').value;
                body.toFormat = document.getElementById('toFormat').value;
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResult('toolsResponse', 'toolsResult', data);
    } catch (error) {
        displayResult('toolsResponse', 'toolsResult', { error: error.message });
    }
}

// Image API Tests
function previewImage() {
    const fileInput = document.getElementById('imageFile');
    const preview = document.getElementById('imagePreview');
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

async function testImageAPI() {
    const fileInput = document.getElementById('imageFile');
    const operation = document.getElementById('imageOperation').value;
    
    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please select an image file');
        return;
    }
    
    showLoading('imageResponse');
    
    try {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        
        if (operation === 'resize') {
            formData.append('width', '300');
            formData.append('height', '300');
        } else if (operation === 'convert') {
            formData.append('format', 'jpeg');
        } else if (operation === 'filter') {
            formData.append('filter', 'grayscale');
        } else if (operation === 'optimize') {
            formData.append('quality', '80');
        }
        
        let endpoint = '/api/image/';
        switch (operation) {
            case 'resize': endpoint += 'resize'; break;
            case 'convert': endpoint += 'convert'; break;
            case 'filter': endpoint += 'filter'; break;
            case 'optimize': endpoint += 'optimize'; break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        displayResult('imageResponse', 'imageResult', data);
    } catch (error) {
        displayResult('imageResponse', 'imageResult', { error: error.message });
    }
}

// NSF API Tests
function updateNSFForm() {
    const operation = document.getElementById('nsfOperation').value;
    const nsfOptions = document.getElementById('nsfOptions');
    
    const forms = {
        search: `
            <div class="form-group">
                <label for="nsfKeyword">Keyword:</label>
                <input type="text" id="nsfKeyword" placeholder="machine learning">
            </div>
            <div class="form-group">
                <label for="nsfYear">Year:</label>
                <input type="number" id="nsfYear" value="2024" min="2000" max="2024">
            </div>
        `,
        programs: `
            <div class="form-group">
                <label for="nsfDirectorate">Directorate:</label>
                <input type="text" id="nsfDirectorate" placeholder="Computer & Information Science">
            </div>
        `,
        institutions: `
            <div class="form-group">
                <label for="nsfState">State:</label>
                <input type="text" id="nsfState" placeholder="CA" maxlength="2">
            </div>
            <div class="form-group">
                <label for="nsfType">Type:</label>
                <select id="nsfType">
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="research_institute">Research Institute</option>
                </select>
            </div>
        `,
        trends: `
            <div class="form-group">
                <label for="nsfField">Field:</label>
                <input type="text" id="nsfField" placeholder="Computer Science">
            </div>
        `
    };
    
    nsfOptions.innerHTML = forms[operation] || '';
}

async function testNSFAPI() {
    const operation = document.getElementById('nsfOperation').value;
    
    showLoading('nsfResponse');
    
    try {
        let endpoint = '/api/nsf/';
        let body = {};
        
        switch (operation) {
            case 'search':
                endpoint += 'search-awards';
                body.keyword = document.getElementById('nsfKeyword').value || 'technology';
                body.year = parseInt(document.getElementById('nsfYear').value) || 2024;
                break;
            case 'programs':
                endpoint += 'programs';
                body.directorate = document.getElementById('nsfDirectorate').value;
                break;
            case 'institutions':
                endpoint += 'institutions';
                body.state = document.getElementById('nsfState').value;
                body.institutionType = document.getElementById('nsfType').value;
                break;
            case 'trends':
                endpoint += 'research-trends';
                body.field = document.getElementById('nsfField').value || 'Computer Science';
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResult('nsfResponse', 'nsfResult', data);
    } catch (error) {
        displayResult('nsfResponse', 'nsfResult', { error: error.message });
    }
}

// Imagine API Tests
function updateImagineForm() {
    const operation = document.getElementById('imagineOperation').value;
    const imagineForm = document.getElementById('imagineForm');
    
    const forms = {
        story: `
            <div class="form-group">
                <label for="storyPrompt">Story Prompt:</label>
                <textarea id="storyPrompt" placeholder="Enter your story prompt..." required>A mysterious artifact discovered in an ancient temple</textarea>
            </div>
            <div class="form-group">
                <label for="storyGenre">Genre:</label>
                <select id="storyGenre">
                    <option value="fantasy">Fantasy</option>
                    <option value="scifi">Sci-Fi</option>
                    <option value="romance">Romance</option>
                    <option value="mystery">Mystery</option>
                    <option value="horror">Horror</option>
                    <option value="adventure">Adventure</option>
                </select>
            </div>
            <div class="form-group">
                <label for="storyLength">Length:</label>
                <select id="storyLength">
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                </select>
            </div>
        `,
        poem: `
            <div class="form-group">
                <label for="poemTheme">Theme:</label>
                <input type="text" id="poemTheme" value="nature" placeholder="Enter theme..." required>
            </div>
            <div class="form-group">
                <label for="poemStyle">Style:</label>
                <select id="poemStyle">
                    <option value="haiku">Haiku</option>
                    <option value="sonnet">Sonnet</option>
                    <option value="free_verse">Free Verse</option>
                    <option value="limerick">Limerick</option>
                </select>
            </div>
            <div class="form-group">
                <label for="poemMood">Mood:</label>
                <select id="poemMood">
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="romantic">Romantic</option>
                    <option value="mysterious">Mysterious</option>
                    <option value="inspiring">Inspiring</option>
                </select>
            </div>
        `,
        character: `
            <div class="form-group">
                <label for="characterType">Character Type:</label>
                <input type="text" id="characterType" value="wizard" placeholder="wizard, warrior, rogue..." required>
            </div>
            <div class="form-group">
                <label for="characterSetting">Setting:</label>
                <input type="text" id="characterSetting" value="medieval fantasy" placeholder="setting...">
            </div>
            <div class="form-group">
                <label for="characterTraits">Traits (comma-separated):</label>
                <input type="text" id="characterTraits" placeholder="brave, intelligent, mysterious">
            </div>
        `,
        dialogue: `
            <div class="form-group">
                <label for="dialogueCharacters">Characters (comma-separated):</label>
                <input type="text" id="dialogueCharacters" value="Hero, Villain" placeholder="Character 1, Character 2...">
            </div>
            <div class="form-group">
                <label for="dialogueSituation">Situation:</label>
                <textarea id="dialogueSituation" placeholder="Describe the situation..." required>A tense confrontation in a dark alley</textarea>
            </div>
            <div class="form-group">
                <label for="dialogueTone">Tone:</label>
                <select id="dialogueTone">
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="tense">Tense</option>
                    <option value="humorous">Humorous</option>
                    <option value="dramatic">Dramatic</option>
                </select>
            </div>
        `,
        world: `
            <div class="form-group">
                <label for="worldType">World Type:</label>
                <input type="text" id="worldType" value="fantasy" placeholder="fantasy, scifi, modern..." required>
            </div>
            <div class="form-group">
                <label for="worldAtmosphere">Atmosphere:</label>
                <input type="text" id="worldAtmosphere" value="mysterious" placeholder="mysterious, peaceful, dangerous...">
            </div>
            <div class="form-group">
                <label for="worldInhabitants">Inhabitants:</label>
                <input type="text" id="worldInhabitants" value="diverse species" placeholder="description of inhabitants...">
            </div>
        `
    };
    
    imagineForm.innerHTML = forms[operation] || '';
}

async function testImagineAPI() {
    const operation = document.getElementById('imagineOperation').value;
    
    showLoading('imagineResponse');
    
    try {
        let endpoint = '/api/imagine/';
        let body = {};
        
        switch (operation) {
            case 'story':
                endpoint += 'generate-story';
                body.prompt = document.getElementById('storyPrompt').value;
                body.genre = document.getElementById('storyGenre').value;
                body.length = document.getElementById('storyLength').value;
                break;
            case 'poem':
                endpoint += 'generate-poem';
                body.theme = document.getElementById('poemTheme').value;
                body.style = document.getElementById('poemStyle').value;
                body.mood = document.getElementById('poemMood').value;
                break;
            case 'character':
                endpoint += 'generate-character';
                body.characterType = document.getElementById('characterType').value;
                body.setting = document.getElementById('characterSetting').value;
                body.traits = document.getElementById('characterTraits').value.split(',').map(t => t.trim()).filter(t => t);
                break;
            case 'dialogue':
                endpoint += 'generate-dialogue';
                body.characters = document.getElementById('dialogueCharacters').value.split(',').map(c => c.trim());
                body.situation = document.getElementById('dialogueSituation').value;
                body.tone = document.getElementById('dialogueTone').value;
                break;
            case 'world':
                endpoint += 'generate-world';
                body.worldType = document.getElementById('worldType').value;
                body.atmosphere = document.getElementById('worldAtmosphere').value;
                body.inhabitants = document.getElementById('worldInhabitants').value;
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResult('imagineResponse', 'imagineResult', data);
    } catch (error) {
        displayResult('imagineResponse', 'imagineResult', { error: error.message });
    }
}

// Business API Tests
function updateBusinessForm() {
    const operation = document.getElementById('businessOperation').value;
    const businessForm = document.getElementById('businessForm');
    
    const forms = {
        company: `
            <div class="form-group">
                <label for="companyName">Company Name:</label>
                <input type="text" id="companyName" placeholder="Apple Inc." required>
            </div>
            <div class="form-group">
                <label for="companyTicker">Ticker (optional):</label>
                <input type="text" id="companyTicker" placeholder="AAPL">
            </div>
        `,
        stock: `
            <div class="form-group">
                <label for="stockTicker">Ticker Symbol:</label>
                <input type="text" id="stockTicker" placeholder="AAPL" required>
            </div>
            <div class="form-group">
                <label for="stockPeriod">Period:</label>
                <select id="stockPeriod">
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                    <option value="1m" selected>1 Month</option>
                    <option value="3m">3 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="1y">1 Year</option>
                    <option value="5y">5 Years</option>
                </select>
            </div>
        `,
        ratios: `
            <div class="form-group">
                <label for="ratiosTicker">Ticker Symbol:</label>
                <input type="text" id="ratiosTicker" placeholder="AAPL" required>
            </div>
        `,
        indices: `
            <div class="form-group">
                <label for="indicesList">Indices (comma-separated):</label>
                <input type="text" id="indicesList" value="S&P 500, NASDAQ, DOW JONES" placeholder="S&P 500, NASDAQ...">
            </div>
        `,
        economic: `
            <div class="form-group">
                <label for="economicCountry">Country:</label>
                <input type="text" id="economicCountry" value="United States" placeholder="Country name...">
            </div>
        `
    };
    
    businessForm.innerHTML = forms[operation] || '';
}

async function testBusinessAPI() {
    const operation = document.getElementById('businessOperation').value;
    
    showLoading('businessResponse');
    
    try {
        let endpoint = '/api/business/';
        let body = {};
        
        switch (operation) {
            case 'company':
                endpoint += 'company-info';
                body.companyName = document.getElementById('companyName').value;
                body.ticker = document.getElementById('companyTicker').value;
                break;
            case 'stock':
                endpoint += 'stock-data';
                body.ticker = document.getElementById('stockTicker').value;
                body.period = document.getElementById('stockPeriod').value;
                break;
            case 'ratios':
                endpoint += 'financial-ratios';
                body.ticker = document.getElementById('ratiosTicker').value;
                break;
            case 'indices':
                endpoint += 'market-indices';
                body.indices = document.getElementById('indicesList').value.split(',').map(i => i.trim());
                break;
            case 'economic':
                endpoint += 'economic-indicators';
                body.country = document.getElementById('economicCountry').value;
                break;
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        displayResult('businessResponse', 'businessResult', data);
    } catch (error) {
        displayResult('businessResponse', 'businessResult', { error: error.message });
    }
}

// Utility Functions
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showLoading(responseId) {
    const responseDiv = document.getElementById(responseId);
    responseDiv.style.display = 'block';
    responseDiv.innerHTML = '<div class="loading"></div> Processing request...';
}

function displayResult(responseId, resultId, data) {
    const responseDiv = document.getElementById(responseId);
    const resultDiv = document.getElementById(resultId);
    
    responseDiv.style.display = 'block';
    responseDiv.innerHTML = `
        <h4>Response:</h4>
        <pre id="${resultId}"></pre>
    `;
    
    document.getElementById(resultId).textContent = JSON.stringify(data, null, 2);
    
    // Add syntax highlighting class based on response
    if (data.success || data.status === 'OK') {
        responseDiv.classList.add('success');
        responseDiv.classList.remove('error');
    } else if (data.error) {
        responseDiv.classList.add('error');
        responseDiv.classList.remove('success');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.api-card, .feature, .pricing-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Add smooth scroll behavior for navigation bar background
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Initialize forms on page load
document.addEventListener('DOMContentLoaded', () => {
    updateToolForm();
    updateImagineForm();
    updateNSFForm();
    updateBusinessForm();
});