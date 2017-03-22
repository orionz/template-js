
let React       = require('react');
let ReactDOM    = require('react-dom');
let Redux       = require('redux');
let reducer     = require('./reducer');

class Foo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div className="foo"> {this.props.content} </div>);
  }
}

let Store = Redux.createStore(reducer);
let content = "react initializing...";
let mount = document.getElementById("mount");
console.log("Mount node", mount);
ReactDOM.render(<Foo content={content} />, mount);

