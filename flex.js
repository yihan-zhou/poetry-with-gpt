// TODOs:
// Get the result from j5
// Iteration: have some pre-selected words, add the pulse data to embeddings
// Able to generate an poem and some visuals using p5


////////////////////////////////Get needed libraries////////////////////////////////
const {execSync} = require('child_process'); // For the sleep function
const axios = require('axios'); // For Axios, a promise-based HTTP Client for node.js\. 
require('dotenv').config()

var randomWords = require('random-words'); // For getting a random word from an integar
let RiTa = require('rita'); // For Markov-based text generation


// For OPENAI Api
const OpenAI = require('openai-api'); 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);
const client = axios.create({
  headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY }
});
////////////////////////////////Get needed libraries////////////////////////////////


// get pulse
const {Board, Sensor} = require("johnny-five");
const board = new Board();
var value_list = [];


function flex(){
  board.on("ready", function() {
    const flex = new Sensor({
    pin: "A2"
    });
    // Inject the `flex` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({ flex });
    flex.on("change", value => add_value(value));
  });
};

// Getting the current value
function add_value(value){
  if (value_list.length<=100){
    value_list.push(value);
  }else{
    value_list =[];
    value_list.push(value);
    console.log(getWord(value));
    execSync('sleep 10');
    }
}

// Getting the result from openaiapi
async function getWord(value){
  var value_tring = "";
  const value_list = [];
  value_list.push(randomWords(flex.value));
  value_tring = value_list.slice(-3).join(" ");
  result = callopenai(value_tring);
  return await result
}

// Using OPENAI, passing a prompt and getting a result
function callopenai(value_tring){
  const params = {
    "model": "text-davinci-002",
    "prompt": "TITLE & TOPIC: hallucinate titles and first lines. BODY: Write the body of the poem, using '"+value_tring+"' as a keyword and examples of contemporary free verse poetry as inspiration. REAPER: Write a satisfying end to the poem",
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
}).catch(err => {
  console.log(err);
});
}

flex();


// openai API keys
// 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