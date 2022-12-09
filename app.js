const express = require("express");
const app = express();
const logs = require("morgan");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/images/");
    },
    filename: function(req, file, cb){        
        cb(null, `${crypto.randomBytes(16).toString("base64url")}.${file.mimetype.split("/")[1]}`);
    }
})

const upload = multer({storage});

const {get, getDetail, send, reply, update, remove, test, uploadImage} = require("./src/controller");


const PORT = process.env.PORT || 4000;

logs.token("data", (req, res)=>{
    return JSON.stringify(req.body);
})


app.use(cors());

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}));
app.use(logs(":method :url :data :response-time ms"));

app.use(express.static(__dirname + "/public"));

app.get("/", get);

app.get("/detail/:_id", getDetail);

app.post("/uploadImage", upload.single("image") ,uploadImage);
app.post("/send", send);

app.post("/reply", reply);

app.post("/update", update);

app.post("/remove", remove);

// only Test
app.post("/test", test);

app.listen(PORT, ()=>{console.log(`Sever is Running ${PORT}`)})

