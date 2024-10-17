// /**
//  * Initializes the page by loading the HTML content and setting the active menu.
//  * This function is called when the page is loaded to ensure the user sees the correct view.
//  */
// async function initPage() {
//   await includeHTML();
//   setActiveMenuBasedOnPath();
// }


// /**
//  * Sets the active menu based on the current path of the page.
//  * If no active menu is stored in local storage, it is determined 
//  * based on the current URL.
//  */
// function setActiveMenuBasedOnPath() {
//   const currentPath = window.location.pathname;
//   let activeMenuId = localStorage.getItem('activeMenu');
//   if (!activeMenuId) {
//     if (currentPath.includes('summary.html')) {
//       activeMenuId = 'menu-summary';
//     } else if (currentPath.includes('addTask.html')) {
//       activeMenuId = 'menu-addTask';
//     } else if (currentPath.includes('board.html')) {
//       activeMenuId = 'menu-board';
//     } else if (currentPath.includes('contacts.html')) {
//       activeMenuId = 'menu-contacts';
//     };
//     localStorage.setItem('activeMenu', activeMenuId);
//   };
//   setActiveMenu(activeMenuId);
// }


// /**
//  * Sets the active menu item based on the provided ID.
//  * Removes the "active" class from all menu items and adds 
//  * it to the active menu item.
//  * 
//  * @param {string} activeId - The ID of the active menu item.
//  * @returns {void}
//  */
// function setActiveMenu(activeId) {
//   const menuItems = document.querySelectorAll('.menu-content');
//   menuItems.forEach(item => {
//     item.classList.remove('active');
//   });
//   const activeMenuItem = document.getElementById(activeId);
//   if (activeMenuItem) {
//     activeMenuItem.classList.add('active');
//   };
// }


// /**
//  * Adds click listeners to all menu items to update the active menu 
//  * on click and store it in local storage.
//  */
// function setupMenuClickListeners() {
//   const menuLinks = document.querySelectorAll('.menu-content');
//   menuLinks.forEach(menu => {
//     menu.addEventListener('click', function () {
//       const menuId = this.id;
//       setActiveMenu(menuId);
//       localStorage.setItem('activeMenu', menuId);
//     });
//   });
// }


// /**
//  * Called when the window is loaded to initialize the page 
//  * and set up the click listeners for the menu.
//  */
// window.onload = async function() {
//   await initPage();
//   setupMenuClickListeners();
// }