const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors');
var mysql = require('mysql');
var crypto = require('crypto');
const max = 10000;
var sessions = {};
const fs = require('fs');
var path = './temp/temp.py';
var spawn = require("child_process").spawn;

//connection for SQL server
var connection = mysql.createConnection({
host     : '127.0.0.1',
user     : 'root',
password : 'vvrFWUsgnuG4',
database : 'CS490_ExamDB'
});

/*
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
*/

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
        origin: [
	    'http://localhost:8080',
	    'http://52.7.114.65',
        ],
	credentials: true,
	exposedHeaders: 'Set-Cookie'
}));

//main body of code, what to do when recieving packets
app.use('/', function (req, res) {
	console.log(req.body);
	data = req.body;
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
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
			if (data.use == 'question')
			{//if want to make a question
				console.log("Riddle me this batman!");
				connection.query("SELECT question_id FROM question WHERE name = '" + data.name + "' AND function_name = '" + data.funcname +
					"' AND function_parameters = '" + data.funcparm + "' AND " + "instructor_id = " + data.id, function (error, results, fields)
				{
					if (error) throw error;
					console.log('I hold all the answers, but am seen by none, what am I?');
					if (results.length == 0)
					{
						connection.query("INSERT INTO question (name, function_name, function_parameters, instructor_id) VALUES ('" +
							data.name + "', '" + data.funcname + "', '" + data.funcparm + "', " + data.id + ")"/*" WHERE NOT EXISTS (SELECT 1 FROM " +
							"question WHERE name = '" + data.name + "' AND function_name = '" + data.funcname + "' AND function_parameters = '" +
							data.funcparm + "' AND " + "instructor_id = " + data.id + ")"*/, function (error, results2, fields)//comment doesnt work?
						{//insert question into DB
							if (error) throw error;
							console.log("A database you say!?!");
							connection.query("SELECT question_id FROM question WHERE name = '" + data.name + "' AND function_name = '"
								+ data.funcname + "' AND function_parameters = '" + data.funcparm + "' AND instructor_id = " + data.id,
								function (error, results1, fields)
							{
								if (error) throw error;
								console.log("You've foiled me again batman!");
								res.send(results1);
							});
						});
					} else
					{
						res.send(results);
					}
				});
			} else if (data.use == 'get_question')
			{//if want to get all questions
				console.log("Gotta catch 'em all");
				if (data.instructor_id != null)
				{
					connection.query("SELECT * FROM question WHERE instructor_id = " + data.instructor_id, function (error, results, fields)
					{
						if (error) throw error;
						console.log('Nevermind');
						res.send(results);
					});
				} else
				{
					connection.query('SELECT * FROM question', function (error, results, fields)
					{
						if (error) throw error;
						console.log('Pokémon');
						res.send(results);
					});
				}
			/*
			} else if (data.use == 'test_case')
			{//add a test case
				console.log('Baka to test');
				connection.query('INSERT INTO test_case (question_id, input, expected_output) VALUES (' + data.question_id
					+ "', '" + data.input + "', " + data.ouput, function (error, results, field)
				{//insert test case into DB using retrieved question ID and given test case data
					if (error) throw error;
					console.log('Was an incredibly average anime');
					res.send(data.input);
				});
			*/
			} else if (data.use == 'exam')
			{//make an exam
				console.log('9x - 7i < 3(3x - 7u)');
				connection.query("SELECT 1 FROM exam WHERE name = '" + data.name + "' AND instructor_id = " + data.id,
					function (error, results2, fields)
				{
					if (error) throw error;
					if (results2.length == 0)
					{
						connection.query("INSERT INTO exam (name, instructor_id) " + /*"OUTPUT inserted.exam_id " + */"VALUES ('" + data.name +
						"', " + data.id + ")", function (error, results, fields)
						{
							if (error) throw error;
							console.log('i <3 u');
							connection.query("SELECT exam_id FROM exam WHERE name = '" + data.name + "' AND instructor_id = " + data.id,
								function (error, results1, fields)
							{
								if (error) throw error;
								res.send(results1);
							});
						});
					} else
					{
						res.send('bad attempt');
					}
				});
			} else if (data.use == 'get_exam')
			{//get all related questions to an exam
				connection.query('SELECT * FROM exam', function (error, results, field)
				{
					if (error) throw error;
					console.log("Don't even know what to put here");
					res.send(results);
				});
			} else if (data.use == 'get_exam_question')
			{
				connection.query('SELECT question_id FROM exam_question WHERE exam_id = ' + data.exam_id, function (error, results,
					field)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'get_question_id')
			{
				connection.query('SELECT * FROM question WHERE question_id = ' + data.question_id, function (error, results,
					field)
				{
					if (error) throw error;
					res.send(results[0]);
				});
			} else if (data.use == 'get_test_case')
			{
				connection.query('SELECT * FROM test_case WHERE question_id = ' + data.question_id, function (error, results,
					field)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'get_exam_inst_id')
			{
				connection.query('SELECT * FROM exam WHERE instructor_id = ' + data.instructor_id, function (error, results,
					field)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'get_all_exam')
			{
				connection.query('SELECT * FROM exam' + data.instructor_id, function (error, results, field)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'add_question_exam')
			{
				connection.query('INSERT INTO exam_question (question_id, point_value, exam_id) VALUES (' + data.question_id +
					', ' + data.point_value + ', ' + data.exam_id + ')', function (error, results, field)
				{
					if (error) throw error;
					res.send(data.question_id);
				});
			} else if (data.use == 'start_test')
			{
				connection.query('INSERT INTO test (student_id, exam_id) VALUES (' + data.id + ', ' + data.exam_id + ')',
					function (error, results, field)
				{
					if (error) throw error;
					connection.query('SELECT test_id FROM test WHERE student_id = ' + data.id + ' AND exam_id = ' + data.exam_id,
						function (error, results1, fields)
					{
						if (error) throw error;
						res.send(results1[0]);
					});
				});
			} else if (data.use == 'answer')
			{//TODO-------------------------------------------------------------------------------------------------------------
			//NEED TO ADD SIMPLE GRADING AT THIS POINT--------------------------------------------------------------------------
			//------------------------------------------------------------------------------------------------------------------
			//HOWTO RUN PYTHON FROM JS?-----------------------------------------------------------------------------------------
			//------------------------------------------------------------------------------------------------------------------
			//Change insert statement to add simple graded score, will likely need to pull all needed info from DB... quite a
			//few pulls I think... test cases, exam question info for scoring info
				connection.query('INSERT INTO test_answer (test_id, exam_question_id) VALUES (' + data.test_id + ', ' +
					data.exam_question_id + ')', function (error, results, field)
				{
					if (error) throw error;
					res.send(data.test_id);
				});
			} else if (data.use == 'get_test')
			{
				connection.query('SELECT * FROM test_answer WHERE student_id = ' + data.student_id + ' AND exam_id = ' +
					data.exam_id, function (error, results, fields)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'get_student')
			{
				connection.query('SELECT id FROM login WHERE usertype = student', function (error, results, fields)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'review')
			{
				connection.query('INSERT INTO test_review (test_id, percentage_score, raw_score, instructor_id, release) ' +
					'VALUES (' + data.test_id + ', ' + data.p_score + ', ' + data.raw_score + ', ' + data.id + ', ' + data.release +
					')', function (error, results, fields)
				{
					if (error) throw error;
					res.send(data.p_score);
				});
			} else if (data.use == 'get_review')
			{
				connection.query('SELECT * FROM test_review WHERE test_id = ' + data.test_id, function(error, results, fields)
				{
					if (error) throw error;
					res.send(results);
				});
			} else if (data.use == 'add_many_question_exam')
			{
				console.log("there once was a man from nantucket");
				data.question_list.forEach(function (this_question)
				{
					console.log("Who kept all his cash in a bucket");
					connection.query("SELECT 1 FROM exam_question WHERE question_id = " + this_question.question_id + " AND point_value = " + 
						this_question.point_value + " AND exam_id = " + data.exam_id, function (error, results1, fields)
					{
						if (error) throw error;
						console.log("But his doughter named Nan");
						if (results1.length == 0)
						{
							console.log("Ran away with a man");
							connection.query('INSERT INTO exam_question (question_id, point_value, exam_id) VALUES (' +
								this_question.question_id + ', ' + this_question.point_value + ', ' + data.exam_id + ')',
								function (error, results, field)
							{
								if (error) throw error;
								console.log("And as for the bucket, Nantucket");
								//console.log(results);//what does DB return anyway?
							});
						}
					});
				});
				res.send(data.question_list.length.toString());
			} else if (data.use == 'many_test_case')
			{//add a test case
				console.log('Baka to test');
				data.test_case_list.forEach(function (this_case)
				{
					connection.query('INSERT INTO test_case (question_id, input, expected_output) VALUES (' + this_case.questionID
						+ ", '" + this_case.input + "', '" + this_case.output + "')", function (error, results, field)
					{//insert test case into DB using retrieved question ID and given test case data
						if (error) throw error;
						console.log('Was an incredibly average anime');
					});
				});
				res.send(data.test_case_list.length.toString());
			} else if (data.use == 'add_many_answer')
			{
				console.log("So I met this guy the other day");
				connection.query("SELECT 1 FROM test_answer WHERE test_id = " + data.test_id, function (error, results, fields)
				{
					if (error) throw error;
					if (results.length == 0)
					{
						console.log("And this creep told me he would give me 20 dollars if I sucked his dick");
						data.answer_list.forEach(function (this_answer)
						{
							console.log("But he lied, it was only 10 dollars");
							let buffer = new Buffer(this_answer.answer);
							// open the file in writing mode, adding a callback function where we do the actual writing
							fs.open(path, 'w', function(err, fd) {
								if (err) {
									throw 'could not open file: ' + err;
								}// write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
								fs.write(fd, buffer, 0, buffer.length, null, function(err) {
									if (err) throw 'error writing file: ' + err;
									fs.close(fd, function() {
										console.log('wrote the file successfully');
									});
								});
							});
							connection.query("SELECT input expected_output FROM test_case WHERE question_id = " + this_answer.question_id,
								function (error, results1, fields)
							{
								if (error) throw error;
								count = 0;
								results1.forEach(function (testcase)
								{
									var process = spawn('python3',[path, testcase.input]);
									console.log(process);
									if (process == testcase.expected_output)
									{
										console.log("Last time I listen to a homeless guy behind a Wendy's");
										count = count++;
									}
								});
								score = count/results1.length;
								connection.query('INSERT INTO test_answer (test_id, exam_question_id, score) VALUES (' + data.test_id + ', ' +
									this_answer.question_id + ", " + score + ")", function (error, results2, fields)
								{
									if (error) throw error;
								});
							});
						});
					}
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
