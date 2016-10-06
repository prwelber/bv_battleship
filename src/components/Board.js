import React, { Component } from 'react'
import { render } from 'react-dom'
import Square from './Square';
var $ = require ('jquery')

class Board extends Component {

  state = {
    reset: false,
    playerHitCounter: 0,
    computerHitCounter: 0,
    computerHits: [],
  }

  getPlayerScore = () => {
    $.get('/api/getPlayerScore', (data) => {
      this.setState({playerHitCounter: data.playerHitCounter});
      if (data.playerHitCounter === 10) {
        alert('You are the winner!!!')
      }
    });
    this.isAWinner();
  }

  isAWinner = () => {
    console.log('hit counter', this.state.playerHitCounter, this.state.computerHitCounter)
    if (this.state.computerHitCounter === 10) {
      alert('Computer Wins!');
    }
  }

  updatePlayerShipLocation = (move) => {
    $.post('/api/playerShipLocation', {location: move}, (result) => {
      console.log(result)
      this.props.playerChoiceDone(result.count);
    });
  }

  computerMoveHit = (compMove) => {
    const hitsArr = this.state.computerHits;
    hitsArr.push(compMove);
    let counter = this.state.computerHitCounter;
    counter++;
    this.setState({computerHits: hitsArr, computerHitCounter: counter});
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({reset: newProps.reset, playerHitCounter: 0, computerHitCounter: 0, computerHits: []});
  }

  render() {
    var squares = [];
    var letters = 'abcde';
    for (let i = 0; i < 5; i++ ) {
    	for (let j = 0; j < 5; j++) {
        squares.push(<Square
          key={`${letters[j]}${i+1}`}
          id={`${letters[j]}${i+1}`}
          reset={this.state.reset}
          updateScore={this.getPlayerScore}
          playerChoice={this.props.playerChoice}
          updatePlayerShipLocation={this.updatePlayerShipLocation}
          handleComputerHit={this.computerMoveHit}
          checkForComputerHit={this.state.computerHits}
          />)
    	}
    }
    return (
      <div className='board-wrapper'>
      <h5>Player Score: {this.state.playerHitCounter} - Comp Score: {this.state.computerHitCounter}</h5>
        <div className='board-top-headings'>
          <div><span>A</span></div>
          <div><span>B</span></div>
          <div><span>C</span></div>
          <div><span>D</span></div>
          <div><span>E</span></div>
        </div>
        <div className='board-wrapper'>
          {squares}
        </div>
        <div className='board-side-headings'>
          <div><span>1</span></div>
          <div><span>2</span></div>
          <div><span>3</span></div>
          <div><span>4</span></div>
          <div><span>5</span></div>
        </div>
      </div>
    )
  }

}

export default Board;
