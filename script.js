/**
 * Global variable storing user information.
 * @type {Array<Object>}
 */
let users = [];


/**
 * Checks the entered password and changes the border color of the input field based on its content.
 * If the password is more than 0 characters long, the border color changes to 'bluehover', otherwise it stays grey.
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


/**
 * Performs the login process by loading user data.
 */
function login() {
  loadData();
}


/**
 * Asynchronously loads user data from a database, stores it in local storage, and filters the users.
 * @async
 */
async function loadData() {
  try {
    let allUsers = await loadFromDatabase("/users");
    localStorage.setItem('users', JSON.stringify(allUsers));
    allUsersFilter(allUsers);
  } catch (error) {
    notRegistered();
  };
}



/**
 * Displays an error message if a user is not registered.
 */
function notRegistered() {
  document.getElementById('notRegistered').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('password-content').classList.add('msg-box');
  document.getElementById('notRegistered').classList.remove('d-none');
}


/**
 * Filters the user data from the database and adds it to the global `users` list.
 * @param {Array<Object>} allUsers - Array of user objects loaded from the database.
 */
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


/**
 * Checks if the entered login data matches the stored user data.
 * If the data matches, the user is redirected to the summary page.
 */
function checkLoginData() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let user = users.find(users => users.email == email && users.password == password);
  console.log(user);
  
  if (user) {
    window.location.replace('/html/summary.html');
  } else {
    loginDataDontMatch();
  };
}


/**
 * Displays an error message if the entered login data does not match.
 */
function loginDataDontMatch() {
  document.getElementById('error').classList.add('msg-span');
  document.getElementById('email-content').classList.add('msg-box');
  document.getElementById('password-content').classList.add('msg-box');
  document.getElementById('error').classList.remove('d-none');
}


/**
 * Changes the image of the password field based on the current state of the password (empty or not empty).
 */
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


/**
 * Toggles the visibility of the password and changes the image accordingly.
 */
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


/**
 * Changes the password field type to 'text' and the image to the visible password icon.
 * @param {HTMLInputElement} input - The password field element.
 * @param {HTMLImageElement} image - The image element representing the visibility state.
 */
function changeTypeAndImage(input, image) {
  input.type = "text";
  image.src = "../assets/icon/visibility.png";
}


/**
 * Resets the password field type to 'password' and changes the image to the hidden password icon.
 * @param {HTMLInputElement} input - The password field element.
 * @param {HTMLImageElement} image - The image element representing the visibility state.
 */
function resetPasswort(input, image) {
  input.type = "password";
  image.src = "../assets/icon/visibility_off.png";
}


/**
 * Stores the user's email in local storage if the "Remember me" option is selected.
 */
function saveRemember() {
  let email = document.getElementById('email').value;
  localStorage.setItem("userEmail", email);
}


/**
 * Retrieves the saved email from local storage and sets it in the email field.
 */
function getRemember() {
  let email = localStorage.getItem("userEmail");
  document.getElementById('email').value = email;
}