translate = {
    'A': 9,'A♯': 10,'B': 11,'C': 0,'C♯': 1,'D': 2,'D♯': 3,'E': 4,'F': 5,'F♯': 6,'G': 7,'G♯': 8
}
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: 'kagoEGKHZvU',  events: {
      'onReady': onPlayerReady,    'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
}

musicStop = false
function onPlayerStateChange(event){
    if (event.data == 0){
        musicStop = true
        console.log(timestamp)
    }
}




_temp = {}
Object.keys(translate).forEach((keyStr)=>{
    _temp[translate[keyStr]] = keyStr
})

translate = _temp

timestamp = {}

navigator.requestMIDIAccess().then((midiAccess) => {
    Array.from(midiAccess.inputs).forEach((input) => {
      input[1].onmidimessage = (msg) => {
        if (msg.data[0] == 144 && !musicStop){
            console.log(player.getCurrentTime(), translate[msg.data[1]%12]);
            timestamp[player.getCurrentTime()] = translate[msg.data[1]%12];
        }
      };
    });
  });