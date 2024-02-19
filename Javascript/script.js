var i = 0; //to count length
var txt = [
  "Hi",
  "You've made it this far because you are strong- even on the days when you didn't think you were.",
  "You did well this year",
  "I just want to tell you",
  "Thank you for coming into my life, you are actually making me smile and laugh. Thank you for your understanding. i really appreciate you so much.",
  "Happy new Years! see you next years",
  "Hope we make it next years ma bro",
];

var txtCount = LNSLocal("txtCount") ? JSON.parse(LNSLocal("txtCount")) : 0; //count txt var, cause it was an array
var speed = 60; //typing effect speed

var likeVal = LNSLocal("likeVal")
  ? JSON.parse(LNSLocal("likeVal"))
  : new Array(txt.length).fill(false); //like effect
var username = LNSLocal("username") ? JSON.parse(LNSLocal("username")) : "";

//Load N Save to LocalStorage
function LNSLocal(name = "var name", isSave = false, item, isJson = false) {
  if (!isSave) {
    var load = localStorage[name];
    if (load) return load;
    else return false;
  } else {
    isJson
      ? (localStorage[name] = JSON.stringify(item))
      : (localStorage[name] = item.toString());
  }
}

function tagPerson(e) {
  var name = e.innerHTML;
  var text = document.getElementById("insertText");

  console.log(name);

  let pattern = /@(\w+)/;

  if (text.value.match(pattern)) {
    // Extract the matched word after @
    let matchedWord = text.value.match(pattern)[0];
    var beingReplace = text.value;
    text.value = beingReplace.replace(matchedWord, "").replace(/\s/g, "");
  }

  text.value = `@${name} ` + text.value;
}

//once like icon clicked
function like(isCheck = true) {
  var e = document.getElementById("like");

  if (!isCheck) {
    likeVal[txtCount]
      ? (likeVal[txtCount] = false)
      : (likeVal[txtCount] = true);
    LNSLocal("likeVal", true, likeVal, true);
  }

  likeVal[txtCount] ? (e.style.color = "red") : (e.style.color = "#eaeaea");
}

//once comment icon clicked
function comment() {
  e = document.querySelector(".comments");
  e.style.visibility = "visible";
}

//changing text with typing effect
function typeWriter() {
  like(true);
  if (i < txt[txtCount].length) {
    document.querySelector(".msg").textContent += txt[txtCount].charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

//Delete the text and add/decrease value txtCount
function nextOrBack(param, load=false) {
  var buttonBack = document.getElementById("back");
  var buttonNext = document.getElementById("next");
  if (i >= 0 && !load) {
    var currentText = document.querySelector(".msg").textContent;
    document.querySelector(".msg").textContent = currentText.slice(0, -1);
    i--;
    setTimeout(nextOrBack(param), speed);
  } else {
    if (!load) param == "next" ? txtCount++ : txtCount--;
    if (txtCount <= -1 || txtCount == 0) {
      txtCount = 0;
      buttonBack.style.opacity = ".5";
      buttonBack.disabled = true;
    } else if (txtCount >= txt.length || txtCount == txt.length - 1) {
      txtCount = txt.length - 1;
      buttonNext.style.opacity = ".5";
      buttonNext.disabled = true;
    } else {
      buttonBack.style.opacity = "1";
      buttonNext.style.opacity = "1";
      buttonBack.disabled = false;
      buttonNext.disabled = false;
    }
    LNSLocal("txtCount", true, txtCount);
    typeWriter();
  }
}

function enterKeyPressed(event, code) {
  if (event.keyCode == 13) {
    switch (code) {
      case 1:
        sendComment();
        break;

      case 2:
        login();
        break;

      default:
        break;
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
