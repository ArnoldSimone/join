async function registrationUser() {
  checkPasswort();
}

function checkPasswort() {  
  let password = document.getElementById('password').value;
  let passwordConfirm = document.getElementById('passwordConfirm').value; 
  if (password === passwordConfirm) {
    checkPrivacyPolicy()
  } else {
   return;
  };
}

function checkPrivacyPolicy() {
  let check = document.getElementById('checkbox').checked;
  if (check == true) {
    postRegistrationUser();
  } else {
    return;
  };
}

async function postRegistrationUser() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  try {
    await postToDatabase("users", {user: {name: name, email: email, password: password}});
  } catch (error) {
    console.error('Registration failed', error);    
  };
 await registrationSuccesful();
}

function registrationSuccesful() {
  window.location.href = '../index.html';
}

function changePasswortImage() {
  let container = document.getElementById('inputPassword');
  let input = document.getElementById('password').value;
  let image = document.getElementById('passwordImage');
  if (input.length > 0) {
    container.style.borderColor = 'var(--bluehover)';
    image.src="../assets/icon/visibility_off.svg";
  } else {
    container.style.borderColor = 'lightgrey';
    image.src="../assets/icon/lock.svg";
  };
}

function changePasswortConfirmImage() {
  let container = document.getElementById('inputPasswordConfirm');
  let input = document.getElementById('passwordConfirm').value;  
  let image = document.getElementById('passwordConfirmImage');
  if (input.length > 0) {
    container.style.borderColor = 'var(--bluehover)';
    image.src="../assets/icon/visibility_off.svg";
  } else {
    container.style.borderColor = 'lightgrey';
    image.src="../assets/icon/lock.svg";
  };
}

function togglePasswordVisibility(id) {
  let password = document.getElementById(id);
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  };
}