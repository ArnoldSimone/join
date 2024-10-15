/**
 * Validates the form by checking if all fields are filled out and if the checkbox is checked.
 * Activates or deactivates the button based on the validation.
 */
function validateForm() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let confirmPassword = document.getElementById('confirmPassword').value;
  let checkbox = document.getElementById('checkbox').checked;
  if (name && email && password && confirmPassword && checkbox) {
    buttonAktiv();
  } else {
    buttonNotAktiv();
  };
}


/**
 * Activates the registration button by changing its style and enabling functionality.
 */
function buttonAktiv() {
  document.getElementById("registrationButton").classList.remove('disable-btn');
  document.getElementById("registrationButton").classList.add('sign-up-btn');
  document.getElementById("registrationButton").disabled = false;
}


/**
 * Deactivates the registration button and changes its style to make it unusable.
 */
function buttonNotAktiv() {
  document.getElementById("registrationButton").classList.add('disable-btn');
  document.getElementById("registrationButton").classList.remove('sign-up-btn');
  document.getElementById("registrationButton").disabled = true;
}


/**
 * Validates the password input. If both password fields are empty, the input is reset.
 */
function validateInputValue() {
  let password = document.getElementById('password');
  let confirmPassword = document.getElementById('confirmPassword');
  if (password.value == 0 && confirmPassword.value == 0) {
    resetInput();
  };
}


/**
 * Resets the input fields for password and error messages and removes the error display.
 */
function resetInput() {
  document.getElementById('error').classList.remove('msg-box');
  document.getElementById('inputPassword').classList.remove('msg-box');
  document.getElementById('inputConfirmPassword').classList.remove('msg-box');
  document.getElementById('error').classList.add('d-none');
}


/**
 * Handles the visibility and layout of the password input field.
 */
function passwortInput() {
  let container = document.getElementById('inputPassword');
  let input = document.getElementById('password');
  let image = document.getElementById('passwordImage');
  determineInputValue(container, input, image);
}


/**
 * Handles the visibility and layout of the confirm password input field.
 */
function confirmInput() {
  let container = document.getElementById('inputConfirmPassword');
  let input = document.getElementById('confirmPassword');  
  let image = document.getElementById('confirmPasswordImage');
  determineInputValue(container, input, image);
}


/**
 * Determines the input state and changes the input type (password/text) and icon accordingly.
 * @param {HTMLElement} container - The container of the input field.
 * @param {HTMLInputElement} input - The input field.
 * @param {HTMLImageElement} image - The input field's icon.
 */
function determineInputValue(container, input, image) {
  if (input.value == 0) {
    standardInput(container, input, image);
  } else { 
    if (input.type == "password" && input.value > 0) {
      passwordInput(container, image);
    } else{ 
      if (input.type == "text" && input.value > 0) {
        textInput(container, image);
      };
    };
  };
}


/**
 * Resets the input field to its default state (password type, default icon).
 * @param {HTMLElement} container - The container of the input field.
 * @param {HTMLInputElement} input - The input field.
 * @param {HTMLImageElement} image - The input field's icon.
 */
function standardInput(container, input, image) {
  input.type = "password";
  image.src = "../assets/icon/lock.svg";
  container.style.borderColor = 'lightgrey';
}


/**
 * Sets the input field to password state (blue border, "visibility_off" icon).
 * @param {HTMLElement} container - The container of the input field.
 * @param {HTMLImageElement} image - The input field's icon.
 */
function passwordInput(container, image) {
  container.style.borderColor = 'var(--bluehover)';
  image.src = "../assets/icon/visibility_off.png";
}


/**
 * Sets the input field to text state (blue border, "visibility" icon).
 * @param {HTMLElement} container - The container of the input field.
 * @param {HTMLImageElement} image - The input field's icon.
 */
function textInput(container, image) {
  container.style.borderColor = 'var(--bluehover)';
  image.src = "../assets/icon/visibility.png";
}


/**
 * Toggles the visibility of the password field based on the current state.
 * @param {string} id - The ID of the input field.
 */
function togglePasswordVisibility(id) {
  let input = document.getElementById(id);
  let passwordImage = document.getElementById('passwordImage');
  let confirmImage = document.getElementById('confirmPasswordImage');
  currentStatus(input, passwordImage, confirmImage);
}


/**
 * Checks the current status of the password input and changes the icon and input type accordingly.
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} passwordImage - The icon for the password field.
 * @param {HTMLImageElement} confirmImage - The icon for the confirm password field.
 */
function currentStatus(input, passwordImage, confirmImage) {
  if (input.value == 0) {
    return;
  } else {
    if (input.id === "password" && input.type == 'password' && passwordImage.src.includes('visibility_off.png')) {
      changeTypeAndImage(input, passwordImage);
    } else { 
      if (input.id === "confirmPassword" && input.type == 'password' && confirmImage.src.includes('visibility_off.png')) {
        changeTypeAndImage(input, confirmImage);
      } else {
        resetTypeAndImage(input);
      };
    };
  };
}


/**
 * Changes the input type of the password field to text and updates the icon to "visibility".
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} image - The input field's icon.
 */
function changeTypeAndImage(input, image) {
  input.type = "text";
  image.src="../assets/icon/visibility.png";
}


/**
 * Resets the input type of the password field to "password" and updates the icon to "visibility_off".
 * @param {HTMLInputElement} input - The password or confirm password input field.
 */
function resetTypeAndImage(input) {
  let passwordImage = document.getElementById('passwordImage');
  let confirmImage = document.getElementById('confirmPasswordImage');
  if (input.id == 'password') {
    input.type = "password";
    passwordImage.src="../assets/icon/visibility_off.png";
  } else {
    if (input.id == 'confirmPassword') {
      input.type = "password";
      confirmImage.src="../assets/icon/visibility_off.png";
    };
  };
}


/**
 * Checks if the password and confirm password match and proceeds with registration.
 */
async function registrationUser() {
  checkPasswort();
}


/**
 * Checks if the entered password matches the confirm password.
 * If they match, the registration process continues, otherwise an error message is displayed.
 */
function checkPasswort() {  
  let password = document.getElementById('password').value;
  let confirmPassword = document.getElementById('confirmPassword').value;
  if (password === confirmPassword) {    
      postRegistrationUser();
    } else {
      passwordDontMatch();
    };
}


/**
 * Displays an error message when the password and confirm password do not match.
 */
function passwordDontMatch() {
  document.getElementById('error').classList.add('msg-span');
  document.getElementById('inputPassword').classList.add('msg-box');
  document.getElementById('inputConfirmPassword').classList.add('msg-box');
  document.getElementById('error').classList.remove('d-none');
  buttonNotAktiv();
}


/**
 * Sends the user's registration data to the database.
 * @async
 */
async function postRegistrationUser() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  try {
    await postToDatabase("users",  user = {name: name, email: email, password: password});
  } catch (error) {
    console.error('Registration failed', error);    
  };
  await registrationSuccesful();
}


/**
 * Displays a success message when registration is successful.
 */
function registrationSuccesful() {
  document.getElementById('popUp').classList.remove('d-none');
  setTimeout(() => {
    loginInForwarding();
  }, 1000);
}


function loginInForwarding() {
  window.location.replace('../index.html');
}