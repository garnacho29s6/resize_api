const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Lưu file vào RAM

// API resize ảnh
app.post('/resize', upload.single('image'), async (req, res) => {
    try {
        const width = parseInt(req.query.width); // lấy width từ query
        if (!width || isNaN(width)) {
            return res.status(400).send({ error: 'Vui lòng truyền width hợp lệ ?width=300' });
        }

        if (!req.file) {
            return res.status(400).send({ error: 'Vui lòng upload ảnh với field name = image' });
        }

        // Resize chỉ width, height sẽ tự động giữ tỉ lệ
        const resizedImage = await sharp(req.file.buffer)
            .resize({ width: width }) // Không set height => Sharp tự giữ tỉ lệ
            .toBuffer();

        res.set('Content-Type', 'image/jpeg');
        res.send(resizedImage);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Có lỗi xảy ra khi resize ảnh' });
    }
});

app.get("/", (req, res) => {
    res.send({"a": "b"})
})

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
