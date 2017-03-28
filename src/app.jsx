
let React       = require('react');
let ReactDOM    = require('react-dom');
let Redux       = require('redux');
let reducer     = require('./reducer');
let webrtc      = require('./webrtc');
let {Terminal}  = require('./terminal');

global.w = webrtc

//let Store = Redux.createStore(reducer);

let content = ["react initializing..."];
let mount = document.getElementById("mount");

let terminal  = ReactDOM.render(<Terminal content={content} />, mount);

terminal.log("terminal online");

webrtc.join("/d/default.rtc", () => {
  terminal.log("webrtc meeting point joined...")
  terminal.log("session: " + webrtc.id);
});

webrtc.onarrive = function() {
  //terminal.log("peer arrived...")
}

webrtc.ondepart = function() {
  //terminal.log("peer departed...")
}

webrtc.onusergram = function(from, msg) {
  terminal.log("message:" + from + ": " + JSON.stringify(msg))
}

webrtc.ondatachannel = function(m) {
  terminal.log("webrtc data channel open")
  webrtc.broadcast({ hello: "world" })
}
