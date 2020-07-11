import React from 'react'; // todo merge wordlist with board info into 1 save
import './App.css'; // todo fix resizing tiles
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
  render() {
    var bg = this.props.clicked ? "tile-bg-clicked" : "tile-bg";

    var realText = this.props.useNumbers ? this.props.number : this.props.text;
    var realText = this.props.freeSpace ? "Free space!" : realText;

    // if number mode is on, use bigger text size
    var largeText = (this.props.useNumbers) ? "large-text" : "";

    return (
      <div className={"tile " + bg} onClick={() => this.props.onClick()} onContextMenu={(event) => {event.preventDefault(); this.props.onRightClick();}}>
        <p className={largeText}>{realText}</p>
      </div>
    );
  }
}

class TextBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <textarea className="text-field" type="text" onChange={(e) => this.props.onChange(e)} id="word_pool" placeholder="Enter words here to create randomized boards from a word list! Separate words with a new line."/>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.version = "v0.1.3";
    this.veryBigSize = 10;
    this.defaultSize = 3;
    this.template = {
      clicked: false,
      text: "Right-click to change text",
      number: null,
    }

    this.state = {
        wordList: "",
        //title: "Pinewood Bingo App {0} - Click to edit title".format(this.version),
        title: "Pinewood Bingo App - Click to edit title",
        size: this.defaultSize,
        freeSpace: false,
        useNumbers: false,
        minNumber: 1,
        maxNumber: 100,
        tiles: Array(Math.pow(this.defaultSize, 2)).fill(this.template),
    }
  }

  // total tiles
  get totalTiles() {
    return Math.pow(this.state.size, 2);
  }

  saveWordList() {
    var save = this.state.wordList;

    var FileSaver = require('file-saver');
    var blob = new Blob([save], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "word_list.txt");
  }

  updateWordList(e) {
    this.setState({
      wordList: e.target.value,
    })
  }

  changeTitle() { // todo make the area a set size, so you can fix the title if you input ' '
    var title = prompt("Enter a title for the board:");

    if (title == null || title == "") {
      return;
    }

    this.setState({
      title: title,
    })
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
    var pool = this.state.wordList;
    var words = pool.split(/\r\n|\r|\n/)
    const tiles = this.state.tiles.slice();
    
    if (words[0] == "")
      return;
    if (words[words.length-1] == "")
      words.pop();
    if (words.length < this.getTotalTiles() && !this.hasSeenWordListWarning) {
      alert("The word list has fewer words than tiles in the board.")
      return;
    }

    words = shuffle(words);

    for (var x = 0; x < this.getTotalTiles(); x++) {
      var word = _.sample(words)
      tiles[x] = {
        clicked: false,
        text: word,
      };
      words = words.filter(function(value) {return value != word});
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

  saveBoard(mode="toFile") { // todo add option to use toText
    var save = stringify(this.state);

    if (mode == "toFile") {
      var FileSaver = require('file-saver');
      var blob = new Blob([save], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "board.txt");
    }
    else if (mode == "toText") {
      var newWindow = window.open("");
      newWindow.document.write(save);
    }
  }

  async loadBoard(e) {
    if ($("#file_loader").prop("files").length > 0) {
      var file = $("#file_loader").prop("files")[0];
      var reader = new FileReader();
      var text = await file.text();
      this.setState(unstringify(text));

      // ideally these would be components as well but laziness
      $("#word_pool").val(this.state.wordList);
      $("#button_free_space").prop("checked", this.state.freeSpace);
      $("#button_use_numbers").prop("checked", this.state.useNumbers);
      $("#button_min_number").val(this.state.minNumber);
      $("#button_max_number").val(this.state.maxNumber);
    }
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
    //var text = tile.text;
    var freeSpace = false;

    if (Math.floor((Math.pow(this.state.size, 2)) / 2) == i && this.state.freeSpace && this.state.size % 2 != 0)
      freeSpace = true;
      // text = "Free Space!";
    // else
    //   text = tile.text;

    return (<Tile
      clicked={tile.clicked}
      freeSpace = {freeSpace}
      useNumbers={this.state.useNumbers}
      number={tile.number}
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
      number: tiles[i].number,
    };

    this.setState({
      size: this.state.size,
      tiles: tiles,
    })
  }

  randomizeNumbers(e) {
    const tiles = this.state.tiles.slice();
    var numbersUsed = [];

    // if e is defined that means this function fired from the Randomize Numbers button. Enables number mode if it wasn't already on
    if (!this.state.useNumbers && e != undefined) {
      this.toggleNumberMode(true);
      return;
    }

    // return if the number range is too small to generate a board without duplicates
    if (this.state.maxNumber - this.state.minNumber + 1 < this.totalTiles) {
      alert("The number range is too small for the amount of tiles in the current board.")
      return;
    }

    for (var x = 0; x < this.totalTiles; x++) {
      var num;
      
      // we have to make sure numbers do not repeat
      while (true) { // oh god no add a failsafe here asap
        num = _.random(this.state.minNumber, this.state.maxNumber)

        if (!numbersUsed.includes(num)) {
          numbersUsed.push(num);
          break;
        }
      }

      tiles[x] = {
        clicked: tiles[x].clicked,
        text: tiles[x].text,
        number: num
      }

      // CHANGING PROPERTIES LIKE THIS CAUSES A WEIRD PROBLEM WHERE EVERY TILE HAS THE SAME VALUE.
      //tiles[x].number = _.random(this.state.minNumber, this.state.maxNumber);
    }

    this.setState({
      tiles: tiles,
    })
  }

  toggleNumberMode(newState) {
    if (newState)
      this.randomizeNumbers();
    this.setState({useNumbers: newState})
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
      <div className="flex-main">
        <div>
          <h1 onClick={() => this.changeTitle()}>{this.state.title}</h1>
          <table className="tile-holder">
            <tbody>
              {tbodies}
            </tbody>
          </table>
        </div>
        <div className="right-panel">
          <TextBox onChange={(e) => this.updateWordList(e)}/>
          <div className="button-bar">
            <button className="large-button" onClick={() => this.randomizeFromWordPool()}>Generate Board from Word List</button>
            <button onClick={() => this.changeSize()}>Change Size</button>
            <button onClick={() => this.randomizeTileOrder()}>Shuffle Tiles</button>
            <button onClick={() => this.saveBoard()}>Save Board</button>
            <button onClick={() => $("#file_loader").click()}>Load Board</button>
            <input onChange={(e) => this.loadBoard(e)} className="hidden" type="file" accept=".txt" id="file_loader"></input>
            {/* <button onClick={() => this.saveWordList()}>Save Word List</button> */}
            <div className="checkbox">
              <input id="button_free_space" onChange={(e) => {this.setState({freeSpace: e.target.checked})}} className="" type="checkbox"></input>
              <p>Free Space</p>
            </div>
            <div className="checkbox">
              <input id="button_use_numbers" onChange={(e) => {this.toggleNumberMode(e.target.checked)}} className="" type="checkbox"></input>
              <p>Use Numbers</p>
            </div>
            <div className="checkbox">
              <p>Min:</p>
              <input id="button_min_number" onChange={(e) => {this.setState({minNumber: e.target.value})}} className="number-input" type="number" value={this.state.minNumber}></input>
            </div>
            <div className="checkbox">
              <p>Max:</p>
              <input id="button_max_number" onChange={(e) => {this.setState({maxNumber: e.target.value})}} className="number-input" type="number" value={this.state.maxNumber}></input>
            </div>
            <div className="centered-button">
            <button onClick={(e) => this.randomizeNumbers(e)}>Randomize Numbers</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {

  render() {
    return (
      <div className="flex-center-column">
        <Board/>
      </div>
    );
  }
}

export default App;
