const express = require('express')
const fs = require('fs')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires range header");
    }
    const videoPath = "ep1.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 2 ** 20;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);

});

app.listen(8000, (port) => {
    console.log("Listening on port", port);
});