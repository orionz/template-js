
let React       = require('react');
let ReactDOM    = require('react-dom');
let Redux       = require('redux');
let reducer     = require('./reducer');
let {Terminal}  = require('./terminal');

//let Store = Redux.createStore(reducer);

let content = ["react initializing..."];
let mount = document.getElementById("mount");

let terminal  = ReactDOM.render(<Terminal content={content} />, mount);
terminal.log("terminal online");

