
let React       = require('react');
let ReactDOM    = require("react-dom");

class Foo extends React.Component {
//const Foo = () => ({
  constructor(props) {
    super(props)
  }

  render() {
    return (<div className="foo"> {this.props.content} </div>);
    //return null;
  }
}

let content = "react initializing...";
let mount = document.getElementById("mount");
console.log("Mount node", mount);
ReactDOM.render(<Foo content={content} />, mount);

