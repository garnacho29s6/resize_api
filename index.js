const express = require('express');
const sharp = require('sharp');
const axios = require('axios');
const { Semaphore } = require('async-mutex');

const app = express();
const semaphore = new Semaphore(3); // Giới hạn 3 request đồng thời

// API: /resize?url=LINK_ANH&width=300
app.get('/resize', async (req, res) => {
    const release = await semaphore.acquire(); // Đợi tới khi có slot trống
    try {
        const imageUrl = req.query.url;
        const width = parseInt(req.query.width);

        if (!imageUrl) {
            return res.status(400).send({ error: 'Thiếu tham số url' });
        }
        if (!width || isNaN(width)) {
            return res.status(400).send({ error: 'Thiếu hoặc width không hợp lệ' });
        }

        // Tải ảnh từ URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Resize ảnh
        const resizedImage = await sharp(imageBuffer)
            .resize({ width })
            .toBuffer();

        res.set('Content-Type', 'image/jpeg');
        res.send(resizedImage);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Không thể resize ảnh' });
    } finally {
        release(); // Trả slot cho request khác
    }
});

app.get("/", (req, res) => {
    res.send({"a": "b"})
})

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
