const express = require('express');
var bodyparser =require("body-parser");
var mysql=require("mysql");
var con = mysql.createConnection({
    port:"8081",
    host: "localhost",
    user: "root",
    password: "test",
    database:"user"
  });
const PORT =8083;
const app = express()
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
con.connect(function(err) {
    if (err) throw err;
})
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.post(
    '/Login',(req,res)=>{
        const {username,password} =req.body;
        con.query("SELECT * FROM user WHERE (username=\""+username+"\" AND password=\""+password+"\")", function (err, result, fields) {
            if (err) throw err;
          if (result.length==0){
            res.status(201).send({message:"error"})
          }else{
            res.status(200).send({message:"succes",token:"1"})
          }
        });

    }
)
app.post(
    '/Register',(req,res)=>{
        const {username,email,password} =req.body;
        con.query("INSERT INTO user(username,password,email) VALUES(\""+username+"\",\""+password+"\",\""+email+"\")", function (err, result, fields) {
          if (err) throw err;
            res.status(200).send({message:"succes",token:"1"})
        });
    }
)

app.listen(
    PORT,
    ()=>console.log("berhasil")
);
