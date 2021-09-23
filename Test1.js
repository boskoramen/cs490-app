const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors');
var mysql = require('mysql');
var crypto = require('crypto');
var connection = mysql.createConnection({
host     : '127.0.0.1',
user     : 'root',
password : 'vvrFWUsgnuG4',
database : 'social_site'
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
//const https = require('https');
//const http = require('http');
//const fs = require('fs');
//const concat = require('concat-stream');
//const qs = require('querystring');

/*
const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
	//json:true
};
*/

var app = express();

//app.use(bodyParser.text({ type: 'text/plain' }))

app.use(bodyParser.json({ type: 'application/json' }))

app.use(cors({
	allowedHeaders: 'Content-Type'
}));

app.use('/', function (req, res) {
	console.log(req.body);
	console.log("My name is what?");
	//data = JSON.parse(req.body);
	data = req.body;
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	
	
	/*
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + connection.threadId);
	});
	*/
	
	a_salt = makeid(20);
	a_pass = crypto.pbkdf2Sync(data.pass, a_salt, 9000, 50, 'sha1');
	console.log("password is: " + a_pass.toString('hex'));
	console.log("salt is: " + a_salt);
	connection.query("SELECT * FROM login WHERE username = '" + data.name + "'", function (error, results, fields) {
	if (error) throw error;
		//console.log('The solution is: ', results[0].passcode);
		if (results.length > 0)
		{
			if (crypto.pbkdf2Sync(data.pass, results[0].salt, 9000, 50, 'sha1').toString('hex') == results[0].passcode)
			{
				res.end(results[0].usertype);
			} else
			{
				res.end("bad attempt");
			}
		} else
		{
			res.end("bad attempt");
		}
	});

	//connection.end();
	
	/*
	<?php require_once 'db_connect.php'; 
	session_start();
	if($_POST) {

		$username = $_POST['username'];
		$password = $_POST['password'];
		$sql = "SELECT * FROM login WHERE username = '$username'";
		$result = $connect->query($sql);
		$login_data = $result->fetch_assoc();

		if($result->num_rows > 0) {
			//session_register("username");
			if(password_verify($password, $login_data['passcode'])) {
				$_SESSION['userlogin'] = $username;
				$_SESSION['usertype'] = $login_data['usertype'];
				require_once 'session.php';
			} else {
				$error = "Your Login Name or Password is invalid";
		  }
		}
	}
	?>
*/
	
	/*
	//TODO DB LOGIC
	if (data.name == "Isaiah")
	{
		console.log("My name is who?");
		if (data.pass == "password")
		{
			console.log("My name is Chika-Chika\nSLIM SHADY");
			res.end("admin");
		}
	}
	//FIX THIS, CANT HAVE 2 ENDS BUT IF ELSE BREAKS!!!!!!!!!!
	else
	{
		res.end("bad attempt");
	}
	*/
	console.log("name: " + data.name);
	console.log("pass: " + data.pass);
	/*
	console.log(http.response(options, (req) => {
                        req.on('data', (chunk) => {
                            console.log(chunk.toString());
                        })
                    }));
	*/
	//res.setHeader('Access-Control-Allow-Origin', '*');
	//res.end('you posted:\n' + data.name + " " + data.pass);
	//res.send('hello world')
})

app.listen(9000, function() {
	console.log("Slim Shady has been avtivated");
})

/*
https.createServer(options, function (req, res) {
	console.log("Recieved something");
    var data;
	req.on('data', (chunk) => console.log(chunk.toString()));
    console.log('Data: ', data);
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (data.name == "Isaiah")
	{
		console.log("Isaiah is here!");
		if (data.pass == "password")
		{
			console.log("With the right password!");
			res.writeHead(200);
			res.end("hello world\n");
		}
	} else
	{
		res.writeHead(200);
		res.end("BAD ATTEMPT");
	}
}).listen(9000);
*/