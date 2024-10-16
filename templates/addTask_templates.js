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
        <li id="subtask-${subtaskId}" class="subtask-item" onmouseover="showButtons(${subtaskId})" onmouseout="hideButtons(${subtaskId})">
            <span id="subtask-text-${subtaskId}">${subtaskText}</span>
            <span class="subtask-buttons" id="subtask-buttons-${subtaskId}" style="display: none;">
                <button class="subtask-button" type="button" onclick="editSubtask(${subtaskId})"><img src="../assets/img/edit.png" alt=""></button>
                 <div class="small-break-between"></div>
                <button class="subtask-button" type="button" onclick="deleteSubtask(${subtaskId})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
            </span>
        </li>
    `;
}


function generateEditSubtaskHTML(index, title) {
    return `
        <div class="subtask-edit-container">
            <input type="text" id="edit-subtask-input" value="${title}" class="edit-subtask-input">
            <div class="subtask-buttons" style="display: inline;">
                <button class="subtask-button edit-check" onclick="saveSubtask(${index})"><img src="../assets/img/check.png" alt="Save"></button>
                <div class="small-break-between"></div>
                <button class="subtask-button" onclick="deleteSubtask(${index})"><img src="../assets/img/dustbinDark.svg" alt="Delete"></button>
            </div>
        </div>
    `;
}


function generateSubtaskItemHTML(title, index) {
    return `
        <li class="subtask-item" onmouseover="showButtons(${index})" onmouseout="hideButtons(${index})">
            ${title}
            <span id="subtask-buttons-${index}" class="subtask-buttons" style="display:none;">
                <button class="subtask-button" onclick="editSubtask(${index})"><img src="../assets/img/edit.png" alt=""></button>
                 <div class="small-break-between"></div>
                <button class="subtask-button" onclick="deleteSubtask(${index})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
            </span>
        </li>
    `;
}