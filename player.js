const Application = function () {
    this.tuner = new Tuner(this.a4);
};

window.history.pushState(null, '', location.href);

window.onpopstate = () => {
    history.go(1);
    this.handleGoback();
};

translate = {
    'A': 9, 'A♯': 10, 'B': 11, 'C': 0, 'C♯': 1, 'D': 2, 'D♯': 3, 'E': 4, 'F': 5, 'F♯': 6, 'G': 7, 'G♯': 8, 'X': -1
}

played = false

setTimeout(() => {
    document.getElementById('loading').style.opacity = "0"
    document.getElementById('main-menu').style.display = "grid"
    load_saved_musics()
}, 2000)
document.getElementById('grid-start').style.display = "none"

function run() {
    document.getElementById('ready-menu').style.display = "none"
    document.getElementById('player').style.display = "block"
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var player;
}
url = ""
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: url, playerVars: {
            'controls': 0,
            'rel': 0,
            'fs': 0,
            'disablekb': 1
        }, events: {
            'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange,
        }
    });
}
function onPlayerReady(event) {
}

title = ""
speed = 1.0
accuracy = 0.5

load_saved_musics = () => {
    var regex = /(<([^>]+)>)/ig
    list_element = document.getElementById('list-musics')
    list_element.innerHTML = ""
    musics = Object.keys(localStorage)
    musics.forEach((songName) => {
        elem = document.createElement('div')
        elem.textContent = songName.replace(regex, " ")
        elem.addEventListener('click', (e) => {
            console.log(e.target)
            try {
                load_music(localStorage.getItem(e.target.textContent))
            } catch (e) {
                load_music(localStorage.getITem(e.target.children[0].textContent))
            }
        })
        list_element.append(elem)
    })
}

save_music = (data) => {
    var regex = /(<([^>]+)>)/ig
    try {
        _data = data.split(';')
        __ = _data[0]
        _tempo = _data[3]
        __ = _tempo.split(',')
        __ = _data[1]
        __ = _data[2]
        bg = _data[3]
        localStorage.setItem(_data[1].replace(regex, " "), data)
        load_saved_musics()
    }
    catch (e) {
        console.log(e)
        alert("손상된 KARA파일 입니다.")
    }
}
load_music = (data) => {
    try {
        _data = data.split(';')
        url = _data[0]
        _tempo = _data[3]
        _tmplist = _tempo.split(',')
        title = _data[1]
        html = _data[2]
        tem = []
        mel = []
        _tmplist.forEach((elem) => {
            tem.push(elem.split('|')[0])
            mel.push(elem.split('|')[1])
        })
        document.getElementById('main-menu').style.display = "none"
        document.getElementById('ready-menu').style.display = "block"
        document.getElementById('songname').innerHTML = title

        document.getElementById('up-speed').addEventListener('click', () => {
            if (speed <= 4.9) {
                speed += 0.1
                speed = Math.round(speed * 10) / 10
                document.getElementById('tempo-speed').textContent = speed.toFixed(1) + "x"
            }
        })
        document.getElementById('down-speed').addEventListener('click', () => {
            if (speed >= 0.2) {
                speed -= 0.1
                speed = Math.round(speed * 10) / 10
                document.getElementById('tempo-speed').textContent = speed.toFixed(1) + "x"
            }
        })
        document.getElementById('up-accuracy').addEventListener('click', () => {
            if (accuracy <= 0.9) {
                accuracy += 0.1
                accuracy = Math.round(accuracy * 10) / 10
                document.getElementById('accuracy').textContent = accuracy.toFixed(1) + "s"
            }
        })
        document.getElementById('down-accuracy').addEventListener('click', () => {
            if (accuracy >= 0.2) {
                accuracy -= 0.1
                accuracy = Math.round(accuracy * 10) / 10
                document.getElementById('accuracy').textContent = accuracy.toFixed(1) + "s"
            }
        })
        document.getElementById('grid-start').addEventListener('click', () => {
            if (!played) {
                played = true
                document.getElementById('title_screen').innerHTML = document.getElementById('title_screen').innerHTML + "<div style='color: white; position: absolute; left: 50%; transform: translateX(-50%); bottom: 50px;'>" + html + "</div>"
                run()
            }
        })

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                const audioTracks = stream.getAudioTracks();
                const microphoneName = audioTracks[0].label;
                document.getElementById('mic-status-name').textContent = microphoneName
                stream.getTracks().forEach(track => track.stop());
                document.getElementById('grid-start').style.display = "block"
            })
            .catch(function (error) {
                document.getElementById('mic-status-name').textContent = "마이크 권한을 허용해주세요."
                document.getElementById('mic-status-name').style.color = "red"
                document.getElementById('grid-start').style.display = "none"
            });

    }
    catch (e) {
        console.log(e)
        alert("손상된 KARA파일 입니다.")
    }
}
document.querySelector("#navbar > span:nth-child(1)").addEventListener('click', (e) => {
    document.getElementById('main-menu').style.display = "grid"
    document.getElementById('ready-menu').style.display = "none"
})
play3 = 0
skipped = 0
function onPlayerStateChange(event) {
    if (event.data == 3 && play3 == 1) {
        location.reload()
    } else if (event.data == 3) {
        play3 = 1
    }
    if (event.data == 1) {
        document.getElementById('volume-wrapper').style.display = 'block'
        document.getElementById('volume-up').addEventListener('click', (e) => {
            console.log('press')
            if (player.getVolume() >= 0 && player.getVolume() < 100) {
                player.setVolume(player.getVolume() + 10)
                document.getElementById('volume-text').textContent = player.getVolume() + "%"
            }
        })

        document.getElementById('volume-down').addEventListener('click', (e) => {
            console.log('press')
            if (player.getVolume() > 0 && player.getVolume() <= 100) {
                player.setVolume(player.getVolume() - 10)
            }
        })
        for (i = 0; i < tem.length - 1; i++) {
            if (tem[i + 1] - tem[i] >= 10) {
                interlude_section = document.createElement('div')
                interlude_section.className = "status-bar-interlude"
                interlude_section.style.marginLeft = (tem[i] * 100 / player.getDuration()) + "%"
                interlude_section.style.width = ((tem[i + 1] - tem[i]) * 100 / player.getDuration()) + "%"
                barrier.append(interlude_section)
            }
        }
        document.addEventListener('click', (e) => {
            if (e.target.className == "interlude") {
                play3 = 0
                skipped = 1
                document.getElementById('status').style.opacity = "0"
                player.seekTo(tem[step] - 3)
            }
        })
        if (!trustInteraction) {
            document.getElementById('barrier').style.display = "block"
        }

        document.getElementById('title_screen').style.display = 'block'
        trustInteraction = true

        setInterval(() => {
            document.getElementById('volume-text').textContent = player.getVolume() + "%"
            document.getElementById('status-bar').style.width = player.getCurrentTime() * 100 / player.getDuration() + "%"
            document.getElementById('point-bar-value').style.width = (success.length - (failure.length + slient.length) * 0.4) * 100 / (tem.length * 0.5) + "%"
            point = (success.length - (failure.length + slient.length) * 0.4) * 100 / (tem.length * 0.5)
            if (point < 0) {
                point = 0
            }
            if ((point + "").indexOf('.') > -1) {
                document.getElementById('point-bar-value-decimal').textContent = (point + "").split('.')[0] + "%"
            } else {
                document.getElementById('point-bar-value-decimal').textContent = point + "%"
            }

            if (step - 1 >= 0) {
                if (failure.indexOf(step - 1) == -1 && success.indexOf(step - 1) == -1 && slient.indexOf(step - 1) == -1) {
                    slient.push(step - 1)
                }
                if (Math.abs(tem[step - 1] - tem[step]) > 10 && step != tem.length - 1 && skipped == 0) {
                    document.getElementById('status').className = "interlude"
                    document.getElementById('status').innerHTML = "간주 건너뛰기"
                }
            }
            if (player.getCurrentTime() >= tem[0] - 8) {
                document.getElementById('title_screen').style.opacity = "0"

            } else {
                document.getElementById('status').style.opacity = "0"
                document.getElementById('title_screen').style.opacity = "0.5"
                document.getElementById('title_screen_title').innerHTML = title
            }
            if (Math.abs(player.getCurrentTime() - tem[step]) < 0.04) {
                _t = 1
                step++;
            } else {
                _t = 0
            }
        }, 10)
        player.setPlaybackRate(speed)
        player.playVideo()
        app.start()
    }
    if (event.data == 0) {
        musicStop = true
        document.getElementById('barrier').style.background = "black"
        document.getElementById('barrier').style.opacity = "1"
        document.getElementById('status').className = "end"
        document.getElementById('status').innerHTML = "정확한 음 : " + success.length + "/" + mel.length + "<br>부정확한 음 : " + (mel.length - success.length) + "/" + mel.length + "<br>타이밍 놓친 음 : " + slient.length + "<br><p onclick='location.reload()'>다시 고르기</p>"
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

    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // const audioContext = new AudioContext();

    // const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia;
    // const constraints = { audio: true };

    // const drawLiveAudio = () => {
    //     getUserMedia.call(navigator.mediaDevices, constraints)
    //         .then(stream => {
    //             const source = audioContext.createMediaStreamSource(stream);
    //             const analyser = audioContext.createAnalyser();
    //             source.connect(analyser);
    //             draw(analyser);
    //         })
    //         .catch(error => {
    //             console.error('Error accessing microphone:', error);
    //         });
    // };

    // const draw = analyser => {
    //     // set up the canvas
    //     const canvas = document.querySelector("canvas");
    //     const dpr = window.devicePixelRatio || 1;
    //     const padding = 20;
    //     canvas.width = window.innerWidth * dpr;
    //     canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
    //     const ctx = canvas.getContext("2d");
    //     ctx.scale(dpr, dpr);
    //     ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

    //     // draw the line segments
    //     const bufferLength = analyser.frequencyBinCount;
    //     const dataArray = new Uint8Array(bufferLength);
    //     const width = canvas.offsetWidth / bufferLength;

    //     const drawFrame = () => {
    //         requestAnimationFrame(drawFrame);

    //         analyser.getByteTimeDomainData(dataArray);

    //         ctx.clearRect(0, -canvas.offsetHeight / 2 - padding, canvas.width, canvas.height);

    //         for (let i = 0; i < bufferLength; i++) {
    //             const x = (window.innerWidth / bufferLength) * i;
    //             const height = (dataArray[i] / 128.0) * canvas.offsetHeight / 2;
    //             drawLineSegment(ctx, x, height, width, (i + 1) % 2);
    //         }
    //     };

    //     drawFrame();
    // };

    // const drawLineSegment = (ctx, x, height, width, isEven) => {
    //     ctx.lineWidth = 1;
    //     ctx.strokeStyle = "#fff";
    //     ctx.beginPath();
    //     height = isEven ? height : -height;
    //     ctx.moveTo(x, 0);
    //     ctx.lineTo(x, height);
    //     ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    //     ctx.lineTo(x + width, 0);
    //     ctx.stroke();
    // };

    // // Call to draw the live audio waveform
    // drawLiveAudio();

};

tempo = {}
mel = []

Application.prototype.update = function (note) {
    if (player.getCurrentTime() >= tem[0] - accuracy) {
        skipped = 0
        document.getElementById('status').style.opacity = "0.5"
        if (mel[step] == "X") {
            if (success.indexOf(step) == -1) {
                document.getElementById('status').innerHTML = "O"
                document.getElementById('status').className = "clear_animation"
                success.push(step)
            }
        }
        if (mel[step] != "X") {
            if (Math.abs(translate[mel[step]] - translate[note['name']]) <= 2) {

                if (success.indexOf(step) == -1) {
                    document.getElementById('status').innerHTML = "O"
                    document.getElementById('status').className = "clear_animation"
                    success.push(step)
                }
            } else {
                if (failure.indexOf(step) == -1) {
                    if (translate[mel[step]] < translate[note['name']]) {
                        document.getElementById('status').innerHTML = "HIGH"
                    } else {
                        document.getElementById('status').innerHTML = "LOW"
                    }
                    document.getElementById('status').className = "fail_animation"
                    failure.push(step)

                }
            }
        }
    }
};

const app = new Application()

trustInteraction = false

document.addEventListener('keydown', (e) => {
    e.preventDefault()
    e.stopPropagation()
})
