let animation = document.getElementById('animation');


animation.addEventListener("animationend", (event) => {
  if (event.elapsedTime > 0.2) {
    console.log(event.elapsedTime);
    document.getElementById('login-header').classList.remove('d-none');
    document.getElementById('login').classList.remove('d-none'); 
    document.getElementById('info-notice').classList.remove('d-none');
  };
})