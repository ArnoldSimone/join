let users = [];
let activeLink = null;


/**
 * 
 * 
 */
function validateLogin() {
  let inputColor = document.getElementById('password-content');
  let password = document.getElementById('password').value;
  if (password > 0) {
    inputColor.style.borderColor = 'var(--bluehover)';
  } else {
    inputColor.style.borderColor = 'lightgrey';
  };
}


function login() {
  loadData();
}


async function loadData() {
  try {
    let allUsers = await loadFromDatabase("/users");
    localStorage.setItem('users', JSON.stringify(allUsers));
    allUsersFilter(allUsers);
  } catch (error) {
    notRegistered();
  };
}



function notRegistered() {
  document.getElementById('notRegistered').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('password-content').classList.add('msg-box');
  document.getElementById('notRegistered').classList.remove('d-none');
}


function allUsersFilter(allUsers) {
  let userKeysArray = Object.entries(allUsers);
  for (let index = 0; index < userKeysArray.length; index++) {
    users.push(
      {
        email: userKeysArray[index][1].email,
        password: userKeysArray[index][1].password,
      }
    );
  };
  checkLoginData();
}


function checkLoginData() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let user = users.find(users => users.email == email && users.password == password);
  if (user) {
    window.location.replace('/html/summary.html');
  } else {
    loginDataDontMatch();
  };
}


function loginDataDontMatch() {
  document.getElementById('error').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('password-content').classList.add('msg-box');
  document.getElementById('error').classList.remove('d-none');
}


function changeImage() {
  let input = document.getElementById('password');
  let image = document.getElementById('image');
  if (input.value == 0) {
    input.type = "password";
    image.src = "../assets/icon/lock.svg";
  } else {
    if (input.type == "password" && input.value > 0) {
      image.src = "../assets/icon/visibility_off.png";
    } else {
      image.src = "../assets/icon/visibility.png";
    };
  };
}


function passwordVisibility() {
  let input = document.getElementById('password');
  let image = document.getElementById('image');
  if (input.value == 0) {
    return;
  } else {
    if (image.src.includes('visibility_off.png')) {
      changeTypeAndImage(input, image);
    } else {
      resetPasswort(input, image);
    };
  };
}


function changeTypeAndImage(input, image) {
  input.type = "text";
  image.src = "../assets/icon/visibility.png";
}


function resetPasswort(input, image) {
  input.type = "password";
  image.src = "../assets/icon/visibility_off.png";
}


function saveRemember() {
  let email = document.getElementById('email').value;
  localStorage.setItem("userEmail", email);
}


function getRemember() {
  let email = localStorage.getItem("userEmail");
  document.getElementById('email').value = email;
}