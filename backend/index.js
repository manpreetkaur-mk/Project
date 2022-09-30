const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const port = 3003;

app.use(cors());
app.use(express.json());
var upload = require('./multer');

app.use(express.static('public'));


const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "123456789",
  database: "dxproject",
});
const http = 'http';
const base = http + '://localhost:' + port;


app.get('/images', express.static('images'));



// CATEGORY INSERT

app.post("/insertCategory", upload.single('image'), (req, res) => {
  
  const categoryName = req.body.categoryName;  
  const image = req.file.originalname;

  console.log(categoryName +" ,"+ image);
  try{
    db.query(
      "INSERT INTO category(categoryName, image) VALUES (?,?)",
      [categoryName, image],
      function(error, result)  {
        if(error)
   {console.log(error)
   res.status(500).json({result:false})
   }
   else
   {
    res.status(200).json({result:true})
   }
   })
  }catch(e){
    res.status(500).json({result:false});

  }
});


app.post("/insertUser", upload.single('image'),  (req, res) => {
  
  const firstname = req.body.firstname;  
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;

  try{
    db.query(
      "INSERT INTO signin (firstname, lastname, username, password) VALUES (?,?,?,?)",
      [firstname, lastname, username, password],
      function(error, result)  {
        if(error)
   {console.log(error)
   res.status(500).json({result:false})
   }
   else
   {
    res.status(200).json({result:true})
   }
   })
  }catch(e){
    res.status(500).json({result:false});

  }
});

app.post("/insertorderdetails", upload.single('image'),  (req, res) => {
  
  const firstname = req.body.firstname;  
  const lastname = req.body.lastname;
  const country = req.body.country;
  const city = req.body.city;
  const pincode = req.body.pincode;
  const address = req.body.address;
  const cartitems = req.body.cartitems;


  try{
    db.query(
      "INSERT INTO user (firstname, lastname, country, city, pincode, address, cartitems) VALUES (?,?,?,?,?,?,?)",
      [firstname, lastname, country, city, pincode, address, cartitems],
      function(error, result)  {
        if(error)
   {console.log(error)
   res.status(500).json({result:false})
   }
   else
   {
    res.status(200).json({result:true})
   }
   })
  }catch(e){
    res.status(500).json({result:false});

  }
});




// CATEGORY GET

app.get('/getCategory',function(req,res){
  try{
    db.query("SELECT * FROM category",function(error,result){
      // console.log(req.body)
      if(error)
      { res.status(500).json({data:[]})}
      else
      { 
        for(var i in result)
        {
          result[i].image = base + "/images/" + result[i].image;
        }
        console.log("result", result);
        res.status(200).json({data:result})
       }
  
     })
  
  
    }
    catch(e)
    {
      console.log("Error:",e)
      res.status(500).json({result:[]})
  }
 
  })

  app.post('/checkusername',function(req,res){
    db.query("select * from signin where username=?",[req.body.username],function(error,result){
      if(error){
        res.status(500).json({result:false})
      }else{
        if(result.length>0){
          res.status(200).json({result:true,data:result[0]})
        }else{
          res.status(500).json({result:false,data:[]})
        }
      }
    })
  })

  app.post('/checkusernameandpassword',function(req,res){
    db.query("select * from signin where username=? and password=?",[req.body.username,req.body.password],function(error,result){
      if(error){
        res.status(500).json({result:false})
      }else{
        if(result.length>0){
          res.status(200).json({result:true,data:result[0]})
        }else{
          res.status(500).json({result:false,data:[]})
        }
      }
    })
  })

  app.get('/getProduct',function(req,res){
    try{
      db.query("SELECT * FROM product",function(error,result){
        // console.log(req.body)
        if(error)
        { res.status(500).json({data:[]})}
        else
        { 
          for(var i in result)
          {
            result[i].image = base + "/images/" + result[i].image;
          }
          console.log("result", result);
          res.status(200).json({data:result})
         }
    
       })
    
    
      }
      catch(e)
      {
        console.log("Error:",e)
        res.status(500).json({result:[]})
    }
   
    })

  //Update Category

  app.post('/updateCategory',function(req,res){
   try{   
    db.query("update category set categoryName=? where categoryId=?",[req.body.categoryName,req.body.categoryId],function(error,result){
    if(error)
    { res.status(500).json({result:false})}
    else
    { res.status(200).json({result:true})
     }
 
   })
 
 }
   catch(e)
   {
     console.log("Error:",e)
     res.status(500).json({result:false})
 }
   })


// CATEGORY EDIT PICTURE
   app.post('/categoryeditpicture',upload.single('image'),function(req,res){
    try{
      // console.log(req.body)
      // console.log(req.file)
      db.query("update category set image=? where categoryId=?",[req.file.originalname,req.body.categoryId],function(error,result){
      if(error)
      {console.log(error)
      res.status(500).json({result:false})
      }
      else
      {
       res.status(200).json({result:true})
      }
      })
    } 
   catch(e)
   {    console.log("Error:",e)
       res.status(500).json({result:false})
   }
   })


   app.post('/deletecategory',function(req,res){
    // console.log(req.body)
   try{   
    db.query("DELETE FROM category  where categoryId=?",[req.body.categoryId],function(error,result){
    if(error)
    { res.status(500).json({result:false})}
    else
    { res.status(200).json({result:true})
     }
 
   })
 
 }
   catch(e)
   {
     console.log("Error:",e)
     res.status(500).json({result:false})
 }
   })

   ////////////////////////////////////////////////
   app.get('/getProductbyId',function(req,res){
    try{
      db.query("select P.*, C.categoryName from product P, category C where C.categoryId=P.categoryId",function(error,result){
        if(error)
        { res.status(500).json({data:[]})}
        else
        {
          var tmp = {};
          for(var i in result)
          {
            result[i].image = base + "/images/" + result[i].image;
            result[i].qty = 1;
            if(!tmp[result[i].categoryName])
              tmp[result[i].categoryName] = [];
            tmp[result[i].categoryName].push({...result[i]});
          }

          result = JSON.stringify(tmp);
          res.status(200).json(tmp)
         }
    
       })
    
    
      }
      catch(e)
      {
        console.log("Error:",e)
        res.status(500).json({result:[]})
    }
   
    })



  // Product INSERT

app.post("/insertProduct", upload.single('image'), (req, res) => {
  
  const productName = req.body.productName; 
  const categoryId = req.body.categoryId;
  const productDescription = req.body.productDescription;
  const price = req.body.price;
  const image = req.file.originalname;

  console.log(productName +" ,"+categoryId+" ,"+productDescription+" ,"+price+" ,"+image);
  try{
    db.query(
      "INSERT INTO product(productName, categoryId, productDescription, price, image) VALUES (?,?,?,?,?)",
      [productName, categoryId, productDescription, price, image],
      function(error, result)  {
        if(error)
   {console.log(error)
   res.status(500).json({result:false})
   }
   else
   {
    res.status(200).json({result:true})
   }
   })
  }catch(e){
    res.status(500).json({result:false});

  }
});




app.listen(port, () => {
  console.log("Yey, your server is running on port " + port);
});