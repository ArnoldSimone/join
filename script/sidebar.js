/**
 * Sets the background color of the menu based on the current URL.
 * Calls the appropriate function to change the background color 
 * for the corresponding menu item.
 */
function menuColor() {
  const currentURL = window.location.href;
  if (currentURL === 'http://127.0.0.1:5502/html/summary.html') {
    summaryBackgroundColor();
  } else if (currentURL === 'http://127.0.0.1:5502/html/addTask.html') {
    addTaskBackgroundColor();
  } else if (currentURL === 'http://127.0.0.1:5502/html/board.html') {
    boardBackgroundColor();
  } else if (currentURL === 'http://127.0.0.1:5502/html/contacts.html') {
    contactsBackgroundColor();
  };
}


/**
 * Toggles the 'active' class on the summary menu item.
 * Adds the 'active' class if it is not present, and removes it if it is present.
 */
function summaryBackgroundColor() {
  let menuColor = document.getElementById('menu-summary');
  if (menuColor.classList.contains('active')) {
    menuColor.classList.remove('active');
  } else {
    menuColor.classList.add('active');
  };
}


/**
 * Toggles the 'active' class on the addTask menu item.
 * Adds the 'active' class if it is not present, and removes it if it is present.
 */
function addTaskBackgroundColor() {
  let menuColor = document.getElementById('menu-addTask');
  if (menuColor.classList.contains('active')) {
    menuColor.classList.remove('active');
  } else {
    menuColor.classList.add('active');
  };
}


/**
 * Toggles the 'active' class on the board menu item.
 * Adds the 'active' class if it is not present, and removes it if it is present.
 */
function boardBackgroundColor() {
  let menuColor = document.getElementById('menu-board');
  if (menuColor.classList.contains('active')) {
    menuColor.classList.remove('active');
  } else {
    menuColor.classList.add('active');
  };
}


/**
 * Toggles the 'active' class on the contacts menu item.
 * Adds the 'active' class if it is not present, and removes it if it is present.
 */
function contactsBackgroundColor() {
  let menuColor = document.getElementById('menu-contacts');
  if (menuColor.classList.contains('active')) {
    menuColor.classList.remove('active');
  } else {
    menuColor.classList.add('active');
  };
}