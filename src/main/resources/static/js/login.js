$(document).ready(function() {

  var animating = false,
    submitPhase1 = 1100,
    submitPhase2 = 800,
    logoutPhase1 = 800,
    $login = $(".login"),
    $app = $(".app");

  function ripple(elem, e) {
    $(".ripple").remove();
    var elTop = elem.offset().top,
      elLeft = elem.offset().left,
      x = e.pageX - elLeft,
      y = e.pageY - elTop;
    var $ripple = $("<div class='ripple'></div>");
    $ripple.css({
      top: y,
      left: x
    });
    elem.append($ripple);
  };

  $(document).on("click", ".login__submit", function(e) {
    if (animating) return;
    animating = true;
    var that = this;
    ripple($(that), e);
    $(that).addClass("processing");
    setTimeout(function() {
      $(that).addClass("success");
      setTimeout(function() {
        $app.show();
        $app.css("top");
        $app.addClass("active");
      }, submitPhase2 - 70);
      setTimeout(function() {
        $login.hide();
        $login.addClass("inactive");
        animating = false;
        $(that).removeClass("success processing");
        document.getElementById("loginForm").submit();
      }, submitPhase2);
    }, submitPhase1);
    
  });

  $(document).on("click", ".sign__up", function(e) {
    if (animating) return;
    $(".ripple").remove();
    animating = true;
    var that = this;
    $(that).addClass("clicked");
    setTimeout(function() {
      $app.removeClass("active");
      $login.show();
      $login.css("top");
      $login.removeClass("inactive");
    }, logoutPhase1 - 120);
    setTimeout(function() {
      $app.hide();
      animating = false;
      $(that).removeClass("clicked");
    }, logoutPhase1);
  });

});

function switchToSignUp(){
	  document.getElementById('switchCss').className += 'demo fadeOut';	
	  setTimeout(function(){document.getElementById('wrapper').innerHTML = '<div class="cont"><div id="switchCss" class="demo fadeIn"><div  class="login"><div class="login__check"></div><form id="loginForm" th:action="@{/signup}" method="post" enctype="multipart/form-data"><div style="top: 40%;" class="login__form"><div class="login__row"><svg class="login__icon name svg-icon" viewBox="0 0 20 20"><path d="M0,20 a10,8 0 0,1 20,0z M10,0 a4,4 0 0,1 0,8 a4,4 0 0,1 0,-8" /></svg><input type="text" name="username" class="login__input name" placeholder="Username"/></div><div class="login__row"><svg class="login__icon pass svg-icon" viewBox="0 0 20 20"><path d="M0,20 20,20 20,8 0,8z M10,13 10,16z M4,8 a6,8 0 0,1 12,0" /></svg><input type="password" name="password" class="login__input pass" placeholder="Password"/></div><div id="confirmPassword" class="login__row"><svg class="login__icon pass svg-icon" viewBox="0 0 20 20"><path d="M0,20 20,20 20,8 0,8z M10,13 10,16z M4,8 a6,8 0 0,1 12,0" /></svg><input type="password" name="passwordConfirm" class="login__input pass" placeholder="Confirm password"/></div><button id="button" type="button" class="login__submit">Sign up</button><p class="login__signup">Al een account? &nbsp;<a onclick="switchToSignIn()" href="#">Sign in</a></p></div></div></div></div>';}, 600);
}

function switchToSignIn(){
	document.getElementById('switchCss').className = 'demo fadeOut';
	setTimeout(function(){document.getElementById('wrapper').innerHTML =  '<div class="cont"><div id="switchCss" class="demo fadeIn"><div  class="login"><div class="login__check"></div><form id="loginForm" th:action="@{/login}" method="post" enctype="multipart/form-data"><div class="login__form"><div class="login__row"><svg class="login__icon name svg-icon" viewBox="0 0 20 20"><path d="M0,20 a10,8 0 0,1 20,0z M10,0 a4,4 0 0,1 0,8 a4,4 0 0,1 0,-8" /></svg><input type="text" name="username" class="login__input name" placeholder="Username"/></div><div class="login__row"><svg class="login__icon pass svg-icon" viewBox="0 0 20 20"><path d="M0,20 20,20 20,8 0,8z M10,13 10,16z M4,8 a6,8 0 0,1 12,0" /></svg><input type="password" name="password" class="login__input pass" placeholder="Password"/></div><button id="button" type="button" class="login__submit">Sign in</button><p class="login__signup">Nog geen account? &nbsp;<a onclick="switchToSignUp()" href="#">Sign up</a></p></div></form></div></div></div>';}, 600);
}