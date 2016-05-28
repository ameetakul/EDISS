var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());



// First you need to create a connection to the db
var con ;
var activeUsers = ["test"];
function connect()
{ 

	con = mysql.createConnection({
  host: "ameetak-mysql.cbpjmem9ssbw.us-east-1.rds.amazonaws.com",
  user: "ameetak",
  password: "20Kameet",
  database : "ameetak",
});
	con.connect(function(err){
  if(err){
    console.log('Error connecting to Db'+err);
    return;
  }
  console.log('Connection established');
});
}

app.post('/login', function (req, res) {
	// To Write a Cookie
	connect();
con.query('SELECT * FROM userDetails where username = "'+req.body.username+'"',function(err,rows){
  if(err) throw err;
  console.log('Data received from Db:\n'+rows[0].username);
  for (var i = 0; i < rows.length; i++) {
  if(rows[i].username == req.body.username)
  {
  	if(rows[i].passwordString == req.body.password)
  	{
			activeUsers.push(req.body.username);
	res.cookie('cookieString', req.body.username
		, { maxAge: 100000,httpOnly: true });
   res.send("done");

   return;
  	}
  	else
  	{
	res.send("not done");
	return;	  		
  	}
  }
};

});	
}
)

function isUserActive(user)
{
	console.log(activeUsers.indexOf(user));
	if(activeUsers.indexOf(user) != -1)
	{

		return true;
	}
	else
		return false;
}

app.post('/logout', function (req, res) {
	// To Write a Cookie
	var responseString = deactivate(getUserNameFromCookie(req));
   res.send(responseString);
})

app.post('/add', function (req, res) {
	if(!checkIdLoggedIn(req))
	 {
	  		res.json({ message: "User is not loggerin"})
	}
   var num1 = parseInt(req.body.num1);
   var num2 = parseInt(req.body.num2);
   var response = addTwo(num1,num2);
       res.json({ message: response });   
})
app.post('/subtract', function (req, res) {
if(!checkIdLoggedIn(req))
	 {
	  		res.json({ message: "User is not loggerin"})
	}
   var num1 = parseInt(req.body.num1);
   var num2 = parseInt(req.body.num2);
   var response = subtractFrom(num1,num2);
       res.json({ message: response });   
})
app.post('/multiply', function (req, res) {
   if(!checkIdLoggedIn(req))
	 {
	  		res.json({ message: "User is not loggerin"})
	}
   var num1 = parseInt(req.body.num1);
   var num2 = parseInt(req.body.num2);
  var response = multiplyTo(num1,num2);
       res.json({ message: response });   
})
app.post('/divide', function (req, res) {
   if(!checkIdLoggedIn(req))
	 {
	  		res.json({ message: "User is not loggerin"})
	}
   var num1 = parseInt(req.body.num1);
   var num2 = parseInt(req.body.num2);
   	var response = divideFrom(num1,num2); 
       res.json({ message: response });   
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Arithematic operations are ready to be executed!!");

})
function inArray(user) {
    var length = activeUsers.length;
    for(var i = 0; i < length; i++) {
        if(activeUsers[i] === user)
            return true;
    }
    return false;
}
function checkIdLoggedIn(req)
{
	if(!req.headers.cookie)
	{
		console.log("No cookie!!");
		return false;
	}
	else {
		var user = getUserNameFromCookie(req);
if(user && inArray(user))
	{return true;}
	}
	return false;
}
function getUserNameFromCookie (request) {
    var list = {},
        rc = request.headers.cookie;
        var cookieValue ;
        if(rc)
        {
    for(var i=0; i<rc.split(';').length; i++){
    	var cookie = rc.split(';')[i];
		var parts = cookie.split('=');
        if(parts[0].toString() == "cookieString")
        {

        	return parts[1];
        }
    }
}
    
}
function activate(user)
{
	activeUsers.push(user);
}
function deactivate(user)
{
	var index = activeUsers.indexOf(user);

	if (index > -1) {
    activeUsers.splice(index, 1);
	}
}
function addTwo(num1, num2)
{
	return num1+num2;
}

function subtractFrom(num1, num2)
{
	return num1-num2;
}

function multiplyTo(num1, num2)
{
	return num1*num2;
}

function divideFrom(num1, num2)
{
	return num1/num2;
}
