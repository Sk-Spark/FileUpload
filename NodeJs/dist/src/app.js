const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { networkInterfaces } = require('os');
const QRCode = require('qrcode');

const getQRCode = (url,i) =>{    
    const QRCodeFile = path.join(__dirname,"img",`${i}.jpg`);
    console.log("QR URL:",url);
    if(String(url).indexOf('192.168') >=0){
        QRCode.toString(url,{type:'terminal'}, function (err, url) {
            console.log(url)
        });
    }

    QRCode.toFile(QRCodeFile,url,(err)=>{
        console.error(err);
    });
    // console.log("QR URL:",url);
}

const nets = networkInterfaces();
const results = []; // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            results.push(net.address);
        }
    }
    console.log("IPs:",results);
}

// Generating QR Code
let i=0;
results.forEach((r)=>{
    const url = `http://${r}:8383`;
    getQRCode(url,i++);
});

const getUploadedFiles = async () =>{
    //joining path of directory 
    let uploadDir = './uploads';
    let upFiles = [];

    try{
        upFiles = fs.readdirSync(uploadDir);
    }
    catch(err){
        console.log(err);
    }
    console.log("upFiles:",upFiles);
    return upFiles;    
}

const getDownloadFilesHtmlLinks = (files) =>{
    let htmlResp = '<meta name="viewport" content="width=device-width, initial-scale=1"> <ul>';
    files.forEach((file)=>{
        htmlResp += `<li> <a href='getFile?file=${file}' > ${file} </a></li></br>\n`;
    });
    htmlResp += '</ul>';
    return htmlResp;
}

const getDeleteFilesHtmlLinks = (files) =>{
    let htmlResp = '<meta name="viewport" content="width=device-width, initial-scale=1"> <ul>';
    files.forEach((file)=>{
        htmlResp += `<li> ${file} <a href='delete?file=${file}' > [ X ] </a></li></br>\n`;
    });
    htmlResp += '</ul>';
    return htmlResp; 
}

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 8383;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

// Landing Page
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '/html/index.html'));
});

// serving CSS
app.get('/main.css', (req, res) =>{
    res.sendFile(path.join(__dirname, '/css/main.css'));
});

// serving JS
app.get('/main.js', (req, res) =>{
    res.sendFile(path.join(__dirname, '/js/main.js'));
});

// get all ip address
app.get('/ip', (req, res) =>{
    res.send(results);
});

// get QR code
app.get('/qrcode', (req, res) =>{
    let index = req.query.i;
    console.log('/qrcode',index);
    res.sendFile(path.join(__dirname, `/img/${index}.jpg`));
});

// sendFile will go here
app.get('/upload', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/upload.html'));
});

app.post('/upload', async (req, res) => {
    console.log("req",req);
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
            console.log("req in else:");

            if( Array.isArray(req.files.myfile) ){
                //loop all files
                _.forEach(req.files.myfile, (file) => {   
                    //move photo to uploads directory
                    file.mv('./uploads/' + file.name);
    
                    //push file details
                    data.push({
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size
                    });
                });
            }
            else{
                let file = req.files.myfile;
                //move photo to uploads directory
                file.mv('./uploads/' + file.name);

                //push file details
                data.push({
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                });
            }

    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get('/download', async (req, res) =>{
    const uploadedFiles = await getUploadedFiles();
    const htmlResp = getDownloadFilesHtmlLinks(uploadedFiles);
    console.log("Files: ",uploadedFiles);
    res.send("Files: " + htmlResp);
});

app.get('/getFile', (req, res)=>{
    console.log(req.query);
    let fileName = req.query.file;
    console.log("fileName:",fileName)
    res.download(`./uploads/${fileName}`);
});

app.get('/delete', async (req, res) =>{
    if(req.query.file){
        let fileName = req.query.file;
        console.log("Delete file: ",fileName);
        try{
            fs.unlinkSync('./uploads/'+fileName);           
        }
        catch(err){
            console.log("Error:",err);
        }
    }
    const uploadedFiles = await getUploadedFiles();
    const htmlResp = getDeleteFilesHtmlLinks(uploadedFiles);
    console.log("Files: ",uploadedFiles);
    res.send("Files: " + htmlResp);
});
