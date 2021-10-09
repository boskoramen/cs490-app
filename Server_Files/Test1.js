const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors');
var mysql = require('mysql');
var crypto = require('crypto');
const max = 10000;
var sessions = {};

//connection for SQL server
var connection = mysql.createConnection({
host     : '127.0.0.1',
user     : 'root',
password : 'vvrFWUsgnuG4',
database : 'CS490_ExamDB'
});


//Used to make salts "a_salt = makeid(20);"
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

//express and settings for various parts of express
var app = express();
app.use(bodyParser.json({ type: 'application/json' }))
app.use(cors({
	allowedHeaders: 'Content-Type',
	origin: 'http://localhost:8080',
	credentials: true,
	exposedHeaders: 'Set-Cookie'
}));

//main body of code, what to do when recieving packets
app.use('/', function (req, res) {
	console.log(req.body);
	data = req.body;
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
	
	
	// Check if they have a session ID and if valid sign them in
	if (data.sesID != null)
	{
		console.log("COOKIECAT! It's a treat for your tummy!");
		//console.log(data.cookies);
		if (sessions[data.sesID] != null && sessions[data.sesID].ip == req.ip)
		{
			console.log("COOKIECAT! It's super duper yummy!");
			res.end(sessions[data.sesID].usertype);
		} else
		{
			console.log("HE LEFT HIS FAMILY BEHIND!");
			res.end('bad attempt');
		}
	} else if (data.name != null)
	{//if no sesID attempt to login
		console.log("My name is what?");

		//depracated password generator
		/*
		a_salt = makeid(20);
		a_pass = crypto.pbkdf2Sync(data.pass, a_salt, 9000, 50, 'sha1');
		console.log("password is: " + a_pass.toString('hex'));
		console.log("salt is: " + a_salt);
		*/
		
		//if no sesID attempt to login
		//TODO fix after DB shema change?-----------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------
		connection.query("SELECT * FROM login l, student s, insttructor i WHERE l.username = '" + data.name + "' AND "
		"l.id = i.user_id OR l.id = s.user_id", function (error, results, fields)
		{
			if (error) throw error;
			{
				if (results.length > 0) //if they exist in DB
				{
					console.log("My name is who");
					if (crypto.pbkdf2Sync(data.pass, results[0].salt, 9000, 50, 'sha1').toString('hex') == results[0].passcode)
					{//if the password matches the salted hash
						console.log("My name is CHIKA CHIKA");
						//create a session ID locally appended to the end of all previous session ID's
						randy = Math.floor(Math.random() * max);
						this_id = result
						//TODO eventually delete old session ID's, after a predertermined amount of time
						sessions =
						{
							...sessions,
							[randy]:
							{
								usertype: results[0].usertype,
								username: results[0].username,
								ip: req.ip
							},
						}
						console.log("SLIM SHADY!");
						console.log("Cookiecat: " + randy);//It's a treat for your tummy
						//res.cookie("sesID", randy);//send session ID to user as cookie
						console.log("Cookiecat: " + randy);//It's a treat for your tummy
						res.end(results[0].usertype + ";" + randy);//send usertype to user to finalize login
					} else
					{
						res.end("bad attempt");
					}
				} else
				{
					res.end("bad attempt");
				}
			}
		});
	} else
	{//if not logging in make a question
		connection.query('INSERT INTO question (name, function_name, function_parameters, instructor_id)'
		"VALUES ('" + data.qname + "', '" + data.funcname + "', " + data.funcparm + "', " + data.id ")",
		function (error, results, fields)
		{
		});
	}
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