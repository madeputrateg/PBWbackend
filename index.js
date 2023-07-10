const express = require('express');
var bodyparser =require("body-parser");
var mysql=require("mysql");
const jwt=require("jsonwebtoken");
const secret ="bapakdepon";
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
    if (err) throw err
  })
function authdecodetoken(token){
  const decode = jwt.decode(token)
  const user = jwt.verify(token,secret,decode);
  return user;
}
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.post(
    '/login',(req,res)=>{
        const {username,password} =req.body;
        con.query("SELECT * FROM user WHERE (username=\""+username+"\" AND password=\""+password+"\")", function (err, result, fields) {
            if (err) throw err;
          if (result.length==0){
            res.status(201).send({"message":"error"});
          }else{
            data=result[0];
            const token=jwt.sign({"id":data["id"],"username":data["username"],"email":data["email"],is_admin:"1"},secret,{expiresIn:"1h"});
            res.status(200).send({"message":"succes",token:token});
          }
        });
    }
)
app.post(
    '/register',(req,res)=>{
        const {username,email,password} =req.body;
        con.query("INSERT INTO user(username,password,email) VALUES(\""+username+"\",\""+password+"\",\""+email+"\")", function (err, result, fields) {
          if (err) throw err;
            res.status(200).send({"message":"succes"});
        });
    }
)
app.get(
  '/getlistproject',(req,res)=>{
      const {token} =req.body;
      let user;
      try{
        user= authdecodetoken(token);
      }catch(err){
        res.status(200).send({"message":"error : "+err})
      }
      let page =req.query.page;
      let result =req.query.result;
      if (page==null){
        page=0;
      }
      if(result==null){
        result=5;
      }
      page=parseInt(page)*parseInt(result);
      if (user!=null){
        if (user["is_admin"]=="1"){
            con.query("SELECT * FROM project LIMIT "+page+","+result,function(err,result,fields){
              if(err)throw err;
              res.status(200).send({"data":result})
          })
        }
      }

  }
)
app.post(
  '/addproject',(req,res)=>{
    const {token,user_id,status,price,name} =req.body;
    try{
      user= authdecodetoken(token);
    }catch(err){
      res.status(200).send({"message":"error : "+err})
    }
    if (user!=null){
        con.query(`INSERT INTO project(user_id,status,price,name) VALUES(${user_id},'${status}',${price},'${name}')`,function(err,result,fields){
          if(err)throw err;
            res.status(200).send({"message":"success"})
        }
      )
    }
  }
)
app.post(
  '/updateproject',(req,res)=>{
    const {token,id,user_id,status,price,name} =req.body;
    try{
      user= authdecodetoken(token);
    }catch(err){
      res.status(200).send({"message":"error : "+err})
    }
    if (user!=null){
        con.query(`UPDATE SET user_id=${user_id},status=${status},price=${price},name=${name} WHERE id=${id}`,function(err,result,fields){
          if(err)throw err;
            res.status(200).send({"message":"success"})
        }
      )
    }
  }
)
app.post(
  '/addteam',(req,res)=>{
    const {token,employee_id,project_id,role} =req.body;
    try{
      user= authdecodetoken(token);
    }catch(err){
      res.status(200).send({"message":"error : "+err})
    }
    if (user!=null){
      con.query(`INSERT INTO team(employee_id,project_id,role) VALUES(${employee_id},${project_id},'${role}')`,function(err,result,fields){
        if(err)throw err;
          res.status(200).send({"message":"success"})
      }
    )
  }
  }
)
app.post(
  '/deleteteam',(req,res)=>{
    const {token,id} =req.body;
    try{
      user= authdecodetoken(token);
    }catch(err){
      res.status(200).send({"message":"error : "+err})
    }
    if (user!=null){
      con.query(`DELETE FROM team WHERE id=${id})`,function(err,result,fields){
        if(err)throw err;
          res.status(200).send({"message":"success"})
      }
    )
  }
  }
)
app.listen(
    PORT,
    ()=>console.log("berhasil")
);
