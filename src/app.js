import React, { Component } from 'react'
import { render } from 'react-dom';
import Board from './components/Board';
// import 'whatwg-fetch';
var $ = require ('jquery')

class App extends Component {
  state = {
    name: '',
    resetGame: false,
    playerChoice: false,
    beginGame: false
  }

  renderPlayerChoice() {
    if (this.state.playerChoice === true) {
      return (
        <p><strong>Please place 10 ships on the board to get started.</strong></p>
      )
    }
  }

  renderStartGame() {
    if (this.state.beginGame) {
      return (
        <div>
          <p><strong>OK, now let's play! Make a selection to fire a torpedo!</strong></p>
          <p><strong>The computer will return fire after. First to 10 wins!</strong></p>
        </div>
      )
    }
  }

  renderGuide() {
    return (
      <div>
        <p>Guide:</p>
        <span className='your-ship-location'>Your Ship Location </span>
        <span className='your-ship-hit'>Your destroyed ship </span>
        <span className='miss'>Miss </span>
        <span className='hit'>Hit</span>
      </div>
    )
  }

  playerChoiceDone = (count) => {
    if (count === 10) {
      this.setState({playerChoice: false, beginGame: true});
    }
  }

  handleInput = (e) => {
    this.setState({name: e.target.value})
  }

  newGame = () => {
    this.setState({resetGame: true, beginGame: false})
    $.get('/api/new', (result) => {
      console.log(result)
    });
    setTimeout(() => {
      this.setState({resetGame: false});
      this.setState({playerChoice: true});
    }, 500);
  }

  componentDidMount() {

  }

  render() {
    return(
      <div className="app">
        <input onChange={this.handleInput} value={this.state.name} placeholder='Enter your name'/>
        <p>Hello there, {this.state.name}. How about a friendly game of Battleship?</p>
        <p>Click the New Game button to begin.</p>
        <button onClick={this.newGame}>New Game</button>
        {this.renderPlayerChoice()}
        {this.renderStartGame()}
        {this.renderGuide()}
        <Board reset={this.state.resetGame} playerChoice={this.state.playerChoice} playerChoiceDone={this.playerChoiceDone}></Board>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
