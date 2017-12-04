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

var questions = '';
var currentQuestion = 0;
function addPlayer(playerUrl) {
    document.getElementById('dynamicdiv').innerHTML = '<iframe class="youtube-player" src="'+playerUrl+'">Uitleg</iframe>';
}

function addQuestionForm(sid, lesson){
    currentQuestion = 0;
    document.getElementById('dynamicdiv').innerHTML = '<p id="question"></p>';
    document.getElementById('dynamicdiv').innerHTML += '<input onkeyup="updateAnswer();" type="text" id="answer"/>';
    document.getElementById('dynamicdiv').innerHTML += '<button onclick="showFeedback()" type="submit" id="submit">Controleer</button>';
    document.getElementById('dynamicdiv').innerHTML += '<input type="hidden" id="answerUnedited"/>';
    loadQuestions(sid, lesson);
}

function showFirstQuestion(response){
    questions = response;
    var questionList = JSON.parse(response);
    var q = questionList[currentQuestion].question;
    document.getElementById('answerUnedited').setAttribute('value', q);
    document.getElementById('question').textContent = q.replace('@antwoord', '...');
}

function updateAnswer(){
    var answer = document.getElementById('answer').value;
    document.getElementById('question').textContent = document.getElementById('answerUnedited').value.replace('@antwoord', answer);
}

function showFeedback(){
    var givenAnswer =document.getElementById('answer').value;
    document.getElementById('answer').value = '';
    var questionList = JSON.parse(questions);
    var rightAnswer = questionList[currentQuestion].answer;
    //saveAnswer()
    if(givenAnswer === rightAnswer){
        alert(questionList[currentQuestion].positiveFeedback);
    }else{
        alert(questionList[currentQuestion].negativeFeedback);
    }
    showNextQuestion();
}

function showNextQuestion(){
    currentQuestion++;
    var questionList = JSON.parse(questions)
    var q = questionList[currentQuestion].question;
    document.getElementById('answerUnedited').setAttribute('value', q);
    document.getElementById('question').textContent = q.replace('@antwoord', '...');
}

function loadQuestions(sid, lid){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            showFirstQuestion(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", "question/getQuestions?" +
        "sid=" + sid +
        "&uuid=" + lid, true); // true for asynchronous
    xmlHttp.send(null);
}