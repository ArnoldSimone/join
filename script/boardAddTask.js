
function addTaskBoard() {

    console.log("funktion geht");

    fetch('formAddTask.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('overlay-board-add-Task').innerHTML = data;
        });


}
