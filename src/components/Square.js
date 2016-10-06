import React, { Component } from 'react'
import { render } from 'react-dom'
// import 'whatwg-fetch';
var $ = require ('jquery')

class Square extends Component {
  state = {
    color: 'white',
    hasPlayerBoat: false,
    border: null,
    id: this.props.id,
  }

  componentWillReceiveProps(newProps) {
    if (newProps.reset === true) {
      this.setState({color: 'white', hasPlayerBoat: false, border: '2px solid blue'});
    }
    if (newProps.checkForComputerHit.indexOf(this.state.id) >= 0) {
      this.setState({border: '2px dashed navy'});
    }
  }

  handleClick = (move) => {
    if (this.props.playerChoice === true) {
      this.setState({hasPlayerBoat: true, border: '2px dotted green'});
      this.props.updatePlayerShipLocation(move);
    } else {

      $.post('/api/playerMove', {square: move}, (data) => {
        console.log('RESULT FROM POST', data)
        if (data.computerMoveHit) {
          this.props.handleComputerHit(data.computerMove);
        }
        if (data.result === 'duplicate') {
          alert('You already tried that!');
          return;
        }
        if (data.result === 'hit') {
          this.setState({color: 'orangered'})
        } else {
          this.setState({color: 'lightgray'})
        }
        this.props.updateScore();
      });
    }
  }

  render() {
    var squareStyle = {
      backgroundColor: this.state.color,
      border: this.state.border,
    }

    return (
      <div style={squareStyle} className='square' id={this.props.id} onClick={() => this.handleClick(this.props.id)}>
      </div>
    )
  }
}

export default Square;
