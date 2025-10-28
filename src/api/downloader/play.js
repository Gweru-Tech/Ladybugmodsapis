const axios = require('axios');
const yts = require('yt-search');

module.exports = function(app) {
    const ytdown = {
        api: {
            base: "https://p.oceansaver.in/ajax/",
            progress: "https://p.oceansaver.in/ajax/progress.php"
        },
        headers: {
            'authority': 'p.oceansaver.in',
            'origin': 'https://y2down.cc',
            'referer': 'https://y2down.cc/',
            'user-agent': 'Postify/1.0.0'
        },
        isUrl: str => {
            try { new URL(str); return true; } catch { return false; }
        },
        youtube: url => {
            if (!url) return null;
            const patterns = [
                /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
                /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
                /youtu\.be\/([a-zA-Z0-9_-]{11})/
            ];
            for (let p of patterns) {
                const match = url.match(p);
                if (match) return match[1];
            }
            return null;
        },
        request: async (endpoint, params = {}) => {
            try {
                const { data } = await axios.get(`$${ytdown.api.base}$$ {endpoint}`, {
                    params,
                    headers: ytdown.headers,
                    timeout: 30000, // 30 second timeout
                    responseType: 'json'
                });
                return data;
            } catch (error) {
                console.error('Request error:', error.message);
                throw new Error(`API request failed: ${error.message}`);
            }
        },
        download: async (link) => {
            const id = ytdown.youtube(link);
            if (!id) throw new Error("Gagal ekstrak ID YouTube");
            
            const response = await ytdown.request("download.php", {
                format: 'mp3',
                url: `https://www.youtube.com/watch?v=${id}`
            });
            
            console.log('Download response:', response); // Debug log
            
            if (!response || !response.success) {
                throw new Error(response?.message || "Download request failed");
            }
            
            if (!response.id) {
                throw new Error("No download ID received from API");
            }
            
            const pr = await ytdown.checkProgress(response.id);
            if (!pr.success) {
                throw new Error(pr.error || "Gagal ambil link download");
            }
            
            return {
                title: response.title || "Unknown",
                id,
                thumbnail: response.info?.image || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
                download: pr.download_url
            };
        },
        checkProgress: async (id) => {
            let attempts = 0;
            const maxAttempts = 60; // Reduced from 100
            
            while (attempts < maxAttempts) {
                try {
                    const res = await axios.get(ytdown.api.progress, {
                        params: { id },
                        headers: ytdown.headers,
                        timeout: 10000,
                        responseType: 'json'
                    });
                    
                    console.log(`Progress check ${attempts + 1}:`, res.data); // Debug log
                    
                    if (res.data.success && res.data.download_url) {
                        return { success: true, download_url: res.data.download_url };
                    }
                    
                    // Check if there's an error in response
                    if (res.data.error) {
                        return { success: false, error: res.data.error };
                    }
                } catch (error) {
                    console.error(`Progress check error (attempt ${attempts + 1}):`, error.message);
                }
                
                await new Promise(r => setTimeout(r, 2000)); // Increased to 2 seconds
                attempts++;
            }
            
            return { success: false, error: "Timeout, gagal ambil link download" };
        }
    };

    app.get('/dl/yt/play', async (req, res) => {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                status: false, 
                error: "Parameter 'query' diperlukan" 
            });
        }

        try {
            console.log('Searching for:', query); // Debug log
            
            // Search for video
            const searchResult = await yts(query);
            
            if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) {
                return res.status(404).json({ 
                    status: false, 
                    error: "Video tidak ditemukan" 
                });
            }
            
            const video = searchResult.videos[0];
            console.log('Found video:', video.title, video.url); // Debug log

            // Download mp3
            const mp3 = await ytdown.download(video.url);

            res.json({
                status: true,
                creator: "Ntando Mods",
                result: {
                    video: {
                        title: video.title,
                        url: video.url,
                        description: video.description,
                        duration: video.timestamp,
                        views: video.views,
                        thumbnail: video.thumbnail
                    },
                    mp3
                }
            });
        } catch (err) {
            console.error('API Error:', err); // Debug log
            res.status(500).json({ 
                status: false, 
                error: err.message || "Internal server error"
            });
        }
    });
};
