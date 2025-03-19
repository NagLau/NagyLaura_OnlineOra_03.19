const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
 
const db = mysql.createConnection({
    user:"root",
    host:"127.0.0.1",
    port: 3307,
    password:"",
    database:""
})
 
app.get("/",(req,res)=>
{
    res.send("Fut a Backend")
})
 
app.get ("/",( req, res) => {
    const sql ="SELECT * FROM ``";
    db.query(sql, (err,result) => {
        if (err) return res.json(err);
        return res.json(result)
    })
})
 
app.listen(3022, ()=>
{
    console.log("A szerverem a 3022 porton fut")
})