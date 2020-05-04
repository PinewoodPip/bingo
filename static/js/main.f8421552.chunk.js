(this.webpackJsonpbingo=this.webpackJsonpbingo||[]).push([[0],{11:function(e,t,n){e.exports=n(19)},16:function(e,t,n){},17:function(e,t,n){},19:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(9),o=n.n(r),l=(n(16),n(2)),s=n(3),c=n(5),u=n(4),h=(n(17),n(1)),d=n.n(h),f=n(10),v=n.n(f);function p(e){return JSON.stringify(e)}function m(e){var t,n,a;for(a=e.length-1;a>0;a--)t=Math.floor(Math.random()*(a+1)),n=e[a],e[a]=e[t],e[t]=n;return e}Array.prototype.random=function(){return this[Math.floor(Math.random()*this.length)]},String.prototype.format=function(){var e=arguments;return this.replace(/\{(\d+)\}/g,(function(t,n){return e[n]}))};var k=function(e){Object(c.a)(n,e);var t=Object(u.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){var e=this,t=this.props.clicked?"tile-bg-clicked":"tile-bg";return i.a.createElement("div",{className:"tile "+t,onClick:function(){return e.props.onClick()},onContextMenu:function(t){t.preventDefault(),e.props.onRightClick()}},i.a.createElement("p",null,this.props.text))}}]),n}(i.a.Component),g=function(e){Object(c.a)(n,e);var t=Object(u.a)(n);function n(e){return Object(l.a)(this,n),t.call(this,e)}return Object(s.a)(n,[{key:"render",value:function(){var e=this;return i.a.createElement("textarea",{className:"text-field",type:"text",onChange:function(t){return e.props.onChange(t)},id:"word_pool",placeholder:"Enter words here to create randomized boards from a word list! Separate words with a new line."})}}]),n}(i.a.Component),b=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).version="v0.1.1",n.hasSeenWordListWarning=!1,n.veryBigSize=10,n.defaultSize=3,n.template={clicked:!1,text:"Right-click to change text"},n.state={wordList:"",title:"Pinewood Bingo App {0} - Click to edit title".format(n.version),size:n.defaultSize,tiles:Array(Math.pow(n.defaultSize,2)).fill(n.template)},n}return Object(s.a)(a,[{key:"saveWordList",value:function(){var e=this.state.wordList,t=n(8),a=new Blob([e],{type:"text/plain;charset=utf-8"});t.saveAs(a,"word_list.txt")}},{key:"updateWordList",value:function(e){this.setState({wordList:e.target.value})}},{key:"changeTitle",value:function(){var e=prompt("Enter a title for the board:");null!=e&&""!=e&&this.setState({title:e})}},{key:"getTotalTiles",value:function(){return Math.pow(this.state.size,2)}},{key:"resetClickedTiles",value:function(){for(var e=this.state.tiles.slice(),t=0;t<e.length;t++)e[t]={clicked:!1,text:e[t].text};this.setState({size:this.state.size,tiles:e})}},{key:"randomizeFromWordPool",value:function(){var e=this.state.wordList.split(/\r\n|\r|\n/),t=this.state.tiles.slice();if(""!=e[0]){""==e[e.length-1]&&e.pop(),e.length<this.getTotalTiles()&&!this.hasSeenWordListWarning&&(this.hasSeenWordListWarning=!0,alert("Warning:\nThe word list has fewer words than tiles in the board.")),e=m(e);for(var n=0;n<this.getTotalTiles();n++)t[n]={clicked:!1,text:v.a.sample(e)};this.setState({size:this.state.size,tiles:t})}}},{key:"randomizeTileOrder",value:function(){this.setState({size:this.state.size,tiles:m(this.state.tiles)})}},{key:"saveBoard",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"toFile",t=p(this.state);if("toFile"==e){var a=n(8),i=new Blob([t],{type:"text/plain;charset=utf-8"});a.saveAs(i,"board.txt")}else if("toText"==e){var r=window.open("");r.document.write(t)}}},{key:"loadBoard",value:function(){var e,t=prompt("Paste in a saved board.\nThis function has no error handling so don't try stupid shit.");null!=t&&this.setState((e=t,JSON.parse(e)))}},{key:"changeSize",value:function(){var e=parseInt(prompt("Enter new size for the board:"));null==e||""==e||e<1?alert("Invalid size; don't be stupid"):e>this.veryBigSize&&!window.confirm("You're creating a very large board ("+e+"x"+e+").\nAre you sure you want to do that?")||this.setState({size:e,tiles:Array(Math.pow(e,2)).fill(this.template)})}},{key:"renderTile",value:function(e){var t=this,n=this.state.tiles[e];return i.a.createElement(k,{clicked:n.clicked,text:n.text,onClick:function(){return t.handleClick(e)},onRightClick:function(){return t.handleRightClick(e)}})}},{key:"handleRightClick",value:function(e){var t=this.state.tiles.slice(),n=prompt("Enter text for this tile:");null!=n&&""!=n&&(""==d()("#word_pool").val()?d()("#word_pool").val(d()("#word_pool").val()+n):d()("#word_pool").val(d()("#word_pool").val()+"\n"+n),t[e]={clicked:t[e].clicked,text:n},this.setState({size:this.state.size,tiles:t}))}},{key:"handleClick",value:function(e){var t=this.state.tiles.slice();t[e]={clicked:!t[e].clicked,text:t[e].text},this.setState({size:this.state.size,tiles:t})}},{key:"render",value:function(){for(var e=this,t=[],n=[],a=0;a<Math.pow(this.state.size,2);a++)t.push(i.a.createElement("th",{key:a},this.renderTile(a)));for(var r=0,o=0;o<this.state.size;o++){for(var l=[],s=0;s<this.state.size;s++)l.push(t[r]),r++;n.push(i.a.createElement("tr",{key:o},l))}return i.a.createElement("div",{className:"flex-main"},i.a.createElement("div",null,i.a.createElement("h1",{onClick:function(){return e.changeTitle()}},this.state.title),i.a.createElement("table",{className:"tile-holder"},i.a.createElement("tbody",null,n))),i.a.createElement("div",{className:"right-panel"},i.a.createElement(g,{onChange:function(t){return e.updateWordList(t)}}),i.a.createElement("div",{className:"button-bar"},i.a.createElement("button",{className:"large-button",onClick:function(){return e.randomizeFromWordPool()}},"Generate Board from Word List"),i.a.createElement("button",{onClick:function(){return e.changeSize()}},"Change Size"),i.a.createElement("button",{onClick:function(){return e.randomizeTileOrder()}},"Shuffle Tiles"),i.a.createElement("button",{onClick:function(){return e.saveBoard()}},"Save Board"),i.a.createElement("button",{onClick:function(){return e.loadBoard()}},"Load Board"),i.a.createElement("button",{onClick:function(){return e.saveWordList()}},"Save Word List"))))}}]),a}(i.a.Component),w=function(e){Object(c.a)(n,e);var t=Object(u.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{className:"flex-center-column"},i.a.createElement(b,null))}}]),n}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[11,1,2]]]);
//# sourceMappingURL=main.f8421552.chunk.js.map