var speechInput;
var lastInputReceivedMillis;
var butlerCalled;
var log = false;
var saveState;


function showTeachingInterface(){
    var body = document.getElementById("body");
    saveState = body.innerHTML;
    body.innerHTML = '<object type="text/html" data="/iframes/teachingInterface.html"></object>';
}
function refresh(){
    speechInput = "";
    func();
}

function processCommand(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            if(xmlHttp.responseText == "Command not known"){
                showTeachingInterface();
            }else if(xmlHttp.responseText == "Command executed"){
                //Say something
            }
        }
    }
    xmlHttp.open("GET", "processCommand?command=" + speechInput, true); // true for asynchronous
    xmlHttp.send(null);
    refresh();
}
function inputEnded(){
    if(lastInputReceivedMillis < new Date().getTime() - 1000) {
        console.log('Checking if a command was given to butler');
        if (butlerCalled) {
            butlerCalled = false;
            console.log('command: '+speechInput);
            processCommand();
        }
    }else if(lastInputReceivedMillis < new Date().getTime() - 7500){
        lastInputReceivedMillis = new Date().getTime();
        refresh();
    }
}
window.setInterval(inputEnded, 200);
window.setInterval(refresh, 30000);

function func()
{
    var recognition = new webkitSpeechRecognition();
    recognition.language = "nl";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = function(event)
    {
        lastInputReceivedMillis = new Date().getTime();
        speechInput = event.results[0][0].transcript;
        if(speechInput.toLowerCase().indexOf('butler') != -1){
            butlerCalled = true;
            console.log('Butler is listening');
            refresh();
        }
        if(log) {
            console.log(event.results[0][0].transcript);
        }
    }
    recognition.start();
}
var button = $('.button');
var mic = button.find('svg');
var active = $('.active-wrapper');
var stop = $('.stop-button');
var dotCol = $('.dots-col');
var w = $(window);
var vw = w.innerWidth();
var vh = w.innerHeight();
var bw = button.innerWidth();
var bh = button.innerHeight();
var s;

var clone = button.clone();
clone.find('svg').remove();
button.before(clone);

var open = function() {
    if (vw > vh) {
        s = vw / bw * 2.0;
    } else {
        s = vh / bh * 2.0;
    }
    var scale = 'scale(' + s + ') translate(-50%,-50%)';

    clone.css({
        transform: scale
    });

    mic.css({
        fill: 'rgba(0,0,0,0.2)',
        transform: 'scale(4)'
    });

    button.on('transitionend', function() {
        active.addClass('active');
        $(this).off('transitionend');
    });

    return false;
};

var close = function() {
    active.removeClass('active');
    clone.removeAttr('style');
    mic.removeAttr('style');
};

button.on('click', open);
stop.on('click', close);
