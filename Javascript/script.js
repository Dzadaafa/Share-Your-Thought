var i = 0; //to count length
var txt = [
  "Hi",
  "Roses are red, I said what i said\nTake yo ass to bed, turn off the light\nGet off that phone, and GO TO BED",
  "Met Shiso\n\n[attached image]\n\ncute isn't it",
  "This gonn be a meme forum, if you're interested to take a part of this project\nDm <i>@Dzadafa</i> on insta\nOr send me an email\n<i>efslaboratory@gmail.com</i>",
  "Bro this is a prototype, if ya wanna criticize or judge me\nI dare you at this post",
  "Don't mind the date below, im not setting it yet",
  "also, imma add the share button very soon\nhehe, just wait for it",
];

var txtCount = LNSLocal("txtCount") ? JSON.parse(LNSLocal("txtCount")) : 0; //count txt var, cause it was an array
var speed = 40; //typing effect speed

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
  var written = txt[txtCount].replace(/\n/g, '<br>')
  if (i < txt[txtCount].length) {
    document.querySelector(".msg").innerHTML += txt[txtCount].charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else { document.querySelector(".msg").innerHTML = written}
}

//Delete the text and add/decrease value txtCount
function nextOrBack(param, load=false) {
  var buttonBack = document.getElementById("back");
  var buttonNext = document.getElementById("next");
  if (i >= 0 && !load) {
    var currentText = document.querySelector(".msg").innerHTML;
    document.querySelector(".msg").innerHTML = ''//currentText.slice(0, -1);
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

function signUpInForm(Login_Register="login") {
  const a = document.querySelector("#register");
  const b = document.querySelector("#login")
  if (Login_Register.toLowerCase() == "login") {
    a.style.display = "none";
    b.style.display = "flex"; 
  }
  else {
    b.style.display = "none";
    a.style.display = "flex";
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
