const Application = function () {
    this.tuner = new Tuner(this.a4);
};


translate = {
    'A': 9,'A♯': 10,'B': 11,'C': 0,'C♯': 1,'D': 2,'D♯': 3,'E': 4,'F': 5,'F♯': 6,'G': 7,'G♯': 8
}

played = false

setTimeout(()=>{
    document.getElementById('loading').style.opacity = "0"
    document.getElementById('main-menu').style.display = "block"
}, 2000)

function run(){
    document.getElementById('ready-menu').style.display = "none"
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var player;
}
url = ""
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: url,     playerVars: {'controls': 0 }, events: {
      'onReady': onPlayerReady,    'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
    player.playVideo()
    app.start()
}

load_music = (data)=>{
    try{
        data = JSON.parse(data)
        url = data['id']
        tempo = data['tempo']
        mel = []
        tem = []
        Object.keys(tempo).forEach((timestamp)=>{
            mel.push(tempo[timestamp])
            tem.push(timestamp)
        })
        document.getElementById('main-menu').style.display = "none"
        document.getElementById('ready-menu').style.display = "block"
        document.addEventListener('click',()=>{
            if (!played){
                played = true
                run()
            }
        })
    } catch(e) {
        alert("손상된 KARA파일 입니다.")
    }
    
}

function onPlayerStateChange(event){
    if (event.data == 1){
        if (!trustInteraction){
            document.getElementById('barrier').style.display = "block"
        }
        trustInteraction = true
    }
    if (event.data == 0){
        musicStop = true
        document.getElementById('barrier').style.background = "black"
        document.getElementById('barrier').style.opacity = "1"
        document.getElementById('status').innerHTML = "정확한 음 : "+success.length+"/"+mel.length+"<br>부정확한 음 : "+(mel.length - success.length)+"/"+mel.length+"<br>타이밍 놓친 음 : "+slient.length+"<br><p onclick='location.reload()'>다시 고르기</p>"
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
        if (Math.abs(translate[mel[step]] - translate[note['name']]) <= 2){
        
        if (success.indexOf(step) == -1){
            document.getElementById('status').innerHTML = "O"
            document.getElementById('status').className = "clear_animation"
            success.push(step)
        }
    } else {
        if (failure.indexOf(step) == -1){
            if (translate[mel[step]] < translate[note['name']]){
                document.getElementById('status').innerHTML = "HIGH"
            } else {
                document.getElementById('status').innerHTML = "LOW"
            }
            document.getElementById('status').className = "fail_animation"
            failure.push(step)

        }
    }
  };

const app = new Application()

trustInteraction = false
