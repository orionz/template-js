let React       = require('react');

class Terminal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props};
  }

  log(msg) {
    this.setState({...this.state, content: this.state.content + "\n" + msg})
  }

  render() {
    return (<pre className="foo">{this.state.content}</pre>);
  }
}

module.exports = {Terminal: Terminal};
