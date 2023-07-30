const Database = require("@replit/database");
const fs = require("fs-extra");
const db = new Database();
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 80;
let Videos = {};
const XSSres = "Hey that request looks kinda sus! it seems like youre trying to do a XSS (Cross-Site-Scripting) attack. ";
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

// Check if data is an attemped XSS Attack
function isXSS(data){
    const XSS_Symbols = /[<>/'"]/gi;
    try {
        return XSS_Symbols.test(data);
    } catch {
        return false;
    }
}

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

app.post("/delete", async (req, res) => {
    if(req.query.passwrd === process.env['ADMIN_KEY']) {
        const directoryPath = path.join(__dirname, 'uploads');
        fs.emptyDir(directoryPath);
        await db.set("Videos", { "files":[], "names":[] });
        Videos = { "files":[], "names":[] };
        res.status(200).send("Deleted Everything");
    } else {
        res.status(403).send("Your not the admin, im the admin");
    }
    console.log('----- Full Reset -----\n');
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
    if ( !isXSS(req.file.filename) ) {
        if ( !Videos.names.includes(req.query.name) && !Videos.files.includes(req.file.filename) ) {
            Videos.names.push(req.query.name);
            Videos.files.push(req.file.filename);
            await db.set("Videos", Videos);
            console.log('----- New Upload -----\n Name: "', req.query.name, "\" File: \"", req.file.filename, '"');
            res.status(201).send("File uploaded successfully!");
        } else {
            res.status(400).send("video of the same filename or name exists");
        }
    } else {
        res.status(418).send(XSSres);
    }
});

app.get('/', async (req, res) => {
    if(!req.query.watch){
        res.sendFile(path.join(__dirname, 'public', 'main.html'));
    } else {
        if (!isXSS(req.query.watch)) {
            res.send(`<link rel="icon" type="image/x-icon" href="/favicon.png"><title>${Videos.names[Videos.files.indexOf(req.query.watch)]}</title><link rel="stylesheet" href="/watch.css"><video src="/${req.query.watch}" style="width: 100%; height: 100%; margin: 0px;" controls />`);
        } else {
            res.status(418).sendFile(path.join(__dirname, 'public', 'XSS_Inject_Response.html'));
        }
    }
});

app.listen(port, async () => {
    // Get data from the Database
    Videos = JSON.parse(await db.get("Videos", {"raw":true}));

    // Start the Server
    console.log(`Server started`);
    console.log('----- Server Start -----\n', "Data " ,Videos);
});
