const Database = require("@replit/database");
const fs = require("fs-extra");
const db = new Database();
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 80;
let Videos = {};
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedFileTypes = [
        'video/mp4',
        'video/x-m4v',
        'video/avi',
        'video/quicktime',
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
            'Invalid file type. Only MP4, M4V, AVI, and MOV video files are allowed.'
            )
        );
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get("/watch", (req, res) => {
    res.send(`<link rel="stylesheet" href="/watch.css"><video src="/${req.query.watch}" style="width: 100%; height: 100%; margin: 0px;" controls />`);
} )
app.post("/delete", async (req, res) => {
    if(req.query.passwrd === atob("MTcxMDEy")) {
        const directoryPath = path.join(__dirname, 'uploads');
        fs.emptyDir(directoryPath);
        await db.set("Videos", { "files":[], "names":[] });
        Videos = { "files":[], "names":[] };
        res.status(200).send("Deleted Everything");
    } else {
        res.status(403).send("Your not the admin, im the admin");
    }
    console.log('----- Full Reset -----\n', "Data " ,Videos);
});

app.get("/videos", (req, res) => {
    if (req.query.data == "names") {
        res.send(Videos.names);
    } else if (req.query.data == "files") {
        res.send(Videos.files);
    } else {
        res.send(Videos);
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {

    if (!Videos.names.includes(req.query.name) && !Videos.files.includes(req.file.filename)) {
        Videos.names.push(req.query.name);
        Videos.files.push(req.file.filename);
        await db.set("Videos", Videos);
        console.log('----- New Upload -----\n', "Data " ,Videos);
        res.status(201).send("File uploaded successfully!");
    } else {
        res.status(418).send("video of the same filename or name exists");
    }
    
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, async () => {
    // Get data from the Database
    Videos = JSON.parse(await db.get("Videos", {"raw":true}));

    // Start the Server
    console.log(`Server started`);
    console.log('----- Server Start -----\n', "Data " ,Videos);
});
