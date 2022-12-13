const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

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
    let htmlResp = '<ul>';
    files.forEach((file)=>{
        htmlResp += `<li> <a href='getFile?file=${file}' > ${file} </a></li>\n`;
    });
    htmlResp += '</ul>';
    return htmlResp;
}

const getDeleteFilesHtmlLinks = (files) =>{
    let htmlResp = '<ul>';
    files.forEach((file)=>{
        htmlResp += `<li> ${file} <a href='delete?file=${file}' > [ X ] </a></li>\n`;
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

// sendFile will go here
app.get('/upload', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/index.html'));
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
