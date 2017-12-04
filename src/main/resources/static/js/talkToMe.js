var speechInput;
var lastInputReceivedMillis;
var butlerCalled;
var log = false;
var commandGiven = "";
var forecast

function getWeatherForecast(daysInFuture, city){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            alert(xmlHttp.responseText);
            forecast = xmlHttp.responseText;
        }
    }
    xmlHttp.open("GET", "getWeatherForecast?daysInTheFuture=" + daysInFuture + "&city=" + city, false);
    xmlHttp.send(null);
    refresh();
}

function activateButler(){
    speak('Hi. I am butler. Feel free to ask me anything.');
    startListening();
}

function showTeachingInterface(){
    speak('My apologies sir. I did not quite get that.');
    showOptionsView();
}

function refresh(){
    speechInput = "";
    startListening();
}

function addVariableToResponse(substitutionForVariableResponse){
    document.getElementById("response").value += ' ' + substitutionForVariableResponse + ' ';
}

function replaceVariablesWithPronouncableText(response){
    var date = new Date().toDateString();
    if(response.indexOf('$Date') != -1){
        response = response.replace("$Date", date.substr(0,3) + " " + date.substr(7,3) + " " + date.substr(4,3));
    }
    if(response.indexOf('$Time') != -1){
        response = response.replace("$Time", new Date().toTimeString().substr(0,5));
    }
    if(response.indexOf('$Weather') != -1){
        var daysInFuture = response.substr(response.indexOf('$Weather') + 9, 1);
        var city = response.substr(response.indexOf("$Weather") + 11, response.indexOf("$ ") - 11);
        getWeatherForecast(daysInFuture, city);
        response = response.replace(
            response.substr(response.indexOf("$Weather"), response.indexOf("$ ") + 2),
            forecast
        );
    }
    return response;
}

function speak(input) {
    input = replaceVariablesWithPronouncableText(input);
    var msg = new SpeechSynthesisUtterance(input);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function saveCommandAndAction(actionName, executionType) {
    var xmlHttpSaveAction = new XMLHttpRequest();
    var actionUuid = "";
    xmlHttpSaveAction.onreadystatechange = function () {
        if (xmlHttpSaveAction.readyState == 4 && xmlHttpSaveAction.status == 200) {
            actionUuid = xmlHttpSaveAction.responseText;
            console.log('uuid: ' + actionUuid);
            var xmlHttpSaveCommand = new XMLHttpRequest();
            xmlHttpSaveCommand.onreadystatechange = function () {
                if (xmlHttpSaveCommand.readyState == 4 && xmlHttpSaveCommand.status == 200) {
                    if (xmlHttpSaveCommand.responseText == 'Command and response saved') {
                        speak('Command and response saved');
                    } else {
                        speak("Something wen't wrong");
                    }
                }
            }
            xmlHttpSaveCommand.open("GET", "saveCommand?command=" + commandGiven + "&actionUuid=" + actionUuid, true);
            xmlHttpSaveCommand.send(null);
        }
    }
    xmlHttpSaveAction.open("GET", "saveAction?an=" + actionName + "&et=" + executionType + "&resp=" + actionName + "&dep=empty", true);
    xmlHttpSaveAction.send(null);
    refresh();
}

function processCommand(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            if(xmlHttp.responseText == "Command not known"){
                showTeachingInterface();
            }else if(xmlHttp.responseText == "Command executed"){
                speak('Command executed');
                showCorrectionOptionsView();
            }else if(xmlHttp.responseText.indexOf("speak:") != -1){
                speak(xmlHttp.responseText.substr(7));
                showCorrectionOptionsView();
            }else{
                speak("Something wen't wrong");
            }
        }
    }
    xmlHttp.open("GET", "processCommand?command=" + commandGiven, true); // true for asynchronous
    xmlHttp.send(null);
    refresh();
}

function inputEnded(){
    if(lastInputReceivedMillis < new Date().getTime() - 1500) {
        console.log('Checking if a command was given to butler');
        if (butlerCalled) {
            butlerCalled = false;
            console.log('command: '+speechInput);
            commandGiven = speechInput;
            processCommand();
        }
    }else if(lastInputReceivedMillis < new Date().getTime() - 7500){
        lastInputReceivedMillis = new Date().getTime();
        refresh();
    }
}
window.setInterval(inputEnded, 200);
window.setInterval(refresh, 30000);

function startListening()
{
    var recognition = new webkitSpeechRecognition();
    var count = 0;
    recognition.language = "nl-NL";
    recognition.continuous = true;
    recognition.interimResults =true;
    recognition.onresult = function(event)
    {
        count++;
        speechInput = event.results[0][0].transcript;
        if(log) {
            console.log(event.results[0][0].transcript);
        }
        lastInputReceivedMillis = new Date().getTime();
        if(speechInput.toLowerCase().indexOf('butler') != -1){
            showSpeakingModeView();
            butlerCalled = true;
            console.log('Butler is listening');
            refresh();
        }
        if(count > 7 && speechInput.toLowerCase().indexOf('butler') == -1 && !butlerCalled){
            count = 0;
            refresh();
        }
    }
    recognition.start();
}

var bubble = function() {
    var $button = $(this);
    if (!$button.hasClass('activated')) {
        $button.addClass('activated');
        $button.on('animationend webkitAnimationEnd oAnimationEnd', function() {
            $button.removeClass('activated');
        });
    }
};

$('.bubble').on('mouseup', bubble);