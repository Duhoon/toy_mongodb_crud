const express = require("express");
const app = express();
const logs = require("morgan");
const cors = require("cors");
const {get, send, update, remove} = require("./src/controller");

const PORT = process.env.PORT || 4000;

logs.token("data", (req, res)=>{
    return JSON.stringify(req.body);
})

app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:false}));
app.use(logs(":method :url :data :response-time ms"));

app.get("/", get)

app.post("/send", send)

app.post("/update", update)

app.post("/remove", remove)

app.listen(PORT, ()=>{console.log(`Sever is Running ${PORT}`)})

