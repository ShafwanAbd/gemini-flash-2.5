# Maju Bareng AI
## AI for IT Developer (Batch 13)

This is a simple project from *Maju Bareng AI - AI for IT Developer from Hacktiv8* demonstrating how to use **Gemini API** (Flash 2.5 model) in back-end only with support for:
- Text generation
- Image(s) understanding
- Document(s) understanding
- Audio(s) understanding

## 🚀 Features
- Generate text from prompts
- Analyze and describe single or multiple images, documents, and audios
- Combine text + images in one request
- Easy setup and usage

## 📂 Project Structure
```
gemini-flash-api/
│── .env                  # Environment variables (API keys, configs)
│── index.js              # Main entry point (server or script)
│── package.json          # Project metadata & dependencies
│── package-lock.json     # Auto-generated exact dependency versions
│── README.md             # Project documentation
```

## 🔧 Installation
```bash
# Clone the repository
git clone https://github.com/ShafwanAbd/gemini-flash-2.5.git gemini-flash-api

# Navigate into the project folder
cd gemini-flash-api

# Install dependencies
npm install
```

## ▶️ Usage
### 1. Generate Text
```javascript
app.post('/generate-text', async (req, res) => {
    try {
        const { prompt } = req.body;
        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        });
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});
```

### 2. Generate from Image(s)
```javascript
app.post('/generate-from-image', upload.array('images', 5), async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded.' });
        }

        const imageParts = req.files.map(file => ({
            inlineData: {
                mimeType: file.mimetype,
                data: file.buffer.toString('base64')
            }
        }));

        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            // Added the 'default' prompt so it's like the other method
            contents: [{ text: prompt || "Jelaskan gambar berikut" }, ...imageParts]
        });
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})
```

## How to Use?
Since we only playing with the back-end, so we will be using Postman to check the back-end locally, steps you need to do:
- Open Postman
- Set to POST
- Type one of these:
  - http://localhost:3000/generate-text 
  - http://localhost:3000/generate-from-image 
  - http://localhost:3000/generate-from-document
  - http://localhost:3000/generate-from-audio
- For generate-text, you only need one key prompt and a value
- Other than generate-text, add a key (images, documents, audios), one key prompt (optional) and a value
- Click 'Send'
<img width="1380" height="453" alt="image" src="https://github.com/user-attachments/assets/88c36810-8956-4901-9260-61b76f55373c" />

- The Gemini will give the result
<img width="1368" height="399" alt="image" src="https://github.com/user-attachments/assets/ccf07c1a-0a8e-45ee-b700-917eecc40794" />

## 📌 Notes
- Ensure your Gemini API key is properly set in the `.env` file.
  
##### So far i'm having fun too doing the submission, the mentor is energetic and easy to understand too, i'm loving it.
