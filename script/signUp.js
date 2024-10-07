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


function buttonAktiv() {
  document.getElementById("registrationButton").classList.remove('disable-btn');
  document.getElementById("registrationButton").classList.add('sign-up-btn');
  document.getElementById("registrationButton").disabled = false;
}


function buttonNotAktiv() {
  document.getElementById("registrationButton").classList.add('disable-btn');
  document.getElementById("registrationButton").classList.remove('sign-up-btn');
  document.getElementById("registrationButton").disabled = true;
}


function validateInputValue() {
  let password = document.getElementById('password');
  let confirmPassword = document.getElementById('confirmPassword');
  if (password.value == 0 && confirmPassword.value == 0) {
    resetInput();
  };
}


function resetInput() {
  document.getElementById('error').classList.remove('msg-box');
  document.getElementById('inputPassword').classList.remove('msg-box');
  document.getElementById('inputConfirmPassword').classList.remove('msg-box');
  document.getElementById('error').classList.add('d-none');
}


function passwortInput() {
  let container = document.getElementById('inputPassword');
  let input = document.getElementById('password');
  let image = document.getElementById('passwordImage');
  determineInputValue(container, input, image);
}


function confirmInput() {
  let container = document.getElementById('inputConfirmPassword');
  let input = document.getElementById('confirmPassword');  
  let image = document.getElementById('confirmPasswordImage');
  determineInputValue(container, input, image);
}


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


function standardInput(container, input, image) {
  input.type = "password";
  image.src = "../assets/icon/lock.svg";
  container.style.borderColor = 'lightgrey';
}


function passwordInput(container, image) {
  container.style.borderColor = 'var(--bluehover)';
  image.src = "../assets/icon/visibility_off.png";
}


function textInput(container, image) {
  container.style.borderColor = 'var(--bluehover)';
  image.src = "../assets/icon/visibility.png";
}


function togglePasswordVisibility(id) {
  let input = document.getElementById(id);
  let passwordImage = document.getElementById('passwordImage');
  let confirmImage = document.getElementById('confirmPasswordImage');
  currentStatus(input, passwordImage, confirmImage);
}


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


function changeTypeAndImage(input, image) {
  input.type = "text";
  image.src="../assets/icon/visibility.png";
}


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


async function registrationUser() {
  checkPasswort();
}


function checkPasswort() {  
  let password = document.getElementById('password').value;
  let confirmPassword = document.getElementById('confirmPassword').value;
  if (password === confirmPassword) {    
      postRegistrationUser();
    } else {
      passwordDontMatch();
    };
}


function passwordDontMatch() {
  document.getElementById('error').classList.add('msg-span');
  document.getElementById('inputPassword').classList.add('msg-box');
  document.getElementById('inputConfirmPassword').classList.add('msg-box');
  document.getElementById('error').classList.remove('d-none');
  buttonNotAktiv();
}


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


function registrationSuccesful() {
  document.getElementById('popUp').classList.remove('d-none');
  setTimeout(() => {
    loginInForwarding();
  }, 1000);
}


function loginInForwarding() {
  window.location.replace('../index.html');
}