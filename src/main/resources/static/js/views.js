var body = document.getElementById("body");
var speakingModeView = document.getElementById("speakingMode").outerHTML;
var teachingOptionsView = document.getElementById("teachingOptions").outerHTML;
var optionsView = document.getElementById("options").outerHTML;
var optionsWithoutCommandView = document.getElementById("optionsWithoutCommand").outerHTML;
var teachResponseView = document.getElementById("teachResponseView").outerHTML;
var extraSpeechOptionsView = document.getElementById("extraSpeechOptions").outerHTML;
var correctionOptionsView = document.getElementById("correctionOptions").outerHTML;

function showCorrectionOptionsView(){
    body.innerHTML = correctionOptionsView;
}

function showExtraSpeechOptionsView(){
    body.innerHTML = extraSpeechOptionsView;
}
function showTeachResponseView(){
    body.innerHTML = teachResponseView;
}
function showOptionsWithoutCommandView(){
    body.innerHTML = optionsWithoutCommandView;
}

function showTeachingOptionsView(){
    body.innerHTML = teachingOptionsView;
}

function showSpeakingModeView(){
    body.innerHTML = speakingModeView;
}

function showOptionsView(){
    body.innerHTML = optionsView;
}

function initView(){
    body.innerHTML = speakingModeView;
}
initView();