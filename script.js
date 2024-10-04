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
  }
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


function resetInput() {
  document.getElementById('error').classList.remove('msg-box');
  document.getElementById('inputPassword').classList.remove('msg-box');
  document.getElementById('inputConfirmPassword').classList.remove('msg-box');
  document.getElementById('error').classList.add('d-none');
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
  document.getElementById('popUp').classList.remove('d-none');
  setTimeout(() => {
    loginInForwarding();
  }, 1000);
}


function loginInForwarding() {
  window.location.href = '../index.html';
}


function changePasswortImage() {
  let container = document.getElementById('inputPassword');
  let input = document.getElementById('password').value;
  let image = document.getElementById('passwordImage');
  if (input.length > 0) {
    container.style.borderColor = 'var(--bluehover)';
    image.src="../assets/icon/visibility_off.png";
  } else {
    container.style.borderColor = 'lightgrey';
    image.src="../assets/icon/lock.svg";
  };
}


function changePasswortConfirmImage() {
  let container = document.getElementById('inputConfirmPassword');
  let input = document.getElementById('confirmPassword').value;  
  let image = document.getElementById('confirmPasswordImage');
  if (input.length > 0) {
    container.style.borderColor = 'var(--bluehover)';
    image.src="../assets/icon/visibility_off.png";
  } else {
    container.style.borderColor = 'lightgrey';
    image.src="../assets/icon/lock.svg";
  };
}


function togglePasswordVisibility(id) {
  let input = document.getElementById(id);
  let passwordImage = document.getElementById('passwordImage');
  let confirmImage = document.getElementById('confirmPasswordImage');
  if (input.id === "password" && input.type == 'password' && passwordImage.src.includes('visibility_off.png')) {
    changeTypeAndImage(input, passwordImage);
  } else { 
    if (input.id === "confirmPassword" && input.type == 'password' && confirmImage.src.includes('visibility_off.png')) {
    changeTypeAndImage(input, confirmImage);
    } else {
      resetInputPasswort(input);
    };
  };
}


function changeTypeAndImage(input, image) {
  input.type = "text";
  input.src ="none";
  image.src="../assets/icon/visibility.png";
}


function resetInputPasswort(input) {
  let passwordImage = document.getElementById('passwordImage');
  let confirmImage = document.getElementById('confirmPasswordImage');
  input.type = "password";
  if (input.id == 'password') {
    passwordImage.src="../assets/icon/visibility_off.png";
  } if (input.id == 'confirmPassword') {
    confirmImage.src="../assets/icon/visibility_off.png";
  };
}