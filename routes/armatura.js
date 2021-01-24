const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const Joi = require('joi');

const route = express.Router();


const schemaMreza = Joi.object().keys({

    naziv: Joi.string().max(50).required(),
    oznaka: Joi.string().max(4).required(),
    dimenzije: Joi.string().max(100).required(),
    dimenzijeKocke: Joi.string().max(100).required(),
    cena_Din: Joi.number().max(999999).required(),
    jedinicaMere: Joi.string().valid("kg", "kom"),


});

const schemaGvozdje = Joi.object().keys({
    naziv: Joi.string().max(50).required(),
    cena_Din: Joi.number().max(999999).required(),
    jedinicaMere: Joi.string().valid("kg", "kom")
});

const schemaUser = Joi.object().keys({
    username: Joi.string().max(50).required(),
    email: Joi.string().max(50).required(),
    password1: Joi.string().max(50).required(),
    password2: Joi.string().max(50).required(),
});




route.use(express.json());


let db = new sqlite3.Database('C:\\Users\\Marko\\PycharmProjects\\Zavrsni_Ispit2020\\db.sqlite3', (err) => { //jeli ovako?
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the armatura database.');
});




//ZAAAA USERA

route.get("/user/sve", (req, res, next) => { //zasto nijeeeee roze route
    let sql = "select * from  gvozdje_user"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

route.post("/user/add/", (req, res, next) => {
    let data = {
        username: req.body.username,
        email: req.body.email,
        password1: req.body.password1, //encript
        password2: req.body.password2 //encript
    }

    let { error } = schemaUser.validate(data)
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {

        let sql = 'INSERT INTO gvozdje_user (username, email, password1, password2) VALUES (?,?,?,?)'
        let params = [data.username, data.email, data.password1, data.password2]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.id
            })
        });

    }
})

route.delete("/user/delete/:id", (req, res, next) => {
    db.run(
        'DELETE FROM gvozdje_user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})

route.patch("/user/update/:id", (req, res, next) => {
    let data = {
        username: req.body.username,
        email: req.body.email,
        password1 : req.body.password1,
        password2 : req.body.password2
    }

    let { error } = schemaMreza.validate(data);
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {

        db.run(
            `UPDATE gvozdje_user set 
           username = COALESCE(?,username),
           email = COALESCE(?, email),
           password1 = COALESCE(?, password1),
           password2 = COALESCE(?, password2)
           WHERE id = ?`,
            [data.username, data.email, data.password1, data.password2, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    changes: this.changes
                })
            });
    }
})





//ZA MREZU

route.get("/mreza/sve", (req, res, next) => { //zasto nijeeeee roze route
    let sql = "select * from Mreza"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

route.post("/mreza/add/", (req, res, next) => {
    let data = {
        naziv: req.body.naziv,
        dimenzijeKocke: req.body.dimenzijeKocke,
        dimenzije : req.body.dimenzije,
        jedinicaMere : req.body.jedinicaMere,
        cena_Din : req.body.cena_Din,
        proizvedeno_Od : req.body.proizvedeno_Od //Pitanje zaaaaa Igijaaa
    }

    let { error } = schemaMreza.validate(data);
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {

        let sql = 'INSERT INTO Mreza (naziv, dimenzijeKocke, dimenzije, jedinicaMere, cena_Din, proizvedeno_Od) VALUES (?,?,?,?,?,?)'
        let params = [data.naziv, data.dimenzijeKocke, data.dimenzije, data.jedinicaMere, data.cena_Din, data.proizvedeno_Od]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.id
            })
        });
    }
})

route.delete("/mreza/delete/:id", (req, res, next) => {
    db.run(
        'DELETE FROM Mreza WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})

route.patch("/mreza/update/:id", (req, res, next) => {
    let data = {
        naziv: req.body.naziv,
        dimenzijeKocke: req.body.dimenzijeKocke,
        dimenzije : req.body.dimenzije,
        jedinicaMere : req.body.jedinicaMere,
        cena_Din : req.body.cena_Din,
        proizvedeno_Od : req.body.proizvedeno_Od //pitanje za Igijaa
    }
    let { error } = schemaMreza.validate(data);
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {

        db.run(
            `UPDATE Mreza set 
           naziv = COALESCE(?,naziv),
           dimenzijeKocke = COALESCE(?,dimenzijeKocke), 
           dimenzije = COALESCE(?,dimenzije), 
           jedinicaMere = COALESCE(?,jedinicaMere), 
           cena_Din = COALESCE(?,cena_Din),
           proizvedeno_Od = COALESCE(?, proizvedeno_Od)
           WHERE id = ?`,
            [data.naziv, data.dimenzijeKocke, data.dimenzije, data.jedinicaMere, data.cena_Din, data.proizvedeno_Od, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    changes: this.changes
                })
            });
    }
})




//ZA GVOZDJE

route.get("/gvozdje/sve", (req, res, next) => { //zasto nijeeeee roze route
    let sql = "select * from Gvozdje"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

route.post("/gvozdje/add/", (req, res, next) => {
    let data = {
        naziv: req.body.naziv,
        jedinicaMere : req.body.jedinicaMere,
        cena_Din : req.body.cena_Din
    }
    let { error } = schemaGvozdje.validate(data);
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {
        let sql = 'INSERT INTO Gvozdje (naziv, jedinicaMere, cena_Din) VALUES (?,?,?)'
        let params = [data.naziv, data.jedinicaMere, data.cena_Din]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.id
            })
        });
    }
})

route.delete("/gvozdje/delete/:id", (req, res, next) => {
    db.run(
        'DELETE FROM Gvozdje WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})

route.patch("/gvozdje/update/:id", (req, res, next) => {
    let data = {
        naziv: req.body.naziv,
        jedinicaMere : req.body.jedinicaMere,
        cena_Din : req.body.cena_Din
    }
    let { error } = schemaGvozdje.validate(data);
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {

        db.run(
            `UPDATE Gvozdje set 
           naziv = COALESCE(?,naziv), 
           jedinicaMere = COALESCE(?,jedinicaMere), 
           cena_Din = COALESCE(?,cena_Din) 
           WHERE id = ?`,
            [data.naziv, data.jedinicaMere, data.cena_Din, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    changes: this.changes
                })
            });
    }
})


module.exports = route;