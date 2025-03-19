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
    port: 3306,
    password:"",
    database:"atletikavb2017"
})
 
//Teszt
app.get("/",(req,res)=>
{
    res.send("Fut a Backend")
})
 
// Kapcsolódás az adatbázishoz
db.connect((err) => {
    if (err) {
        console.error("Adatbázis kapcsolat sikertelen:", err);
        return;
    }
    console.log("Csatlakozva az adatbázishoz");
});

//Futtatás
app.get ("/",( req, res) => {
    const sql ="SELECT * FROM ``";
    db.query(sql, (err,result) => {
        if (err) return res.json(err);
        return res.json(result)
    })
})
 
// 1. Feladat.
//  Versenyszámok kiválasztása, ahol az időtartam meghaladja a 60 percet
// CRUD: GET
app.get("versenynev60", (req, res) => {
    const sql = `
        SELECT DISTINCT Versenyszam
        FROM versenyekszamok
        WHERE 
            (Versenyszam LIKE '%gyaloglás%' AND Eredmeny > '1:00:00') OR
            (Versenyszam = 'maraton' AND Eredmeny > '1:00:00') OR
            (Versenyszam = 'tízpróba' AND Eredmeny > '60') OR
            (Versenyszam = 'hétpróba' AND Eredmeny > '60')
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Adatbázis lekérdezés sikertelen" });
        }
        return res.json(result);
    });
});

// 2. Feladat.
//  Új nemzet hozzáadása
// CRUD: POST 
app.post("/uj", (req, res) => {
    const { Nemzet } = req.body; 
    if (!Nemzet) {
        return res.status(400).json({ error: "A nemzet neve kötelező" });
    }
    const sql = "INSERT INTO nemzetek (Nemzet) VALUES (?)";
    db.query(sql, [Nemzet], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Nem sikerült a nemzet hozzáadása" });
        }
        return res.status(201).json({ NemzetId: result.insertId, Nemzet });
    });
});

// 3. Feladat.
//  Olyan nemzet törlése, ami nem vesz részt
// CRUD: DELETE 
app.delete("/nemvresztvevo", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM nemzetek WHERE NemzetId = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Nem sikerült a nemzet törlése" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "A nemzet nem található" });
        }
        return res.status(200).json({ message: "A nemzet sikeresen törölve" });
    });
});

// 4. Feladat.
//  Egy kiválasztott nemzet eredményének módosítása
// CRUD: UPDATE 
app.put("eredmenyek", (req, res) => {
    const { nemzetKod, versenyszam } = req.params;
    const { Eredmeny } = req.body; 
    if (!Eredmeny) {
        return res.status(400).json({ error: "Az eredmény megadása kötelező" });
    }
    const sql = "UPDATE versenyekszamok SET Eredmeny = ? WHERE NemzetKod = ? AND Versenyszam = ?";
    db.query(sql, [Eredmeny, nemzetKod, versenyszam], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Nem sikerült az eredmény frissítése" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "A rekord nem található" });
        }
        return res.status(200).json({ message: "Az eredmény frissítve" });
    });
});

app.listen(3022, ()=>
{
    console.log("A szerverem a 3022 porton fut")
});