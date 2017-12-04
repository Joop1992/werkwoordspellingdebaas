if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

(function ($) {
    $(function () {
        var $wrapper = $(".list-wrapper");
        var $back = $wrapper.find("a.back-link");
        var $lists = $wrapper.find(".list-body-container ul")
        var $links = $lists.find("a.list-link");

        var $listPath = [$lists.filter(".active-list").eq(0)];

        function onBackClick (e) {
            e.preventDefault();
            e.stopPropagation();

            if ($listPath.length < 2) {
                return false;
            }

            var $cl = $listPath.pop();

            $cl.removeClass("active-list");
            $listPath.last().removeClass("parent-list");
            $cl.siblings(".list-link").removeClass("active-link");

            window.setTimeout(function () {
                $cl.addClass("hidden");
            }, 310);
        };

        function onLinkClick (e) {
            e.preventDefault();
            e.stopPropagation();

            var $link = $(this);
            var $list = $($link.attr("href"));

            if (!$list.length) {
                return false;
            }

            $link.addClass("active-link");
            $list.removeClass("hidden");

            window.setTimeout(function () {
                $list.addClass("active-list");
            }, 10);

            $listPath.last().addClass("parent-list");
            $listPath.push($list);
        };

        // click on back button
        $back.on("click", onBackClick);

        // click on list links
        $links.on("click", onLinkClick);
    });
})(jQuery);
/**
 * Created by Yara on 20-11-2017.
 */
var currentLesson = "";
var currentSubject = "";
var emptyForm = document.getElementById('form1').innerHTML;
function setLesson(name, id, sid){
    document.getElementById('dynamicdivtitle').innerHTML = '<p>' + name + '</p>';
    currentLesson = id;
    currentSubject = sid;
    document.getElementById('addButton').style.opacity = 1;
    document.getElementById('form1').opacity = 0;
    getQuestions(currentSubject, currentLesson);
}

function addForm(){
    document.getElementById('addButton').style.opacity = 0;
    document.getElementById('form1').style.opacity = 1;
}

function removeForm(){
    document.getElementById('addButton').style.opacity = 1;
    document.getElementById('form1').style.opacity = 0;
}

function submitFormWithAjaxAndReload(){
    var question = document.getElementById('question').value;
    var answer = document.getElementById('answer').value;
    var pf = document.getElementById('positiveFeedback').value;
    var nf =  document.getElementById('negativeFeedback').value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            addQuestionsToList(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", "question/saveQuestion?" +
        "sid=" + currentSubject +
        "&uuid=" + currentLesson +
        "&id=" +currentLesson+
        "&question=" +question+
        "&answer=" +answer+
        "&positiveFeedback=" +pf+
        "&negativeFeedback=" +nf, true); // true for asynchronous
    xmlHttp.send(null);
}

function addQuestionsToList(response){
    var questions = JSON.parse(response);
    document.getElementById('questionList').innerHTML = "";
    for(var i = 0; i < questions.length; i++){
        var id = questions[i].id;
        var question = questions[i].question;
        document.getElementById('questionList').innerHTML += "<button style='width:65%;background:white;'>" + question + "</button>";
        document.getElementById('questionList').innerHTML += "<button style='width:16%' onclick='editQuestion("+id+");return false;' >Bewerken</button>";
        document.getElementById('questionList').innerHTML += "<button style='width:18%' onclick='deleteQuestion("+id+");return false;' >Verwijderen</button>";
    }
}
function editQuestion(id){
    document.getElementById('form1').innerHTML = emptyForm;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var question = JSON.parse(xmlHttp.responseText);
            document.getElementById('question').setAttribute('value', question.question);
            document.getElementById('answer').setAttribute('value', question.answer);
            document.getElementById('positiveFeedback').innerText = question.positiveFeedback;
            document.getElementById('negativeFeedback').innerText = question.negativeFeedback;
            document.getElementById('form1').innerHTML += "<button onclick='updateQuestion("+id+");return false;' >Opslaan</button>";

        }
    }
    xmlHttp.open("GET", "question/getQuestion?" +
        "id=" + id, true); // true for asynchronous
    xmlHttp.send(null);
}

function updateQuestion(id){
    var question = document.getElementById('question').value;
    var answer = document.getElementById('answer').value;
    var pf = document.getElementById('positiveFeedback').value;
    var nf =  document.getElementById('negativeFeedback').value;
    document.getElementById('form1').innerHTML = emptyForm;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            addQuestionsToList(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", "question/editQuestion?" +
        "sid=" + currentSubject +
        "&uuid=" + currentLesson +
        "&id=" +id+
        "&question=" +question+
        "&answer=" +answer+
        "&positiveFeedback=" +pf+
        "&negativeFeedback=" +nf, true); // true for asynchronous
    xmlHttp.send(null);
}

function deleteQuestion(id){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            addQuestionsToList(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", "question/deleteQuestion?" +
        "sid=" + currentSubject +
        "&uuid=" + currentLesson +
        "&id=" + id, true); // true for asynchronous
    xmlHttp.send(null);
}

function getQuestions(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            addQuestionsToList(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", "question/getQuestions?" +
        "sid=" + currentSubject +
        "&uuid=" + currentLesson, true); // true for asynchronous
    xmlHttp.send(null);
}
