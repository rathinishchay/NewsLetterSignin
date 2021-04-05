const express = require('express');

const request = require('request');

const https = require('https');

const path = require('path');

const bodyParser = require('body-parser');

app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.post('/',function(req,res){
    const {firstname,lastname,email} = req.body;

    const mailData = {
        members: [
            {
                email_address:email,
                status :"subscribed",
                merge_fields:{
                    FNAME : firstname,
                    LNAME : lastname
                }
            }
        ]
    }

    const jsonMailData = JSON.stringify(mailData);

    const url = "https://us1.api.mailchimp.com/3.0/lists/7b9b61e9ce";
    const options = {
        method : 'POST',
        auth : 'nishchay17496@gmail.com:13a61b2e927a4c8d3719ba273946b844-us1'
    }

    const request = https.request(url,options,(response)=>{
        if(response.statusCode === 200&&(firstname&&lastname&&email)){
            res.sendFile(__dirname+'/success.html');
        }
        else{
            res.sendFile(__dirname+'/fail.html');
        }
        response.on('data',function(data){
            console.log(JSON.parse(data));
        });
    });
    
    request.write(jsonMailData);
    request.end();

});

app.post('/failure',function(req,res){
    res.redirect('/');
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});

//api key : e610f5e4d0eaa9a5796a787aeea96846-us1

//audience id : 7b9b61e9ce


