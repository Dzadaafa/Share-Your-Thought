import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

var txtCount = LNSLocal('txtCount') ? JSON.parse(LNSLocal('txtCount')) : 0; //count txt var, cause it was an array

var username = LNSLocal('username') ? JSON.parse(LNSLocal('username')) : '';
var commentBtn = document.querySelector("#commentBtn")
var commentContent = document.querySelector("#insertText")
var commentIco = document.querySelector("#comment")
var trashButton = document.querySelector("#trashIco")
var usernameInput = document.querySelector("input#loginUser")
var loginButton = document.querySelector("#loginButton")
var allCommentCount = 0;

var deleting = false;

const firebaseConfig = {
  apiKey: "AIzaSyA3Y1k1xW2P3eMyLPmK8ji7NjJ7J_Ru_CA",
  authDomain: "sharing-place-1d872.firebaseapp.com",
  databaseURL: "https://sharing-place-1d872-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sharing-place-1d872",
  storageBucket: "sharing-place-1d872.appspot.com",
  messagingSenderId: "309862359330",
  appId: "1:309862359330:web:4121e7bc276e473896c57b"
};

const app = initializeApp(firebaseConfig);
import { getDatabase, ref, child, get, set, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const db = getDatabase();

window.onload = (event) => {
  var keys = Object.keys(username);
  var firstKey = keys[0];

  userData(firstKey, username[firstKey])
  .then((response) => {
    if (username && response) login(true)
  })

  typeWriter()
  nextOrBack(null, true)
};

function login(skip=false) {

  var loginUser = document.querySelector("#loginUser");
  var nonAva = document.querySelector("#desc")

  if (loginUser.value.replace(/\s/g, "") || skip) {
    if (!skip) {
      username = loginUser.value.trim();
      var pp = getRandomInt(1, 12).toString();
      var ppAndUser = {
        [username]: pp,
      };
      
      var valid = userData(username, pp, false, true)
      .then((response) => {
        if (!response) {
            LNSLocal("username", true, ppAndUser, true);
            userData(username, pp, true)

            username = JSON.parse(LNSLocal('username'))
            
            document.querySelector(".login").style.visibility = "hidden";
            document.querySelector(".content").style.visibility = "visible";
            document.querySelector(".buttons").style.visibility = "visible";
        } else {
            nonAva.style.display = "block"
            nonAva.innerHTML = `"${loginUser.value.trim()}" wasn't available`
            loginUser.value = ""
        }
      })
    } else {
      alert(skip.toString())
      document.querySelector(".login").style.visibility = "hidden";
      document.querySelector(".content").style.visibility = "visible";
      document.querySelector(".buttons").style.visibility = "visible";
    }
  }
}

function getRandomInt(min, max) {   
  return Math.floor(Math.random() * (max - min) + min);
}

function addData(u, c, p, counter, cNumb){
  set(ref(db, 'CommentOn/' + `comment${counter}/` +`${cNumb}`), {
    content: c,
    profilePic: p,
    Name: u
  }).then(() => {
    console.log('Successfully added');
  }).catch((error) => {
    alert('Unsuccessfull');
    console.log(error);
  })
}

function userData(user, pp, add=false, signup=false){
  if (add){
    set(ref(db, 'Users/' + 'Username/' +`${user}`), {
      profilePic: pp
    })
    .then(() => {
      console.log('Successfully added');
    }).catch((error) => {
      console.log(error);
    })
  } else {
    const dbRef = ref(db);

    return get(child(dbRef, 'Users/' + 'Username'))
      .then((snapshot) => {
        if (snapshot.exists() && snapshot.hasChild(user) && !signup) {
          const userData = snapshot.child(user).val();
          const ppExtern = (userData.profilePic);
          // console.log(ppExtern == pp)

          return ppExtern == pp; //username exist
        } else if (snapshot.exists() && snapshot.hasChild(user) && signup) {
          // var lower = snapshot.child(user).val();
          // var username = Object.keys(lower)[0];
          // console.log(lower)

          return snapshot.hasChild(user.trim())
        } else {
          return null //username wasn't exist
        }
      })
      .catch((error) => {
        console.log(error);
        throw(error)
      });
  }
}

async function updateData(c, user, counter, cNumb){
  set(ref(db, 'CommentOn/' + `comment${counter}/` +`${cNumb}`), {
    content: c, 
    Name: user
  }).then(() => {
    console.log('Successfully update');
    return "done"
  }).catch((error) => {
    alert('Unsuccessfull');
    console.log(error);
    return "fail"
  })
}

//retrieve data
function retData(counter) {
  const dbRef = ref(db);

  return new Promise((resolve, reject) => {
    get(child(dbRef, 'CommentOn/' + `comment${counter}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          var result = snapshot.val();
          resolve(result);
        } else {
          console.log("Data doesn't exist");
          resolve(null);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

function removeData(u, c, p, counter, cNumb){
  remove(ref(db, 'CommentOn/' + `comment${counter}/` +`${cNumb}`))
  .then(() => {
    console.log('Successfully delete');
  }).catch((error) => {
    alert('Unsuccessfull');
    console.log(error);
  })
}

function LNSLocal(name='var name', isSave=false, item, isJson=false) {
  if (!isSave){
    var load = localStorage[name];
    if (load) return load
    else return false;
  } else {
    isJson? localStorage[name] = JSON.stringify(item) : localStorage[name] = item.toString();
  }
}

commentBtn.addEventListener('click', function(){
  alert("nigga")
  sendComment()
});
commentIco.addEventListener('click', loadComment);
commentBtn.addEventListener('press', sendComment);
loginButton.addEventListener('click', () => {login()})
usernameInput.addEventListener("keypress", function (params) {
  if (params.code == 'Enter') login()
})
commentContent.addEventListener("keypress", function (params) {
  if (params.code == 'Enter') sendComment()
})

function sendComment(){
  txtCount = LNSLocal('txtCount') ? JSON.parse(LNSLocal('txtCount')) : 0; //count txt var, cause it was an array

  var text = document.getElementById('insertText');
  var textValue = text.value;
  var keys = Object.keys(username);
  var firstKey = keys[0];

  const tagging = textValue.match(/(?:^)@(\w+)/i)
  const comment = tagging ? `<b>${tagging[0]}</b> ${textValue.replace(tagging[0], '')}` : textValue;

  if (text.value.replace(/\s/g, '')) {
    addData(firstKey, encodeURIComponent(comment), username[firstKey], txtCount, allCommentCount)
    text.value = '';
    loadComment()
  }
}

// it is what it is


async function deleteComment(e){
  var numbParent = e.id; //it result: A{number}
  var parent = e.parentNode
  var usernameKey = Object.keys(username)[0]
  deleting = true;

  parent.style.transition = ".5 ease"
  parent.style.opacity = "0.5"
  parent.style.transition = "none"
  await updateData('[deleted]', usernameKey ,txtCount, numbParent[1])

  setTimeout(() => {
    parent.remove();
    deleting = false;
    // alert("deleted");
  }, 2000);

  
}

function loadComment() {
  var a = document.querySelector('.load')
  if (a) a.style.display= "block"
  txtCount = LNSLocal('txtCount') ? JSON.parse(LNSLocal('txtCount')) : 0; //count txt var, cause it was an array
  allCommentCount = 0;

  var toDelete = document.querySelectorAll('.comment')
  for (var i=0; i < toDelete.length; i++){
    var current = toDelete[i];
    current.parentNode.removeChild(current)
  }

  var loadComment = retData(txtCount)
  .then((c)=> {
      for (var numb in c) {
        if (c.hasOwnProperty(numb) && c[numb].hasOwnProperty('content') && c[numb].content != "[deleted]"){
          allCommentCount = Object.keys(c).length;
          const currentObject = c[numb];
          
          const content = currentObject.content
          const name = currentObject.Name;
          const profilePic = currentObject.profilePic;

          var commentDiv = document.createElement('div');
          commentDiv.className = 'comment';

          // Create the profile picture div
          var ppDiv = document.createElement('div');
          // var pp = getRandomInt(1, 12).toString()
          ppDiv.className = 'pp';
          ppDiv.style.backgroundImage = `url('../Image/PP/${profilePic}.png')`;

          // Create the text div
          var textDiv = document.createElement('div');
          textDiv.className = 'text';

          // Create the p for username
          var usernameP = document.createElement('p');
          usernameP.textContent = name;
          usernameP.onclick = function () {tagPerson(this)}

          // Create the paragraph for comment text
          var commentP = document.createElement('p');
          commentP.textContent = ''
          commentP.innerHTML = decodeURIComponent(content);
          commentP.onclick = function () {tagPerson(this.parentNode.firstChild)}

          // Append paragraphs to the text div
          textDiv.appendChild(usernameP);
          textDiv.appendChild(commentP);

          // Create the heart icon
          var heartIcon = document.createElement('i');
          if (name == Object.keys(username)[0]) {
            heartIcon.className = 'fa-solid fa-trash-can';
            heartIcon.id = `A${numb}`;
            heartIcon.onclick = function () {
              if (!deleting) deleteComment(this)
            }
          }
          else heartIcon.className = 'fa-solid fa-heart';

          // Append all elements to the main comment div
          commentDiv.appendChild(ppDiv);
          commentDiv.appendChild(textDiv);
          commentDiv.appendChild(heartIcon);

          // Append the comment div to the container
          var commentContainer = document.querySelector('.commentPlaceholder');
          commentContainer.appendChild(commentDiv);
          
          // allCommentCount++;
    }}
    
    var a = document.querySelector('.load')
    if (a) a.style.display = "none"

    })
  .catch(error => console.error(error));
  

}