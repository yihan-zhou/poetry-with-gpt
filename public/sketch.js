// Client-side js

function setup() {
    // Create Canvas
    createCanvas(500, 500);
}
   
let value = 0;
var socket = io.connect();
  

var value_tring;
var temp_list = []

function update(message) {
	var data = message.data;

	// Convert the data parsed into a whole number
    var meas = data.values;
    if (temp_list.length < 10){
        temp_list.push(meas)
    }else{
        temp_list = [];
        temp_list.push(meas)
    }
    return temp_list
}

function buttonClicked(){
    value_tring = temp_list[0][0];
    socket.emit('clicked', value_tring);
    // console.log('buttonClicked emit '+ value_tring);
  }
  
//when we receive buttonUpdate, do this
socket.on('buttonUpdate', function(data){
    value_tring = temp_list[0][0];
    console.log(value_tring);
    document.getElementById("buttonCount").innerHTML = data;
    // document.getElementById("buttonCount").innerHTML = 'Current pulse value ' + value_tring + ' .';
});

// When data is received, run the update function
socket.on('sensor data', update);

// function draw() {
      
//     // Set background color
//     background(200);
      
//     // Fill the color
//     fill(value, value-50, value-100);
//     // Create rectangle
//     rect(25, 25, 460, 440);
//     // Set the color of text
//     fill('lightgreen');
//     // Set font size
//     textSize(15);
//     // Display content
//     text('Current value: '
//         + value);
// }

// Uncomment to get the original update function
// function update(message) {
// 	var data = message.data;

// 	// Convert the data parsed into a whole number
//     var meas = data.values;

//     // Clear front end
//     let list = document.getElementById("values");
//     list.innerHTML = "";

//     // Update the front end the with values
//     var i = 0;
//     meas.forEach((item)=>{
//      let li = document.createElement("li");
//      li.innerText = "(measurement #" + i + ") " + item;
//      list.appendChild(li);
//      i += 1;
//     });
// }

// function mousePressed() {

//     value_tring = temp_list[0][0];
//     console.log(value_tring);

//     // value = value + 50;
      
//     // if (value > 255) {
//     //     value = 0;
//     // }
// }