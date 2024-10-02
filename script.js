function validateForm() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let passwordConfirm = document.getElementById('passwordConfirm').value;
  let checkbox = document.getElementById('checkbox').checked;
  if (name && email && password && passwordConfirm && checkbox) {
    document.getElementById("registrationButton").disabled = false;
  } else {
    document.getElementById("registrationButton").disabled = true;
  }
}

async function registrationUser() {
  checkPasswort();
}

function checkPasswort() {  
  let password = document.getElementById('password').value;
  let passwordConfirm = document.getElementById('passwordConfirm').value;
  if (password === passwordConfirm) {    
      postRegistrationUser();
    } else {
      passwordDontMatch();
    }
}

function passwordDontMatch() {
  document.getElementById('error').classList.add('msg-span');
  document.getElementById('inputPassword').classList.add('msg-box');
  document.getElementById('inputPasswordConfirm').classList.add('msg-box');
  document.getElementById('error').classList.remove('d-none');
  document.getElementById("registrationButton").disabled = true;
}

function resetInput() {
  document.getElementById('error').classList.remove('msg-box');
  document.getElementById('inputPassword').classList.remove('msg-box');
  document.getElementById('inputPasswordConfirm').classList.remove('msg-box');
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
    resetInput();
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