/**
 * Generates the HTML for a user option in the assignment selection.
 * @param {string} name - The name of the user.
 * @param {string} initial - The initials of the user.
 * @param {string} color - The background color for the initials.
 * @param {string} id - The unique identifier for the user.
 * @param {boolean} checked - Indicates if the checkbox should be checked.
 */
function generateCreateOption(name, initial, color, id, checked) {
  return `
    <div class="assigned-content" id="assigned-content-${id}" onclick="selectionUser('${id}')" style="${checked ? 'background-color: lightblue;' : ''}">
        <div class="assigned-user">
            <div class="assigned-initital d-flex" style="background-color: ${color};">
                <p>${initial}</p>
            </div>
            <p>${name}</p>
        </div>
        <div id="userCheckbox">
            <input type="checkbox" data-user-id="${id}" id="checkbox-${id}" ${checked} onclick="event.stopPropagation();">
            <img onclick="event.stopPropagation(); selectionUser('${id}')" class="user-checkbox" src="../assets/img/checkbox.png">
        </div>
    </div>
  `;
}



/**
 * Generates the HTML for displaying selected users' initials.
 * @param {string} initial - The initials of the user.
 * @param {string} color - The background color for the initials.
 */
function generateSelectedUsersHTML(initial, color) {
    return `
        <div class="assigned-initital d-flex" style="background-color: ${color};">
            <p>${initial}</p>
        </div>
    `;
}


/**
 * Generates the HTML for displaying extra users in the assignment selection.
 * @param {number} extraCount - The number of additional selected users.
 */
function generateExtraUsersHTML(extraCount) {
    return `
        <div class="assigned-initital d-flex extra-contacts">
            <p class="extra-contacts-text">+${extraCount}</p>
        </div>
    `;
}


/**
 * Generates the HTML for a subtask item.
 * @param {number} subtaskId - The unique identifier for the subtask.
 * @param {string} subtaskText - The text description of the subtask.
 */
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


/**
 * Generates the HTML for the edit subtask input and buttons.
 * @param {number} index - The index of the subtask being edited.
 * @param {string} title - The current title of the subtask.
 */
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


/**
 * Generates the HTML for a subtask item with its title and index.
 * @param {string} title - The title of the subtask.
 * @param {number} index - The index of the subtask.
 */
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