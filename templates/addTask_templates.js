function generateCreateOption(name, initial, color, id) {
  return `
    <div class="assigned-content">
        <div class="assigned-user">
            <div class="assigned-initital d-flex" style="background-color: ${color};">
                <p>${initial}</p>
            </div>
            <p>${name}</p>
        </div>
        <div id="userCheckbox">
            <input type="checkbox">
            <img onclick="selectionUser('${id}')" class="user-checkbox">
        </div>
    </div>
  `;
}


function generateSearchHTML(name, initial, color, id) {
    return `
        <div class="assigned-content">
            <div class="assigned-user">
                <div class="assigned-initital d-flex" style="background-color: ${color};">
                    <p>${initial}</p>
                </div>
                <p>${name}</p>
            </div>
            <input onclick="selectionUser('${id}')" type="checkbox">
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