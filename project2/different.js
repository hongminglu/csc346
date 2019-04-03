var timer;
var seconds;
var index;
var maxCount = 5; 

window.onload = function() {
	document.getElementById("settingsArea").style.display = "block";
	document.getElementById("displayArea").style.display = "none";
	document.getElementById("resultArea").style.display = "none";
	document.getElementById("scoreArea").style.display = "none";
};


function createDisplayImage() {
	var leftArea = document.getElementById("displayLeft");
	var rightArea = document.getElementById("displayRight");
	
	leftArea.innerHTML = "";
	rightArea.innerHTML = "";
	
	for (var i = 1; i < 5; i++)
	{
		leftArea.innerHTML += "<div class='puzzleBase puzzle" + i + " imageSource" + index +"'>" + i + "</div>";
		rightArea.innerHTML += "<div class='puzzleBase puzzle" + i + " imageSourceDiff" + index +"'>" + i + "</div>";
	}
}


function InitSettings() {
	var userName = document.getElementById("userName").value;
	if(userName == "")
	{
		alert("please fill in user name.");
		return;
	}
	
	var regUser = /^[a-zA-Z]+[a-zA-Z0-9]*$/;
	if(!regUser.test(userName))
	{
		alert("user name is invalid!")
		return;
	}
	
	var disSeconds = document.getElementById("displaySeconds").value;
	if(disSeconds == "")
	{
		alert("please fill in seconds.");
		return;
	}
	
	var regSec = /^[0-9]+$/;
	if(!regSec.test(disSeconds))
	{
		alert("display second is invalid!")
		return;
	}
	
	index = 1;
	seconds = parseInt(disSeconds);
	
	document.getElementById("displayUserName").innerHTML = userName;
	document.getElementById("leftSeconds").innerHTML = seconds;
	
	createDisplayImage();
	
	document.getElementById("settingsArea").style.display = "none";
	document.getElementById("displayArea").style.display = "block";
	document.getElementById("resultArea").style.display = "none";
	document.getElementById("scoreArea").style.display = "none";
	
	timer = setInterval("clock()",1000);
}

function clock() {
	if(seconds > 0) {
		seconds--;
		document.getElementById("leftSeconds").innerHTML = seconds;
	}
	else {
		document.getElementById("leftSeconds").innerHTML = "0";
		clearInterval(timer);
		
		document.getElementById("settingsArea").style.display = "none";
		document.getElementById("displayArea").style.display = "none";
		document.getElementById("resultArea").style.display = "block";
		document.getElementById("scoreArea").style.display = "none";
	}
}

function confirmAnswer() {
	var name = document.getElementById("userName").value;
	var answer = document.getElementById("differentNum").value;
	if(answer == "")
	{
		alert("please fill in answer.");
		return;
	}
	
	var regAnswer = /^[0-9]+$/;
	if(!regAnswer.test(answer))
	{
		alert("answer is invalid!")
		return;
	}
	
	var message = {};
	if(index == 1)
	{
		message["operate"] = "answer1";
	}
	else
	{
		message["operate"] = "answers";
	}
	message["name"] = name;
	message["answer"] = answer;
		
	var fetchOptions = {
		method:'POST',
		headers : {
			"Accept" : "application/json",
			"Content-Type" : "application/json"
		},
		body : JSON.stringify(message)
	};
			
	var url = "http://localhost:3000";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				if(responseText == "successful!") {
					index++;
					if (index <= maxCount)
					{
						createDisplayImage();
						
						document.getElementById("settingsArea").style.display = "none";
						document.getElementById("displayArea").style.display = "block";
						document.getElementById("resultArea").style.display = "none";
						document.getElementById("scoreArea").style.display = "none";
						
						seconds = parseInt(document.getElementById("displaySeconds").value);
						document.getElementById("leftSeconds").innerHTML = seconds;
						timer = setInterval("clock()",1000);
						
						document.getElementById("differentNum").value = "";
					}
					else
					{
						GetScore(name);
						
						document.getElementById("settingsArea").style.display = "none";
						document.getElementById("displayArea").style.display = "none";
						document.getElementById("resultArea").style.display = "none";
						document.getElementById("scoreArea").style.display = "block";
					}
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	
	
}

function GetScore(userName) {
	var scoreNum = document.getElementById("scoreNum");	
	var userName = document.getElementById("userName").value;
	var url = "http://localhost:3000/?username=" + userName;

	fetch(url)
	.then(checkStatus)
	.then(function(responseText){
		var json = JSON.parse(responseText);	
		scoreNum.innerHTML = json.score;
	});
}

function displaySettingsArea() {
	document.getElementById("differentNum").value = "";
	
	document.getElementById("settingsArea").style.display = "block";
	document.getElementById("displayArea").style.display = "none";
	document.getElementById("resultArea").style.display = "none";
	document.getElementById("scoreArea").style.display = "none";
}

function checkStatus(response) {  
	if (response.status >= 200 && response.status < 300) {  
		return response.text();
	} 
	else if (response.status == 404) {
		return Promise.reject(new Error("Sorry, we couldn't find that page")); 
	} 
	else {  
		return Promise.reject(new Error(response.status+": "+response.statusText)); 
	}
}	
	
	
	



