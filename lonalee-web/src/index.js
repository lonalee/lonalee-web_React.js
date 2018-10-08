import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// **********------------- class를 functional component로 전환 ------------------***************
// class Square extends React.Component {
//   constructor(props) {
//     super();
//     //In JavaScript classes, you need to always call super when defining the constructor of a subclass. All React component classes that have a constructor should start it with a super(props) call.
//     this.state = {
//       value: null
//     };
//   }
//   render() {
//     return (
//       <button className="square"
//       onClick={ () => { this.props.onClick()}}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    { props.value }
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {    // 상태 관리에 필요한 객체 (state 자체는 property) -- 9개의 인덱스를 갖는 배열(O,X,null 관리), 순서를 보장하기 위한 boolean value를 갖는 프로퍼티
      squares: Array(9).fill(null),   //  handleClick 메소드에서 squaresV 배열이 X, O 순서를 저장해서 setState로 업데이트 해준다
      xIsNext: true
    };
  }

  handleClick(i) {      // 클릭된 square의 value를 인자로 받음
    const squaresV = this.state.squares.slice();     // state 관리, history 유지를 위해서 복사본 생성
    // squares[i] = 'X';  무조건 X만 표시됐었다!
    if (calculateWinner(squaresV) || squaresV[i]) {
      return;
    }
    squaresV[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      squares: squaresV,      //  전자는 state의 프로퍼티인 squares, 후자는 handleClick의 지역변수
      xIsNext: !this.state.xIsNext
     })
  }

  renderSquare(i) {     // renderSquare가 호출될 때 전달된 인수 0~8이 value 속성으로 저장, 그리고 handleClick 메소드로 인자를 전달
    return <Square value={this.state.squares[i]}
    onClick={() => this.handleClick(i)} />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner is ' + winner;
    }
    else if ((this.state.squares.indexOf(null)) === -1) {
      status = 'DRAW';
    }
    else {
      status = 'Next Player is ' + (this.state.xIsNext ? 'X' : 'O');
    }
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length ; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { // 3개가 같은지 판단
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
