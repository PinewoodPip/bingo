import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from "jquery";
import _ from 'lodash'

function stringify(data) {
  return JSON.stringify(data);
}

function unstringify(data) {
  return JSON.parse(data);
}

function save(key, content) {
  localStorage.setItem(key, content);
}

function load(key) {
  return localStorage.getItem(key);
}

// from https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

function shuffle(a) { // by https://stackoverflow.com/users/353278/jeff
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

String.prototype.format = function () { // by gpvos from stackoverflow
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        clicked: false,
    }
  }

  render() {
    var bg = this.props.clicked ? "tile-bg-clicked" : "tile-bg";
    return (
      <div className={"tile " + bg} onClick={() => this.props.onClick()} onContextMenu={(event) => {event.preventDefault(); this.props.onRightClick();}}>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.veryBigSize = 10;
    this.defaultSize = 3;
    this.template = {
      clicked: false,
      text: "Right-click to change text",
    }

    this.state = {
        size: this.defaultSize,
        tiles: Array(Math.pow(this.defaultSize, 2)).fill(this.template),
    }
  }

  getTotalTiles() {
    return Math.pow(this.state.size, 2)
  }

  resetClickedTiles() {
    const tiles = this.state.tiles.slice();
    for (var x = 0; x < tiles.length; x++) {
      tiles[x] = {
        clicked: false,
        text: tiles[x].text,
      }
    }
    this.setState({
      size: this.state.size,
      tiles: tiles,
    })
  }

  randomizeFromWordPool() { // todo remove empty lines
    var pool = $("#word_pool").val();
    var words = pool.split(/\r\n|\r|\n/)
    const tiles = this.state.tiles.slice();
    
    if (words[0] == "")
      return;
    if (words[words.length-1] == "")
      words.pop();
    if (words.length < this.getTotalTiles())
      alert("Warning:\nThe word list has fewer words than tiles in the board.")

    words = shuffle(words);

    for (var x = 0; x < this.getTotalTiles(); x++) {
      tiles[x] = {
        clicked: false,
        text: _.sample(words),
      };
    }

    this.setState({
      size: this.state.size,
      tiles: tiles,
    })

    //this.resetClickedTiles();
  }

  randomizeTileOrder() {
    this.setState({
      size: this.state.size,
      tiles: shuffle(this.state.tiles),
    })
  }

  saveBoard() {
    var save = stringify(this.state);

    var newWindow = window.open("");
    newWindow.document.write(save);
  }

  loadBoard() {
    var newData = prompt("Paste in a saved board.\nThis function has no error handling so don't try stupid shit.")

    if (newData == null)
      return;

    this.setState(unstringify(newData))
  }

  changeSize() {
    var newSize = parseInt(prompt("Enter new size for the board:"))

    if (newSize == null || newSize == "" || newSize < 1) {
      alert("Invalid size; don't be stupid")
      return;
    }
    else if (newSize > this.veryBigSize) {
      if (!window.confirm("You're creating a very large board (" + newSize + "x" + newSize +").\nAre you sure you want to do that?"))
        return;
    }

    this.setState({
      size: newSize,
      tiles: Array(Math.pow(newSize, 2)).fill(this.template),
    })
  }

  renderTile(i) {
    const tile = this.state.tiles[i];
    return (<Tile
      clicked={tile.clicked}
      text={tile.text}
      onClick={() => this.handleClick(i)}
      onRightClick={() => this.handleRightClick(i)}
      />
    )
  }

  handleRightClick(i) {
    const tiles = this.state.tiles.slice();
    var input = prompt("Enter text for this tile:");

    if (input == null || input == "")
      return;

    console.log($("#word_pool").val())

    // todo check for duplicates
    if ($("#word_pool").val() == "")
      $("#word_pool").val($("#word_pool").val() + input)
    else
      $("#word_pool").val($("#word_pool").val() + "\n" + input)

    tiles[i] = {
      clicked: tiles[i].clicked,
      text: input,
    };

    this.setState({
      size: this.state.size,
      tiles: tiles,
    })
  }

  handleClick(i) {
    const tiles = this.state.tiles.slice();

    tiles[i] = {
      clicked: !tiles[i].clicked,
      text: tiles[i].text,
    };

    this.setState({
      size: this.state.size,
      tiles: tiles,
    })
  }

  render() {
    const items = [];
    const tbodies = [];
    for (var x = 0; x < Math.pow(this.state.size, 2); x++) {
      items.push(
        <th key={x}>{this.renderTile(x)}</th>
      )
    }

    var index = 0;
    for (var y = 0; y < this.state.size; y++) {
      const row = []
      for (var z = 0; z < this.state.size; z++) {
        row.push(items[index]);
        index++;
      }
      tbodies.push(
        <tr key={y}>{row}</tr>
      )
    }

    return (
      <div>
        <table className="tile-holder">
          <tbody>
            {tbodies}
          </tbody>
        </table>
        <div className="bottom-bar">
          <button onClick={() => this.changeSize()}>Change Size</button>
          <button onClick={() => this.saveBoard()}>Save Board</button>
          <button onClick={() => this.loadBoard()}>Load Board</button>
          <button onClick={() => this.randomizeTileOrder()}>Shuffle Tiles</button>
          <button onClick={() => this.randomizeFromWordPool()}>Generate Board from Word List</button>
        </div>
        <div>
          <textarea className="text-field" type="text" id="word_pool" placeholder="Enter words here to create randomized boards from a word list! Separate words with a new line."/>
        </div>
      </div>
    )
  }
}

class App extends React.Component {

  render() {
    return (
      <div className="flex-center-column">
        <h1>Pinewood Bingo App</h1>
        <Board/>
      </div>
    );
  }
}

export default App;
