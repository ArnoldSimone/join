function animationStartCheck() {
  if (!sessionStorage.getItem("animation")) {
    startAnimation();
  } else {
    stoppAnimation();
  };
}


function startAnimation() {
  if (window.innerWidth > 1000) {
    desktopAnimation();
  } else {
    mobileAnimation();
  }
}


function desktopAnimation() {
  document.getElementById('animation').classList.add('animation');
  document.getElementById('content').classList.add('animation-content');
  setTimeout(() => {
    sessionStorage.setItem("animation", "true");
    loginShow();
  }, 1500);
}


function mobileAnimation() {
  document.getElementById('animation').classList.add('animation-mobil');
  document.getElementById('content').classList.add('animation-content');
  setTimeout(() => {
    sessionStorage.setItem("animation", "true");
    loginShow();
  }, 1500);
}


function loginShow() {
  document.getElementById('login-header').classList.remove('d-none');
  document.getElementById('login').classList.remove('d-none'); 
  document.getElementById('info-notice').classList.remove('d-none');
}


function stoppAnimation() {
  if (window.innerWidth > 1000) {
    desktopVersion();
  } else {
    mobileVersion();
  }
  loginShow();
}


function checkWindowWitdh() {
  let width = window.innerWidth;
  console.log(width);
  
  if (width > 1000) {
    desktopVersion();
  } else {
    mobileVersion();
  }
  loginShow();
}


function desktopVersion() {
  document.getElementById('logo').src = '../assets/img/logo_blue.png';
  document.getElementById('animation').classList.add('animation');
  document.getElementById('animation').classList.add('animation-stopped');
  document.getElementById('content').classList.add('animation-content');
}


function mobileVersion() {
  document.getElementById('logo').src = '../assets/img/logo_blue.png';
  document.getElementById('animation').classList.add('animation-mobil-stopped');
  document.getElementById('content').classList.remove('animation-content');
  document.getElementById('content').classList.add('animation-content-mobil');
}