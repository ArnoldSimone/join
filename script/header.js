/**
 * Toggles the user menu. For window widths greater than 1000 pixels, the menu is shown or hidden. 
 * For smaller screens, the mobile menu is opened.
 */
function toggleUserMenu() {
  let userMenu = document.getElementById('userMenu');
  if (window.innerWidth > 1000) {
    userMenu.classList.toggle('d-none');
  } else {
    mobilMenu();
  }
}


/**
 * Opens or closes the mobile user menu. If the menu is not visible, it opens; otherwise, it closes.
 */
function mobilMenu() {
  let userMobile = document.getElementById('userMobile');
  if (!userMobile.classList.contains('show-logout-mobile')) {
    openMobilMenu();
  } else {
    closeMobilMenu();
  }
}


/**
 * Opens the mobile user menu by removing and adding the appropriate classes.
 */
function openMobilMenu() {
  userMobile.classList.remove('exit-logout-mobile');
  userMobile.classList.add('show-logout-mobile');
  userMobile.classList.remove('d-none');
}


/**
 * Closes the mobile user menu by adding the exit class. 
 * After a delay of 700 milliseconds, the menu is hidden.
 */
function closeMobilMenu() {
  userMobile.classList.add('exit-logout-mobile');
  setTimeout(function() {
    userMobile.classList.add('d-none');
    userMobile.classList.remove('show-logout-mobile');
  }, 700);
}


/**
 * Logs out the user by redirecting to the login page.
 */
function logOut() {
  window.location.replace('../index.html');
}