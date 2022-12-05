const {Board, Sensor} = require("johnny-five");
var server = require('./server');
const board = new Board();

//  stack record the sensor values
var sensor_data = { values: []};

// how many values to record
var N = 10;

// Start server
server.start();

board.on("ready", function() {
// sensor record some values
const sensor = new Sensor({
    pin: "A2",
    freq: 1000
});
sensor.on("data", measurement=> LogSensorData(measurement));
});

function LogSensorData (measurement) {
    console.log("Current value: " + measurement);
    //Always add to the front of the list
    sensor_data.values.unshift(measurement);
    // Pop values if exceeding certain length
    if (sensor_data.values.length > N) sensor_data.values.pop();
    console.log("values:  " + sensor_data.values);
    // Update Values in the websocket
    server.UpdateValues(sensor_data);
};

