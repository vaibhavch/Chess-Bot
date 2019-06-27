loadScript('js/inject.js', function(){
  console.log('loaded inject.js');
});

chrome.runtime.onMessage.addListener(function(results) {  // extension -> content-script listener
  if (results.type === 'make_move') {  
      console.log("Best Move:"+ results.text)
      //history.pushState(null, null, '#'+results.text);

      var fitem = document.getElementById('mysquare1');
      if (typeof(fitem) != 'undefined' && fitem != null)
      {
          fitem.parentNode.removeChild(fitem);
      }
      var titem = document.getElementById('mysquare2');
      if (typeof(titem) != 'undefined' && titem != null)
      {
          titem.parentNode.removeChild(titem);
      }

      conv =  moveToUCI(results.text);
      from = conv.substr(0, 4);
      to = conv.substr(4, 4);

      var fromdiv = document.createElement("div");
      fromdiv.style.backgroundColor='red';
      fromdiv.setAttribute('id', 'mysquare1')
      fromdiv.setAttribute('class', 'square square-'+from);
      document.getElementById("game-board").appendChild(fromdiv);

      var todiv = document.createElement("div");
      todiv.style.backgroundColor='green';
      todiv.setAttribute('id', 'mysquare2');
      todiv.setAttribute('class', 'square square-'+to);
      document.getElementById("game-board").appendChild(todiv);
}
});

function moveToUCI(moveString) {
  //console.log(moveString)
  var uciString = "";
  fmoveMap = {"a": "01","b": "02", "c": "03", "d": "04", "e": "05", "f": "06", "g": "07", "h": "08"};
  tmoveMap = {"1": "01","2": "02", "3": "03", "4": "04", "5": "05", "6": "06", "7": "07", "8": "08"};
    var from = fmoveMap[moveString.substr(0, 1)];
    var to = tmoveMap[moveString.substr(1, 1)];
    var fromo = fmoveMap[moveString.substr(2, 1)];
    var too = tmoveMap[moveString.substr(3, 1)];
    uciString += from + to + fromo + too;

  return uciString;
}


window.addEventListener('message', function(event) {  // inject.js -> content-script listener
  if (event.data.type === 'game_stat') {
    var game_stat = (event.data.text === 'starting') ? true : false;
    chrome.runtime.sendMessage({ type: 'game_stat', text: game_stat },
                              function(response) {
                                });
    console.log("started or ended game");
    //answer.innerHTML = "...";

  }
  if (event.source !== window || event.data.type !== 'made_move') {  // only messages from same frame
    return;
  }
  var message = event.data.text;
  console.log("received move:" + message)
  chrome.runtime.sendMessage({ type: 'made_move', text: message },
                              function(response) {
                                  console.log(response.text);
                                }); 
  console.log("sent move to extension");
  //send it to background.js
});

function loadScript(scriptName, callback) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(scriptName);
    script.addEventListener('load', callback, false);
    (document.head || document.documentElement).appendChild(script);
}