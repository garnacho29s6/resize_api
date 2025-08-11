const express = require('express');
const sharp = require('sharp');
const axios = require('axios');

const app = express();

// API: /resize?url=LINK_ANH&width=300
app.get('/resize', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        const width = parseInt(req.query.width);

        if (!imageUrl) {
            return res.status(400).send({ error: 'Thiếu tham số url' });
        }
        if (!width || isNaN(width)) {
            return res.status(400).send({ error: 'Thiếu hoặc width không hợp lệ' });
        }

        // Tải ảnh từ URL về dạng buffer
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Resize chỉ width, height giữ nguyên tỉ lệ
        const resizedImage = await sharp(imageBuffer)
            .resize({ width })
            .toBuffer();

        res.set('Content-Type', 'image/jpeg');
        res.send(resizedImage);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Không thể resize ảnh' });
    }
});

app.get("/", (req, res) => {
    res.send({"a": "b"})
})

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
