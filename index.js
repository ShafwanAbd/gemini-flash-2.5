import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY  });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ready on https://localhost:${PORT}`);
})

function extractText(resp){
    try {
        const text =
            resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
            resp?.candidates?.[0]?.content?.parts?.[0]?.text ??
            resp?.response?.candidates?.[0]?.content?.text

        return text ?? JSON.stringify(resp, null, 2); 
    } catch (err) {
        console.error("Error extracting text:", err);
        return JSON.stringify(resp, null, 2);
    }
}

// GENERATE TEXT
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

// GENERATE IMAGE(s)

// Changed the function to be able to upload more than one images (limited to 5)
// Because in my personal case, in image contexts, it usually needs more than one image per upload/prompt
// I'm using Gemini Code Assist for this code XD

// NOTE that it uses 'images' instead of 'image' for the key (from original)

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

// GENERATE DOCUMENT

// Whoah it works the same as the image 

app.post('/generate-from-document', upload.array('documents', 5), async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No documents uploaded.' });
        }

        const documentParts = req.files.map(file => ({
            inlineData: {
                mimeType: file.mimetype,
                data: file.buffer.toString('base64')
            }
        }));

        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ text: prompt || "Ringkas dokumen berikut:" }, ...documentParts]
        });
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})


// GENERATE AUDIO

// Of course with audio too it's the same xd

app.post('/generate-from-audio', upload.array('audios', 5), async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No audios uploaded.' });
        }

        const audioParts = req.files.map(file => ({
            inlineData: {
                mimeType: file.mimetype,
                data: file.buffer.toString('base64')
            }
        }));

        const resp = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ text: prompt || "Transkrip audio berikut:" }, ...audioParts]
        });
        res.json({ result: extractText(resp) });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

// ORIGINAL

// it can only upload up to one image/documents

// app.post('/generate-from-image', upload.single('image'), async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         const imageBase64 = req.file.buffer.toString('base64');
//         const resp = await ai.models.generateContent({
//             model: GEMINI_MODEL,
//             contents: [
//                 { text: prompt },
//                 { inlineData: { mimeType: req.file.mimetype, data: imageBase64 }}
//             ]
//         });
//         res.json({ result: extractText(resp) });
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// })
// 
// app.post('/generate-from-document', upload.single('document'), async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         const docBase64 = req.file.buffer.toString('base64');
//         const resp = await ai.models.generateContent({
//             model: GEMINI_MODEL,
//             contents: [
//                 { text: prompt || "Ringkas dokumen berikut:" },
//                 { inlineData: { mimeType: req.file.mimetype, data: docBase64 }}
//             ]
//         });
//         res.json({ result: extractText(resp) });
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// })
// 
// app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         const audioBase64 = req.file.buffer.toString('base64');
//         const resp = await ai.models.generateContent({
//             model: GEMINI_MODEL,
//             contents: [
//                 { text: prompt || "Transkrip audio berikut:" },
//                 { inlineData: { mimeType: req.file.mimetype, data: audioBase64 }}
//             ]
//         });
//         res.json({ result: extractText(resp) });
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// })
