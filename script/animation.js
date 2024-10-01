let animation = document.getElementById('animation');
// let box = document.getElementById('stop');

animation.addEventListener("animationend", (event) => {
  if (event.elapsedTime > 0.2) {
    console.log(event.elapsedTime);
    document.getElementById('login-header').classList.remove('d-none');
    document.getElementById('login').classList.remove('d-none'); 
    document.getElementById('info-notice').classList.remove('d-none');
  };
  animation.style.zIndex = '-1';
})


// box.addEventListener('click', () => {
//     animation.pause();
// })

// function stopAnimation() {
//   document.getElementById('animation').classList.add('d-none');
//   console.log('passt');
//   box.style.animationPlayState = 'paused';
//   console.log('passt');
  
// }