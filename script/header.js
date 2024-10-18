// Retrieves the currently logged-in user from local storage and parses it from JSON.
let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));


/**
 * Executes `onloadFuncHeader` after the DOM has fully loaded.
 */
document.addEventListener("DOMContentLoaded", async function () {
  await onloadFuncHeader();
});


/**
 * Loads contacts from the database and initializes user initials.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function onloadFuncHeader() {
  let contactsData = await loadFromDatabase(`/contacts`);
  contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
  generateUserLetter();
}


/**
 * Displays the logged-in user's initials in the header.
 * Defaults to "G" if no user is logged in.
 */
function generateUserLetter() {
  let userInitialRef = document.getElementById('user-initial');
  if (loggedInUser) {
    let loggedInUserMail = loggedInUser.email;
    let contactDetails = contacts.find(c => c.email === loggedInUserMail);
    if (contactDetails) {
      userInitialRef.innerHTML = contactDetails.avatar.initials;
    }
  } else {
    userInitialRef.innerHTML.innerHTML = "G";
  }
}


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
  setTimeout(function () {
    userMobile.classList.add('d-none');
    userMobile.classList.remove('show-logout-mobile');
  }, 700);
}


/**
 * Logs out the user by redirecting to the login page.
 */
function logOut() {
  localStorage.clear();
  window.location.replace('../index.html');
}