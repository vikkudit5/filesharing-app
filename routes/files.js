const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4:uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination:(req,res,cb)=> cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }

})

let upload = multer({
    storage:storage,
    limit:{fileSize: 100000 * 100},

}).single('myfiles');


router.post('/',(req,res)=>{  
    
    
    //store files
    
    upload(req,res,async(err)=>{
        
        console.log(req);
        // validate request
        if(!req.file)
        {
            return res.json({ error: 'All Fields Are Required!'})
        }

        if(err)
        {
            return res.status(500).send({error:err.message})
        }
        //store into database

        const file = new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size

        });

        const response = await file.save();
        return res.json({ file : `${process.env.APP_BASE_URL}files/${response.uuid}`})

    })
})

router.post('/send',async(req,res)=>{
    
    const { uuid,emailTo,emailFrom} = req.body;
    // validate request

    if(!uuid || !emailTo || !emailFrom)
    {
        return res.status(422).send({error:"All Fields Are Required!"});
    }

    // get data from database

    const file = await File.findOne({uuid:uuid})

    if(file.sender)
    {
        return res.status(422).send({error:"Email Alredy Send!"});
    }

    file.sender = emailFrom;
    file.reciever = emailTo;
    const response = await file.save();

    //send email

    const sendMail = require('../services/emailService');

    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'In share File sharing',
        text:`${emailFrom} shared file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}files/${file.uuid}`,
            size:parseInt(file.size / 1000) +'KB',
            expires:'24 hours'
        })
    });

    return res.send({success:true})

})






module.exports = router;