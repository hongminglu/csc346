
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	var operate = req.body.operate;
	var name = req.body.name;
	var answer = req.body.answer;
  
    if(operate == "answer1")
	{
		fs.writeFile(name + ".txt", answer + "\r\n", function(err) { 
			if(err) {
				console.log(err);
				res.send("error!");
			}
			else {
				res.send("successful!");
			}
		});
	}
	else
	{
		fs.appendFile(name + ".txt", answer + "\r\n", function(err) {
			if(err) {
				console.log(err);
				res.send("error!");
			}
			else {
				res.send("successful!");
			}
		}); 
	}
    
});

app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	var name = req.query.username;
	
	var fileRightAnswer = fs.readFileSync("RightAnswer.txt", 'utf8');
	var rightLines = fileRightAnswer.split("\r\n");
	
	var fileUserAnswer = fs.readFileSync(name + ".txt", 'utf8');
	var userLines = fileUserAnswer.split("\r\n");
	
	var rightCount = 0;
	var totalCount = rightLines.length;
	
	for (var i=0; i<rightLines.length; i++){
		if(userLines[i] == rightLines[i]) {
			rightCount++;
		}
	}
	
	var data = {};
	data.score = Math.round(rightCount/totalCount*100);
	
	res.send(JSON.stringify(data));
});


app.listen(3000);












