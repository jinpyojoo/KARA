const Application = function () {
    this.tuner = new Tuner(this.a4);
};


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
    videoId: 'YZ6Adbmbpgc',  controls: '0', events: {
      'onReady': onPlayerReady,    'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
}

function onPlayerStateChange(event){
    if (event.data == 1){
        if (!trustInteraction){
            document.getElementById('barrier').style.display = "block"
            fetch('/nightdancer.json')
            .then((Response)=>Response.json())
            .then((data)=>{
                tempo = data
                mel = []
                tem = []
                Object.keys(tempo).forEach((timestamp)=>{
                    mel.push(tempo[timestamp])
                    tem.push(timestamp)
                })
            })
            player.playVideo()
            app.start()
        }
        trustInteraction = true
    }
    if (event.data == 0){
        musicStop = true
        document.getElementById('mel_status').style.display = "none"
        document.getElementById('barrier').style.background = "black"
        document.getElementById('barrier').style.opacity = "1"
        document.getElementById('status').innerHTML = "정확한 음 : "+success.length+"/"+mel.length+"<br>부정확한 음 : "+(mel.length - success.length)+"/"+mel.length+"<br>타이밍 놓친 음 : "+slient.length
    }
}

step = 0
_t = 0
failure = []
success = []
slient = []

Application.prototype.start = function () {
    const self = this;
    this.tuner.onNoteDetected = function (note) {
      self.update(note);
    };
    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
    // timer
    setInterval(()=>{
        if (step - 1 >= 0){
            if (failure.indexOf(step-1) == -1 && success.indexOf(step-1) == -1 && slient.indexOf(step-1) == -1){
                slient.push(step-1)
            }
        }
        if (Math.abs(player.getCurrentTime() - tem[step]) < 0.04){
            _t = 1
            step++;
        } else {
            _t = 0
        }
    }, 10)
};

tempo = {}
mel = []

  Application.prototype.update = function (note) {
    
    document.getElementById('mel_status').innerHTML = "당신 : " + note['name']+"<br>멜로디 : " + mel[step]
    if (Math.abs(translate[mel[step]] - translate[note['name']]) <= 2){
        
        if (success.indexOf(step) == -1){
            document.getElementById('status').innerHTML = "O"
            document.getElementById('status').className = "clear_animation"
            success.push(step)
        }
    } else {
        if (failure.indexOf(step) == -1){
            document.getElementById('status').innerHTML = "X"
            document.getElementById('status').className = "fail_animation"
            failure.push(step)

        }
    }
  };

const app = new Application()

trustInteraction = false
