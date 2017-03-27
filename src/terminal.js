let React       = require('react');

class Terminal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props};
  }

  log(msg) {
    console.log("LOG: " + msg);
    this.setState({...this.state, content: [...this.state.content, msg]})
  }

  render() {
    return (<pre className="foo">{this.state.content.slice(-20).join("\n")}</pre>);
  }
}

module.exports = {Terminal: Terminal};
