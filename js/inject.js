window.addEventListener('message', function(event) {
    if (event.data.type !== 'make_move') {
      return;
    }
    console.log('page javascript got message:', event.data.text);
});

function isEven(n) {
   return n % 2 == 0;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}



(function() {

   strings = "";
   ccount = 0

   if(location.hostname == "www.chess.com" & location.pathname == "/live"){

      
       window.setInterval(function(){

        count = document.getElementsByClassName("move-text-component").length
         
         if ( count >  ccount) {
                 
                 num = document.getElementsByClassName("number")[0].innerText

                 from = document.getElementById("game-board").children[0].className.replace(/[^0-9]/g,'')
                 to =  document.getElementById("game-board").children[1].className.replace(/[^0-9]/g,'')
                 strings = strings + from + to
                 var uciString = MystringToUCI(strings);
                 //console.log(uciString)
                 ccount = count

                 elength = strings.match(/.{8}/g).length;
                 even = isEven(elength)
                 odd = isOdd(elength)

                 if(num == "8" & even ) {
                   
                   window.postMessage({ type: 'made_move',
                         text: uciString},
                       '*');

                 }
                 
                 if(num == "1" & odd ) {
                   
                   window.postMessage({ type: 'made_move',
                         text: uciString},
                       '*');
                   
                 }
                 
           }



        }, 1000);
    }

  })();



function MystringToUCI(moveString) {
  //console.log(moveString)
  var uciString = "";
  fmoveMap = {"01": "a","02": "b", "03": "c", "04": "d", "05": "e", "06": "f", "07": "g", "08": "h"};
  tmoveMap = {"01": "1","02": "2", "03": "3", "04": "4", "05": "5", "06": "6", "07": "7", "08": "8"};
  for(var i = 0; i < moveString.length; i+=8) {
    var from = fmoveMap[moveString.substr(i, 2)];
    var fromo = tmoveMap[moveString.substr(i+2, 2)];
    var to = fmoveMap[moveString.substr(i+4, 2)];
    var too = tmoveMap[moveString.substr(i+6, 2)];
    uciString += from + fromo + to + too;
  }
  return uciString;
}
