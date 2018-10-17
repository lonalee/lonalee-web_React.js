import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './queries.css';

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
  console.log('in Square',props);

  return (
    <button className="square" onClick={props.onClick}>
    { props.value }
    </button>
  );
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {    // 상태 관리에 필요한 객체 (state 자체는 property) -- 9개의 인덱스를 갖는 배열(O,X,null 관리), turn을 보장하기 위한 boolean value를 갖는 프로퍼티
  //     squares: Array(9).fill(null),   //  handleClick 메소드에서 squaresV 배열이 X, O 순서를 저장해서 setState로 업데이트 해준다
  //     xIsNext: true
  //   };
  // }

  renderSquare(i) {     // renderSquare가 호출될 때 전달된 인수 0~8이 value 속성으로 저장, 그리고 handleClick 메소드로 인자를 전달
    console.log('works?', i);
    return <Square value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)} />;
  }
  // 위 코드로 Square 클래스에 value, onClick 프로퍼티가 생성되었고 Square 클래스에서는 props라는 객체로 접근한다.

  render() {
    return (
      <div>
        <div className="board-row">
          {/* {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)} */}
          {this.props.squares.forEach((square, i) => {
            this.renderSquare(i);
          })}
        </div>
        <div className="board-row">
          {/* {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)} */}
        </div>
        <div className="board-row">
          {/* {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)} */}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props); // 컨스트럭터를 사용할 때는 항상 super 메소드를 호출해야 함
    this.state = {
      history: [{
        squares: Array(9).fill(null),    // 최초의 squares에는 null로 채워져 있다.
      }],
      xIsNext: true,
      stepNumber: 0,
      coordinate: [{col: 0, row: 0}],
    };
  }

  render() {
    const history = this.state.history;
    // current(객체)가 누적되는 배열,
    // const current = history[history.length - 1];
    const current = history[this.state.stepNumber]
    // current ------> 매 turn마다 생성되는 배열, 여기에 현재까지 마크된 값이 들어있음, length - 1을 해야 현재 index를 참조할 수 있다

    const winner = calculateWinner(current.squares);
    const coordi = this.state.coordinate;
    // console.log('current', current);
    // console.log('history, coordi', history, coordi);

    const moves = history.map((step, move) => {       // step, move(jump할 곳을 나타내는 인자),_______moves에는 새로운 배열
      // console.log(step, coordi[move].col, coordi[move].row);
      const desc = move ?
      `Go to move # ${move} Column ${coordi[move].col} Row ${coordi[move].row}` :
      'Go to game start';
      // const afterJumpto = 'active';
      let className = 'test';

      return (
        <li key={move} >
          <button className={className} onClick={() => this.jumpTo(move, className)}>{desc}</button>
        </li>
      );
    });

    // console.log('moves',moves);
    // const findButton = moves.map(() => {
    // })

    let status;
    if (winner) {
      status = 'Winner is ' + winner;
    } else {
      status = 'Next Player is ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );

  }
  jumpTo(move, name) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0
    });
  };
    // ------------------- Board --------------> Game Component ---------------------
    handleClick(i) {      // 클릭된 square의 value를 인자로 받음
    console.log('square clicked', i);
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      // console.log('stepNumber', this.state.stepNumber);
      // console.log('history in handleClick',history); // 메소드 내의 history는
      //  ----------- 전체 배열, 처음(0)부터
      const current = history[history.length - 1];  // current에 squares가 객체로 할당된다.
      const squaresV = current.squares.slice();   // 현재 squares의 복사본을 할당
      // const squaresV = this.state.squares.slice();   // state 관리, history 유지를 위해서 복사본 생성
      // squares[i] = 'X';  무조건 X만 표시됐었다!
      // console.log(squaresV);
      let coordinate = this.state.coordinate;
      if (calculateWinner(squaresV) || squaresV[i]) {
        // calculateWinner 함수의 실행결과가 true(승리)이거나 클릭된 square가 true
        return;
      }
      // squaresV[i] = this.state.xIsNext ? {turn: 'X'} : {turn: 'O'};
      squaresV[i] = this.state.xIsNext ? 'X' : 'O';

      const coordinator = (c, i) => {
        let row = Math.floor(i / 3);    // row 구하기
        let col = i % 3;    // col 구하기
        coordinate = c.concat({col: col, row: row});
        // console.log('coordinate', coordinate);
      }

      if (i < 3) {  //  row: 0 일 경우
        coordinator(coordinate, i);
      }
      else if (3 < i < 6) {
        coordinator(coordinate, i);
      }
      else if (6 < i < 9) {
        coordinator(coordinate, i);
      }

      this.setState({   // click 된 스퀘어에 대해서 처리 후 state를 update
        // squares: squaresV,      //  전자는 state의 프로퍼티인 squares, 후자는 handleClick의 지역변수
        history: history.concat([
          {squares: squaresV}
        ]),
        //  push와 달리 concat은 원본 배열을 수정하지 않는다. 그래서 current의 복사본이 squares 프로퍼티에 할당되고 concat으로 누적된다.
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        coordinate: coordinate
       });
    };

}

// ************** function calculateWinner (functional Component)********************
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


// **************************************** my-trial **************************************

class Mytrial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      content: ''
    };
    this.handleChange = this.handleChange.bind(this); // ???
    this.handleSubmit = this.handleSubmit.bind(this); // ???
    this.getContents = this.getContents.bind(this);
  }
  render() {
    return (
      <div className="wrapper">
        <form onSubmit={this.handleSubmit}>
          <label>What have you learned</label>
          <input className="input-box"
          onChange={this.handleChange}></input>
          <button>Let me know</button>
        </form>
        <LessonList list={this.state.list} />
        <Getcontents onClick={this.getContents
        } />
      </div>
    );
  };
  handleChange(e) {
    this.setState({ content: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    // 이 구문이 없으면 자동으로 전체 view를 re-rendering 하였다
    // 이유는? 기본적으로 form에서 onSubmit()을 통해 submit 하면 이벤트 완료 후 refresh, SPA에서는 지양해야할 부분. 그래서 event.preventDefault() 를 활용하여 추가로 이벤트를 전파하지 않고 취소 가능 -> 다시 말해 submit 되지만 re-rendering은 취소시킴
    const item = {
      content: this.state.content,
      id: Date.now()
    }
    console.log(item, this.state.list);
    this.setState(state => ({
      list: state.list.concat(item),
      content: ''
    }));
  };
  getContents() {
    console.log('clicked');
  }
}

class LessonList extends React.Component {
  render() {
  return(
    <ul className="list">
      {this.props.list.map(list => (
        <li className="content" key={list.id}>{list.content}</li>
      ))}
    </ul>
  );
  };
};

class Getcontents extends React.Component {
  getContents() {
    console.log('clicked');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/contents');
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) console.log(xhr.response);
        else console.log(xhr.status);
      }
    }
  }
  render () {
    return (
      <div>
      <button className="getMeContents" onClick={() => {
        this.getContents();
      }}>Get Me contents</button>
      </div>
    )
  }
}

// ========================================ReactDOM.ender()=====================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

ReactDOM.render(
  <Mytrial />,
  document.getElementById('mytrial')
);
