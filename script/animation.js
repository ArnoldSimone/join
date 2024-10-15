/**
 * Checks whether the animation should start by verifying if it's already stored in the session.
 * Starts or stops the animation based on the result.
 */
function animationStartCheck() {
  if (!sessionStorage.getItem("animation")) {
    startAnimation();
  } else {
    stoppAnimation();
  };
}


/**
 * Starts the animation based on the window width. For larger screens, the desktop animation
 * is used, while for smaller screens, the mobile animation is started.
 */
function startAnimation() {
  if (window.innerWidth > 1000) {
    desktopAnimation();
  } else {
    mobileAnimation();
  };
}


/**
 * Runs the animation for desktop screens. After a delay of 1.5 seconds, the animation is 
 * stored in sessionStorage, and the login section is displayed.
 */
function desktopAnimation() {
  document.getElementById('animation').classList.add('animation');
  document.getElementById('content').classList.remove('animation-content-mobil');
  document.getElementById('content').classList.add('animation-content');
  setTimeout(() => {
    sessionStorage.setItem("animation", "true");
    loginShow();
  }, 1500);
}


/**
 * Runs the animation for mobile devices. After a delay of 1.5 seconds, the animation is 
 * stored in sessionStorage, and the login section is displayed.
 */
function mobileAnimation() {
  document.getElementById('animation').classList.add('animation-mobil');
  document.getElementById('content').classList.remove('animation-content');
  document.getElementById('content').classList.add('animation-content-mobil');
  setTimeout(() => {
    sessionStorage.setItem("animation", "true");
    loginShow();
  }, 1500);
}


/**
 * Displays the login section by making the relevant elements visible.
 */
function loginShow() {
  document.getElementById('login-header').classList.remove('d-none');
  document.getElementById('login').classList.remove('d-none'); 
  document.getElementById('info-notice').classList.remove('d-none');
}


/**
 * Stops the animation and displays the corresponding version (desktop or mobile) based on 
 * the window width. The login section is displayed after the stop.
 */
function stoppAnimation() {
  if (window.innerWidth > 1000) {
    desktopVersion();
  } else {
    mobileVersion();
  };
  loginShow();
}


/**
 * Checks the window width and displays either the desktop or mobile version.
 */
function checkWindowWitdh() {
  let width = window.innerWidth;
  if (width > 1000) {
    desktopVersion();
  } else {
    mobileVersion();
  };
}


/**
 * Sets the view and layout for desktop screens by adding or removing the appropriate 
 * classes and styles.
 */
function desktopVersion() {
  document.getElementById('logo').src = '../assets/img/logo_blue.png';
  document.getElementById('animation').classList.remove('animation-mobil');
  document.getElementById('animation').classList.remove('animation-mobil-stopped');
  document.getElementById('content').classList.remove('animation-content-mobil');
  document.getElementById('animation').classList.add('animation');
  document.getElementById('animation').classList.add('animation-stopped');
  document.getElementById('content').classList.add('animation-content');
  document.getElementById('content').classList.add('animation-content-img');
  loginShow();
}


/**
 * Sets the view and layout for mobile devices by adding or removing the appropriate 
 * classes and styles.
 */
function mobileVersion() {
  document.getElementById('logo').src = '../assets/img/logo_blue.png';
  document.getElementById('animation').classList.remove('animation-stopped');
  document.getElementById('content').classList.remove('animation-content');
  document.getElementById('animation').classList.add('animation-mobil-stopped');
  document.getElementById('content').classList.add('animation-content-mobil');
  loginShow();
}