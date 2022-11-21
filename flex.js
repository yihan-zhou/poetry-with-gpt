// Get a list of pulse data
// send to GPT3 API
// Iteration: have some pre-selected words, add the pulse data to embeddings


const axios = require('axios');
require('dotenv').config()

let RiTa = require('rita');

var randomWords = require('random-words');

const OpenAI = require('openai-api');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

const client = axios.create({
  headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY }
});


function callopenai(value_tring){
  const params = {
    "prompt": value_tring, 
    "max_tokens": 10
  }  
  console.log("\n");
  console.log("\n");
  console.log("Current prompt: " + params.prompt)
  client.post('https://api.openai.com/v1/engines/davinci/completions', params)
  .then(result => {
    console.log("\n");
    console.log("Current result: "+ params.prompt + result.data.choices[0].text);
}).catch(err => {
  console.log(err);
});
}

// get pulse
const {Board, Sensor} = require("johnny-five");
const board = new Board();
const value_list = [];
var current_value = 0;
var previous_value = 0;
var value_tring = "";



function flex(){
board.on("ready", function() {
  const flex = new Sensor({
  pin: "A2"
  });

  // Inject the `flex` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({ flex });

  flex.on("change", value => {
    current_value = flex.value;
    if (current_value==previous_value){
      // console.log(current_value+' equals to '+previous_value);
    }else if(current_value==previous_value+1){
      // console.log(current_value+' incresed 1');
    }else if(current_value==previous_value-1){
      // console.log(current_value+' decreased 1');
    } else{
      value_list.push(randomWords(flex.value));
      // console.log(value_list[0].slice(-2));
      value_tring = value_list[0].slice(-3).join(" ");
      callopenai(value_tring);
      
    }
    previous_value = flex.value;
    });
    setTimeout(board.off, 10000);
});
};


flex();



// openai API keys
// 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


// function getWord(value){
//   var value_tring = "";
//   const value_list = [];
//   value_list.push(randomWords(flex.value));
//   value_tring = value_list.slice(-3).join(" ");
//   return callopenai(value_tring)
// }
// getWord(10)