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


function generateSubtaskHTML(subtaskId, subtaskText) {
    return `
        <li id="subtask-${subtaskId}">
            <span id="subtask-text-${subtaskId}">${subtaskText}</span>
            <input type="text" id="edit-subtask-${subtaskId}" class="edit-subtask-input" value="${subtaskText}" style="display: none;">
            <button type="button" onclick="editSubtask(${subtaskId})"><img src="../assets/img/edit.png" alt=""></button>
            <button type="button" onclick="deleteSubtask(${subtaskId})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
            <button type="button" id="save-${subtaskId}" style="display: none;" onclick="saveSubtask(${subtaskId})">Save</button>
        </li>
    `;
}


function generateEditSubtaskHTML(index, title) {
    return `
        <input type="text" id="edit-subtask-input" value="${title}" class="edit-subtask-input">
        <button onclick="saveSubtask(${index})"><img src="../assets/img/check.png" alt=""></button>
        <button onclick="cancelEdit(${index})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
    `;
}

function generateSubtaskItemHTML(title, index) {
    return `
        <li class="subtask-item" onmouseover="showButtons(${index})" onmouseout="hideButtons(${index})">
            ${title}
            <span id="subtask-buttons-${index}" class="subtask-buttons" style="display:none;">
                <button onclick="editSubtask(${index})"><img src="../assets/img/edit.png" alt=""></button>
                <button onclick="deleteSubtask(${index})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
            </span>
        </li>
    `;
}