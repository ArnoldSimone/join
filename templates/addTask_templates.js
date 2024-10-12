function generateCreateOption(name, initial, color, id, checked) {
  return `
    <div class="assigned-content">
        <div class="assigned-user">
            <div class="assigned-initital d-flex" style="background-color: ${color};">
                <p>${initial}</p>
            </div>
            <p>${name}</p>
        </div>
        <div id="userCheckbox">
            <input type="checkbox" data-user-id="${id}" id="checkbox-${id}" ${checked}>
            <img onclick="selectionUser('${id}')" class="user-checkbox" src="../assets/img/checkbox.png">
        </div>
    </div>
  `;
}


function generateSelectedUsersHTML(initial, color) {
    return `
        <div class="assigned-initital d-flex" style="background-color: ${color};">
            <p>${initial}</p>
        </div>
    `;
}