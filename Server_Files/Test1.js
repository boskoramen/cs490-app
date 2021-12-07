const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors');
var crypto = require('crypto');
const max = 10000;
var sessions = {};
const fs = require('fs');
var path = './temp/temp.py';
var spawnSync = require("child_process").spawnSync;
var mysqlsync = require('sync-mysql');

var uint8arrayToString = function (data) {
	return String.fromCharCode.apply(null, data);
};

//connection for SQL server

var connectionsync = new mysqlsync({
	host: '127.0.0.1',
	user: 'root',
	password: 'vvrFWUsgnuG4',
	database: 'CS490_ExamDB'
});

function DBget(column, table, where) {
	console.log("SELECT " + column + " FROM " + table);
	if (where != undefined) {
		console.log("WHERE " + where);
		return connectionsync.query("SELECT " + column + " FROM " + table + " WHERE " + where);
	} else {
		return connectionsync.query("SELECT " + column + " FROM " + table);
	}
}

function DBset(table, values) {
	console.log("INSERT INTO " + table + " VALUES (" + values + ")");
	return connectionsync.query("INSERT INTO " + table + " VALUES (" + values + ")");
}

function DBchange(table, set, where) {
	console.log("UPDATE " + table + " SET " + set);
	if (where != undefined) {
		console.log(" WHERE " + where);
		return connectionsync.query("UPDATE " + table + " SET " + set + " WHERE " + where);
	} else {
		return connectionsync.query("UPDATE " + table + " SET " + set);
	}
}

function calculate_test_metadata(test) {
	let raw_score = 0;
	let max_score = 0;
	let test_answer_data = DBget("test_answer.*, question.name, exam_question.point_value",
		"test INNER JOIN exam ON test.exam_id = exam.exam_id INNER JOIN test_answer ON test.test_id = test_answer.test_id INNER JOIN question ON test_answer.question_id = question.question_id INNER JOIN exam_question ON exam_question.question_id = question.question_id AND exam_question.exam_id = exam.exam_id",
		"test.test_id = " + test.test_id
	);
	for (let j = 0; j < test_answer_data.length; j++) {
		const test_answer = test_answer_data[j];
		max_score += test_answer.point_value;
		const test_case_data = DBget("test_case_score.id, test_case_score.score, test_case_score.correct, test_case.input, test_case.expected_output, test_case_score.output",
			"test_case_score INNER JOIN test_case ON test_case_score.test_case_id = test_case.test_case_id",
			"test_case_score.test_answer_id = " + test_answer.test_answer_id
		);
		for (let test_case of test_case_data) {
			raw_score += test_case.score;
		}
		const constraint_data = DBget("id, name, score, correct", "constraint_score", "test_answer_id = " + test_answer.test_answer_id);
		for (let constraint of constraint_data) {
			raw_score -= constraint.score;
		}

		test_answer_data[j] = {
			...test_answer,
			test_case_data,
			constraint_data,
		};
	}
	raw_score = Math.max(0, raw_score);
	return {
		...test,
		raw_score: raw_score,
		percentage_score: raw_score/max_score,
		test_answer_data,
	};
}

function calculate_grade(score_list, constraint_list, this_test, question_id_list, exam_id) {
	if (score_list.length != constraint_list.length || constraint_list.length != question_id_list) {
		console.log("WARNING!!!\tscore_list, constraint_list, and question_id_list are mismatched");
		console.log("score_list = " + score_list);
		console.log("score_list.length = " + score_list.length);
		console.log("constraint_list = " + constraint_list);
		console.log("constraint_list.length = " + constraint_list.length);
		console.log("question_id_list = " + question_id_list);
		console.log(question_id_list);
		console.log("question_id_list.length = " + question_id_list.length);
	}
	let raw_score = 0;
	let total_score = 0;
	console.log("number of questions: " + score_list.length);
	console.log("score array: " + score_list);
	console.log(score_list);
	for (let i = 0; i < score_list.length; i++) {
		this_score = score_list[i];
		let base_score = this_score.slice(1 + constraint_list[i], this_score.length).match(/1/g)?.length;
		if (base_score == null) {
			base_score = 0
		}
		console.log("base_score is " + base_score);
		let constraint_score = this_score.slice(0, 1 + constraint_list[i]).match(/0/g)?.length || 0;
		let test_case_score = DBget("point_value", "exam_question", "question_id = " + question_id_list[i] + " AND exam_id = " +
			exam_id)[0].point_value / this_score.slice(1 + constraint_list[i], this_score.length).length;
		console.log(`constraint_score: ${constraint_score}`);
		raw_score += (base_score - constraint_score) * test_case_score;
		total_score += (this_score.slice(1 + constraint_list[i], this_score.length).length) * test_case_score;
		console.log("raw_score during: " + raw_score);
		console.log("total_score during: " + total_score);
		DBchange("test_answer", "exam_points = " + (base_score - constraint_score) * test_case_score, "question_id = " + question_id_list[i] + " AND test_id = " + this_test);
	}
	console.log("raw_score after all questions: " + raw_score);
	console.log("total_score after all questions: " + total_score);
	DBchange('test', 'percentage_score = ' + raw_score / total_score + ', raw_score = ' + raw_score, 'test_id = ' + this_test);
}

//express and settings for various parts of express
var app = express();
app.use(bodyParser.json({
	type: 'application/json'
}))
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

	if (data.use == 'login') {
		if (data.sesID != null) {
			if (sessions[data.sesID] != null && sessions[data.sesID].ip == req.ip && sessions[data.sesID].id == data.id) {
				console.log("successful sesID");
				res.send(sessions[data.sesID].usertype);
			} else {
				console.log("bad attempt");
				res.send('bad attempt');
			}
		} else {
			results = DBget("*", "login", "username = '" + data.name + "'");
			if (results.length > 0) //if they exist in DB
			{
				if (crypto.pbkdf2Sync(data.pass, results[0].salt, 9000, 50, 'sha1').toString('hex') ==
					results[0].passcode) { //if the password matches the salted hash
					//create a session ID locally appended to the end of all previous session ID's
					randy = Math.floor(Math.random() * max);
					this_id = results[0].id;
					//TODO eventually delete old session ID's, after a predertermined amount of time
					sessions = {
						...sessions,
						[randy]: {
							usertype: results[0].usertype,
							username: results[0].username,
							id: results[0].id,
							ip: req.ip
						},
					}
					//res.cookie("sesID", randy);//send session ID to user as cookie
					console.log("Sucessful login, sesID: " + randy); //It's a treat for your tummy
					res.send(results[0].usertype + ';' + randy + ';' + results[0].id); //send relevant login data
					//currently usertype for frontend use seesion id num and userid num for future use
				} else {
					console.log("bad attempt");
					res.send("bad attempt");
				}
			} else {
				console.log("bad attempt");
				res.send("bad attempt");
			}
		}


	} else if (data.use == 'question') { //if want to make a question
		console.log("Making question name = '" + data.name + "' AND function_name = '" + data.funcname +
			"' AND function_parameters = '" + data.funcparm + "' AND " + "instructor_id = " + data.id);
		results = DBget("question_id", "question", "name = '" + data.name + "' AND function_name = '" + data.funcname +
			"' AND function_parameters = '" + data.funcparm + "' AND " + "instructor_id = " + data.id + " AND topic = '" + data.topic +
			"' AND difficulty = '" + data.difficulty + "' AND constraints = '" + data.constraint + "'");
		if (results.length == 0) { //if no duplicates
			console.log("No duplicates found");
			a_check = data.funcparm.split(',');
			for (let i = 0; i < a_check.length; i++) {
				a_check[i] = a_check[i].trim().replace(/\s+/g, ' ').split(' ')
			}
			let BreakException = {};
			try {
				a_check.forEach(function (this_param) {
					console.log("this_param is :" + this_param);
					if (this_param.length != 2) {
						throw BreakException;
					}
				});
				results2 = DBset("question (name, function_name, function_parameters, instructor_id, topic, difficulty, constraints)", "'" +
					data.name + "', '" + data.funcname + "', '" + data.funcparm + "', " + data.id + ", '" + JSON.stringify(data.topic) + "', '" +
					JSON.stringify(data.difficulty) + "', '" + data.constraint + "'");
				question_id = DBget("question_id", "question", "name = '" + data.name + "' AND function_name = '" + data.funcname +
					"' AND function_parameters = '" + data.funcparm + "' AND instructor_id = " + data.id + " AND topic = '" +
					JSON.stringify(data.topic) +
					"' AND difficulty = '" + JSON.stringify(data.difficulty) + "' AND constraints = '" + data.constraint + "'")[0].question_id;
				console.log("Question with id " + question_id + " inserted into DB");
				res.send(question_id);
			} catch (e) {
				if (e !== BreakException) throw e;
				res.send('bad attempt');
			}
		} else { //send duplicate question id to user
			console.log("Duplicate found in DB sending id " + results[0].question_id + " to client");
			res.send(results);
		}


	} else if (data.use == 'get_question') { //if want to get all questions
		console.log("Retrieving questions");
		if (data.instructor_id != null) { //by instructor id
			console.log('by instructorID');
			res.send(DBget("*", "question", "instructor_id = " + data.instructor_id));
		} else { //all questions in database
			console.log('all questions');
			res.send(DBget("*", "question"));
		}
	} else if (data.use == 'get_an_exam') { //get all related questions to an exam given an exam_id
		exam_question = DBget("*", 'exam_question', 'exam_id = ' + data.exam_id);
		let exam_question_list = [];
		exam_question.forEach(function (this_question) {
			current = DBget("*", "question", "question_id = " + this_question.question_id)[0];

			console.log("retreiveing question with ID " + this_question.question_id);
			exam_question_list = [
				...exam_question_list,
				current
			]
		});
		res.send(exam_question_list);
	} else if (data.use == 'get_all_exam') { //get all exam in DB
		if (data.usertype == 'student') { //if student is attempting to check their exams
			results_not_taken = DBget("*", "exam", 'NOT EXISTS (SELECT * FROM test WHERE exam.exam_id = test.exam_id AND test.student_id = ' + data.id + ')');
			results_taken = DBget("*", "test INNER JOIN exam ON test.exam_id = exam.exam_id", "test.student_id = " + data.id +
				' AND test.release_test = 1');
			for (let i = 0; i < results_taken.length; i++) {
				const test = results_taken[i];
				results_taken[i] = calculate_test_metadata(test);
			}
			total = {
				taken: results_taken,
				not_taken: results_not_taken
			};
			res.send(total);
		} else if (data.instructor_id != null) { //by instructor id
			res.send(DBget("*", "exam", 'instructor_id = ' + data.instructor_id));
		} else { //get every exam in DB
			res.send(DBget("*", "exam"));
		}
	} else if (data.use == 'get_test') { //get completed test from DB
		let test_data = {
			reviewed: [],
			not_reviewed: [],
		};
		let tests = DBget("test.*, login.username", "test INNER JOIN login ON login.id = test.student_id", "exam_id = " +
			data.exam_id);
		for (let i = 0; i < tests.length; i++) {
			const test = tests[i];
			const updated_test = calculate_test_metadata(test);

			if (updated_test.review) {
				list_to_push = test_data.reviewed;
			} else {
				list_to_push = test_data.not_reviewed;
			}
			list_to_push.push(updated_test);
		}
		res.send(test_data);
	} else if (data.use == 'get_test_answer') {
		res.send(DBget("*", "test_answer", "test_id = " + data.test_id));
	} else if (data.use == 'get_student') {
		res.send(DBget("*", "login", "usertype = 'student'"));
	} else if (data.use == 'review') {
		data.answer_list.forEach(function (this_answer) {
			const { constraint_data, test_case_data } = this_answer;
			for (let constraint of constraint_data) {
				DBchange('constraint_score', 'score = ' + constraint.score, "id = " + constraint.id);
			}
			for (let test_case of test_case_data) {
				DBchange('test_case_score', 'score = ' + test_case.score, "id = " + test_case.id);
			}
		});
		DBchange("test", "review = 1", "test_id = " + data.test_id);
		res.send('good job');
	} else if (data.use == 'release') {
		let ids = [];
		data.test_list.forEach(function (this_test) {
			DBchange("test", "release_test = 1", "test_id = " + this_test.test_id);
			ids.push(this_test.test_id);
		});
		res.send(ids);
	} else if (data.use == 'get_review') {
		if (data.test_id != null) {
			results = DBget("*", "test_review", "test_id = " + data.test_id);
			res.send(results);
		} else {
			DBget('*', 'test_review');
			res.send(results);
		}
	} else if (data.use == 'exam') { //creating an exam
		let success = 1;
		data.question_list.forEach(function (this_question) {
			if (DBget(1, 'question', 'question_id = ' + this_question.question_id).length == 0) {
				success = 0;
			}
		});
		if (success == 1) {
			DBset('exam (name, instructor_id)', "'" + data.name + "', " + data.id);
			exam_id = DBget("exam_id", 'exam', "name = '" + data.name + "'")[0].exam_id;
			console.log("created empty exam with stringified id: " + JSON.stringify(exam_id));
			console.log("created empty exam with id: " + exam_id);
			data.question_list.forEach(function (this_question) {
				DBset('exam_question (question_id, point_value, exam_id)', this_question.question_id + ", " + this_question.point_value +
					", " + exam_id);
			});
			res.send(exam_id.toString());
		} else {
			res.send("bad attempt");
		}
	} else if (data.use == 'many_test_case') { //add a test case
		console.log('Creating test case(s)');
		data.test_case_list.forEach(function (this_case) {
			DBset('test_case (question_id, input, expected_output)', this_case.questionID + ", '" +
				this_case.input.replace(/'/gm, "\\'") + "', '" + this_case.output.replace(/'/gm, "\\'") + "'");
			console.log('Test case added');
		});
		res.send(data.test_case_list.length.toString());
	} else if (data.use == 'add_many_answer') {
		let some_check = DBget("*", "test", "student_id = " + data.id + " AND exam_id = " + data.exam_id);
		if (some_check.length == 0) {
			DBset("test (student_id, exam_id)", data.id + ', ' + data.exam_id);
			let this_test = DBget("test_id", "test", 'student_id = ' + data.id + ' AND exam_id = ' + data.exam_id)[0].test_id;
			try {
				console.log("creating student test");
				let constraint_arr = [];
				let question_id_list = [];
				for (let i = 0; i < data.answer_list.length; i++)
				{
					let output = [];
					this_answer = data.answer_list[i];
					question_id_list.push(this_answer.question_id);
					test_cases = DBget("*", "test_case", "question_id = " + this_answer.question_id);
					console.log("there are: " + test_cases.length + " test cases");
					question = DBget("*", "question", "question_id = " + this_answer.question_id);
					let these_params = question[0].function_parameters.split(',');
					for (let i = 0; i < these_params.length; i++) {
						these_params[i] = these_params[i].trim().replace(/\s+/g, ' ').split(' ')
					}
					let count = '';
					let regex = new RegExp("def\\s+" + question[0].function_name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\(");
					console.log("using regex: " + regex + " to find the function definition");
					console.log("def\\s+" + question[0].function_name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\(");
					if (this_answer.answer.match(regex)) {
						count = count + 1;
					} else {
						count = count + 0;
						this_answer.answer.replace(regex, 'def ' + question[0].function_name + '(');
					}
					let constraints = question[0].constraints.split(',');
					let constraint_names = ['name'];

					constraint_arr.push(0);
					if (constraints[0] != "") {
						let constraint_answer = this_answer.answer.replace(regex, '');
						constraints.forEach(function (this_constraint) {
							console.log("this_constraint is: " + this_constraint);
							constraint_arr[i] += 1;
							constraint_names.push(this_constraint);

							let search_str;

							if (this_constraint == "recursion") {
								search_str = question[0].function_name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
							} else {
								search_str = this_constraint;
							}

							if (constraint_answer.match(search_str) == null) {
								count = count + 0;
							} else {
								count = count + 1;
							}
						});
					}
					let modified_answer = "import sys\n" + this_answer.answer.replace(/\t/gm, "    ") + "\nprint(" + question[0].function_name +
						"(";
					for (let i = 1; i <= question[0].function_parameters.split(',').length; i++) {
						console.log("these_params is: " + these_params);

						modified_answer = modified_answer + these_params[i - 1][0] + "(sys.argv[" + i + "])";
						if (i != (question[0].function_parameters.match(/,/g) || []).length + 1) {
							modified_answer = modified_answer + ", ";
						}
					}
					modified_answer = modified_answer + '))\n';
					console.log("modified answer = " + modified_answer);
					let buffer = new Buffer.from(modified_answer, "utf-8");
					// open the file in writing mode, adding a callback function where we do the actual writing
					fd = fs.openSync(path, 'w');
					fs.writeSync(fd, buffer, 0, buffer.length, null);
					fs.closeSync(fd);
					let test_answer_data = [];
					test_cases.forEach(function (testcase) {
						temp = [path, ...testcase.input.split(' ')];
						console.log("calling function as: " + temp);
						console.log(temp);
						let process = spawnSync('python3', temp);
						data1 = uint8arrayToString(process.stdout).trim();
						output.push(data1);
						console.log("function returned with: " + data1);
						console.log("function was required to return: " + testcase.expected_output);
						if (data1 == testcase.expected_output) {
							count = count + 1;
						} else {
							count = count + 0;
						}
						test_answer_data.push({
							test_case_id: testcase.test_case_id,
							output: data1,
						});
					});
					console.log('binary string of current questions "score": ' + count);
					escaped = this_answer.answer.replace(/'/gm, "\\'");

					const result = DBset("test_answer (test_id, answer, question_id)", this_test + ", '" + escaped + "', " +
						this_answer.question_id);
					const test_answer_id = result.insertId;
					console.log(`result: ${JSON.stringify(result)}`);
					console.log(`test_answer_id: ${test_answer_id}`);
					if (!test_answer_id) {
						throw Error;
					}

					// Calculating the values of the test cases and constraints
					const max_score = DBget("point_value", "exam_question", "question_id = " + question_id_list[i] + " AND exam_id = " +
						data.exam_id)[0].point_value;
					// To account for the inherent name constraint
					const constraint_count = constraint_arr[i] + 1;
					const test_case_value = max_score / count.slice(constraint_count, count.length).length;
					let raw_score = 0;

					// Set up constraint scores
					for (let j = 0; j < constraint_count; j++) {
						const constraint_name = constraint_names[j];
						// TODO: make sure this works
						const correct = count[j] == 1;
						const value = (correct ? 0 : -test_case_value);
						DBset('constraint_score (name, test_answer_id, score, correct)',
							"'" + constraint_name + "', " + test_answer_id + ", " + value + ", " + correct
						);
						raw_score -= value;
					}

					// Set up test case scores
					for (let j = constraint_count; j < count.length; j++) {
						const correct = count[j] == 1;
						const value = (correct ? test_case_value : 0);
						const test_case_data = test_answer_data[j - constraint_count];
						DBset('test_case_score (test_answer_id, test_case_id, score, output, correct)',
							test_answer_id + ", " + test_case_data.test_case_id + ", "
							+ value + ", '" + test_case_data.output + "', " + correct
						);
						raw_score += value;
					}
				}
				// calculate_grade(score, constraint_arr, this_test, question_id_list, data.exam_id);
				res.send(this_test.toString());
			} catch (e) {
				connectionsync.query("DELETE FROM test WHERE test_id = " + this_test);
				res.send('bad attempt');
				throw e;
			}
		} else {
			console.log("bad attempt");
			res.send("bad attempt");
		}
	} else if (data.use == 'delete') {
		connection.query("DELETE FROM '" + data.table + "' WHERE PRIMARY KEY = " + data.primary, function (error, results, fields) {
			if (error) throw error;
			res.send("it's gones");
		});
	} else { //no usecase found
		res.send("bad attempt");
	}
})

app.listen(9000, function () {
	console.log("Slim Shady has been avtivated");
})