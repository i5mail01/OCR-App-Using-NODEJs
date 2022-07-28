const express=require('express');
const multer=require('multer');
const fs=require('fs');
var Tesseract=require('tesseract.js');
const app=express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

app.use(express.json());

const PORT=process.env.PORT || 5000;

var storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,__dirname+'/images');
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('image');

app.get('/ocr/home',(req,res,)=>{
    res.render('home');
});

app.post('/ocr/upload',(req,res)=>{
    console.log(req.file);
    upload(req,res,err=>{
        if(err){
            console.log(err);
            return res.send('Something went wrong');
        }

        var image=fs.readFileSync(
            __dirname+'/images/'+req.file.originalname,
            {
                encoding:null
            }
        );
        //console.log(req.file.originalname);
        Tesseract.recognize(image)
        .progress(function(p) {
          console.log('progress', p);
        })
        .then(function(result) {
          //res.send(result.html);
          res.render('upload',{
              filname:req.file.originalname,
              data:result.html 
          })
        }); 
    });
});


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
