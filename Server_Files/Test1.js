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
		if (sessions[data.sesID] != null && sessions[data.sesID].ip == req.ip && sessions[data.sesID].id == data.id)
		{
			console.log("COOKIECAT! It's super duper yummy!");
			console.log(data.id);
			if (data.use == 'question')
			{//if want to make a question
				console.log("Riddle me this batman!");
				success = 1;
				connection.query('INSERT INTO question (name, function_name, function_parameters, instructor_id)' +
					"VALUES ('" + data.qname + "', '" + data.funcname + "', " + data.funcparm + "', " + data.id + ")",
					function (error, results, fields)
				{//insert question into DB
					if (error) throw error;
					console.log('I hold all the answers, but am seen by none, what am I?');
					connection.query('SELECT question_id FROM question WHERE name = ' + data.name, ' AND function_name = '
						+ data.funcname + ' AND function_parameters = ' + data.funcparm + ' AND instructor_id = ' +
						data.id, function (errors, result, field)
					{
						if (errors) throw errors;
						console.log("You've foiled me again batman!");
						res.send(result);
					});
				});
			} else if (data.use == 'get_question')
			{//if want to get all questions
				console.log("Gotta catch 'em all");
				connection.query('SELECT * FROM question', function (error, results, fields)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'get_question')
			{//if want to get all questions
				console.log("Gotta catch 'em all");
				connection.query('SELECT * FROM question', function (error, results, fields)
				{
					if (error) throw error;
					console.log('Pokémon');
					res.send(results);
				});
			} else if (data.use == 'test_case')
			{//add a test case
				console.log('Baka to test');
				connection.query('INSERT INTO test_case (question_id, input, expected_output) VALUES (' + data.id
					+ "', '" + data.input + "', " + data.ouput, function (errors, result, field)
				{//insert test case into DB using retrieved question ID and given test case data
					if (error) throw error;
					console.log('Was an incredibly average anime');
					res.send(data.input);
				});
			} else if (data.use == 'exam')
			{//make an exam
				console.log('');
				connection.query("INSERT INTO exam (name, instructor_id) VALUES ('" + data.name + "', '" + data.id + ")",
					function (error, results, fields)
				{
					if (error) throw error;
					res.send(data.name);
				});
			} else if (data.use == 'get_exam')
			{//get all related questions to an exam
				connection.query('SELECT * FROM exam WHERE name = ' + data.name, function (errors, result, field)
				{
					if (error) throw error;
					res.send(result);
				});
			} else if (data.use == 'get_exam_question')
			{
				connection.query('SELECT * FROM exam_question WHERE exam_id = ' + data.id, function (errors, result,
					field)
				{
					if (error) throw error;
					res.send(result);
				});
			} else if (data.use == 'get_question_id')
			{
				connection.query('SELECT * FROM question WHERE question_id = ' + data.id, function (errors, result,
					field)
				{
					if (error) throw error;
					res.send(result);
				});
			} else if (data.use == 'get_test_case')
			{
				connection.query('SELECT * FROM test_case WHERE question_id = ' + data.id, function (errors, result,
					field)
				{
					if (error) throw error;
					res.send(result);
				});
			} else
			{//not using something, likely logging in
				res.send(sessions[data.sesID].usertype);
			}
		} else
		{
			console.log("HE LEFT HIS FAMILY BEHIND!");
			res.send('bad attempt');
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
		connection.query("SELECT * FROM login WHERE username = '" + data.name + "'", function (error, results, fields)
		{
			if (error) throw error;
			if (results.length > 0) //if they exist in DB
			{
				console.log("My name is who");
				if (crypto.pbkdf2Sync(data.pass, results[0].salt, 9000, 50, 'sha1').toString('hex') ==
					results[0].passcode)
				{//if the password matches the salted hash
					console.log("My name is CHIKA CHIKA");
					//create a session ID locally appended to the end of all previous session ID's
					randy = Math.floor(Math.random() * max);
					this_id = results[0].id;
					//TODO eventually delete old session ID's, after a predertermined amount of time
					sessions =
					{
						...sessions,
						[randy]:
						{
							usertype: results[0].usertype,
							username: results[0].username,
							id : results[0].id,
							ip: req.ip
						},
					}
					console.log("SLIM SHADY!");
					//res.cookie("sesID", randy);//send session ID to user as cookie
					console.log("Cookiecat: " + randy);//It's a treat for your tummy
					res.send(results[0].usertype + ';' + randy + ';' + results[0].id);//send relevant login data
					//currently usertype for frontend use seesion id num and userid num for future use
				} else
				{
					res.send("bad attempt");
				}
			} else
			{
				res.send("bad attempt");
			}
		});
	} else
	{//no usecase found
		res.send("bad attempt");
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
			res.send("hello world\n");
		}
	} else
	{
		res.writeHead(200);
		res.send("BAD ATTEMPT");
	}
}).listen(9000);
*/