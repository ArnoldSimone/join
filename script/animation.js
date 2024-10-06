function animationStartCheck() {
  if (!sessionStorage.getItem("animation")) {
    animationStart();
  } else {
    stoppAnimation();
  };
}


function animationStart() {
  document.getElementById('animation').classList.add('animation');
  document.getElementById('content').classList.add('animation-content');
  setTimeout(() => {
    sessionStorage.setItem("animation", "true");
    loginShow();
  }, 2000);
}


function loginShow() {
  document.getElementById('login-header').classList.remove('d-none');
  document.getElementById('login').classList.remove('d-none'); 
  document.getElementById('info-notice').classList.remove('d-none');
}


function stoppAnimation() {
  document.getElementById('logo').src = '../assets/img/logo_blue.png';
  document.getElementById('animation').classList.add('animation-stopped');
  document.getElementById('content').classList.add('animation-content');
  loginShow();
}