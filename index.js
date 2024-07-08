const express = require('express');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/convert', (req, res) => {
    const videoUrl = req.body.url;
    const videoOutput = path.resolve(__dirname, 'video.mp4');
    const audioOutput = path.resolve(__dirname, 'output.mp3');

    const command = `youtube-dl -f bestaudio --extract-audio --audio-format mp3 -o "${audioOutput}" ${videoUrl}`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error downloading video: ${err}`);
            return res.status(500).send('Error downloading video');
        }
        console.log(`Downloaded video: ${stdout}`);

        ffmpeg(audioOutput)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', () => {
                res.download(audioOutput, 'output.mp3', (err) => {
                    if (err) {
                        console.error(`Error sending file: ${err}`);
                    }
                    fs.unlinkSync(videoOutput);  // Clean up video file
                    fs.unlinkSync(audioOutput);  // Clean up mp3 file
                });
            })
            .on('error', (err) => {
                console.error(`Error converting video to mp3: ${err}`);
                res.status(500).send('Error converting video to mp3');
            })
            .save(audioOutput);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
