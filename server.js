const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);



//keep track of how many clients is on
var numberOfClients = 0;
var poem;


function UpdateValues(sensor_data) {

	// Only send data when there are connected users
	if (numberOfClients > 0) {
		io.sockets.emit('sensor data', { data: sensor_data });
	}
}

function start() {

    // Start listening on port 8080
	server.listen(8080, function () {
	    console.log('Express server listening on port 8080');
	});
    
    // Respond to web GET requests with index.html page
	app.get('/', function (request, response) {
	    response.sendFile(__dirname + '/public/index.html');
	});
      
	// Define route folder for static requests
	app.use(express.static(__dirname + '/public'));

	// Increment client counter if someone connects
	io.on('connection', function (socket) {
		numberOfClients++;

		// Decrement client counter if someone disconnects
		socket.on('disconnect', function () {
			numberOfClients--;
		});

		// Adding click trackor
		socket.on('clicked', function(data) {	
			console.log("this is the data "+data);
			// changing the string data into 3 words
			data = randomWords(data).slice(-3).join(" ")
			console.log("this is the randomWords "+data);
			callopenai(data, poem => {
				console.log("this is the poem "+poem);
				data = "Your poem kaywords: "+data;
				io.emit('buttonUpdate', poem);
			});
			

	  });
	});
}


// For OPENAI Api
const axios = require('axios'); // For Axios, a promise-based HTTP Client for node.js\. 
require('dotenv').config();
const OpenAI = require('openai-api'); 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = axios.create({
  headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY }
});
// Using OPENAI, passing a prompt and getting a result
function callopenai(value_tring, callback){
    const params = {
      "model": "text-davinci-003",
      "prompt": "TITLE & TOPIC: hallucinate titles and first lines. BODY: Write the body of the poem, using '"+value_tring+"' as a keyword and examples of contemporary free verse poetry as inspiration. REAPER: Write a satisfying end to the poem. Each line should contain the <br> tag at the end.",
      "max_tokens": 156,
      "temperature": 0.7,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0,
    } ;
    // console.log("Current prompt: " + params.prompt);
    client.post('https://api.openai.com/v1/completions', params)
    .then(result => {
      console.log("\n");
      console.log("Current result: "+ result.data.choices[0].text);
	  const rest = result.data.choices[0].text.slice();
	  callback(rest)
  }).catch(err => {
    console.log(err);
  });
  }

// get the word
var randomWords = require('random-words'); // For getting a random word from an integar
let RiTa = require('rita'); // For Markov-based text generation



// exports.callopenai = callopenai;
exports.start = start;
exports.UpdateValues = UpdateValues;