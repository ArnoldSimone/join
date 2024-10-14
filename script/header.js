function toggleUserMenu() {
  let userMenu = document.getElementById('userMenu');
  if (window.innerWidth > 1000) {
    userMenu.classList.toggle('d-none');
  } else {
    mobilMenu();
  }
}


function mobilMenu() {
  let userMobile = document.getElementById('userMobile');
  if (!userMobile.classList.contains('show-logout-mobile')) {
    openMobilMenu();
  } else {
    closeMobilMenu();
  }
}


function openMobilMenu() {
  userMobile.classList.remove('exit-logout-mobile');
  userMobile.classList.add('show-logout-mobile');
  userMobile.classList.remove('d-none');
}


function closeMobilMenu() {
  userMobile.classList.add('exit-logout-mobile');
  setTimeout(function() {
    userMobile.classList.add('d-none');
    userMobile.classList.remove('show-logout-mobile');
  }, 700);
}


function logOut() {
  window.location.replace('../index.html');
}