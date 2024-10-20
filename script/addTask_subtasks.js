/**
 * Gathers the subtasks from the subtask list.
 * @returns {Array} - An array of subtask objects.
 */
function gatherSubtasks() {
    const subtaskElements = document.querySelectorAll('#subtask-list li');
    return Array.from(subtaskElements).map(el => ({ completed: false, title: el.textContent.slice(2) }));
}


/**
 * Shows the action buttons for subtasks.
 */
function showSubtaskActionButtons() {
    document.getElementById('plus-icon').style.display = 'none';
    document.getElementById('subtask-action-buttons').style.display = 'inline-block';
}


/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
    let subtaskInput = document.getElementById('subtasks');
    subtaskInput.value = '';
    hideSubtaskActionButtons();
}


/**
 * Hides the action buttons for subtasks.
 */
function hideSubtaskActionButtons() {
    document.getElementById('plus-icon').style.display = 'inline-block';
    document.getElementById('subtask-action-buttons').style.display = 'none';
}


/**
 * Adds a new subtask to the list if the input is valid.
 */
function addSubtask() {
    let subtaskInput = getSubtaskInput();
    if (isValidSubtask(subtaskInput)) {
        let subtaskText = subtaskInput.value.trim();
        let subtaskId = subtasks.length;
        appendSubtaskToList(subtaskId, subtaskText);
        subtasks.push(createSubtask(subtaskId, subtaskText));
        subtaskInput.value = '';
        hideSubtaskActionButtons();
    }
}


/**
 * Adds the ability to add a subtask by pressing the Enter key.
 */
document.getElementById('subtasks').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addSubtask();
    }
});


/**
 * Retrieves the subtask input field element.
 * @returns {HTMLInputElement} - The subtask input element.
 */
function getSubtaskInput() {
    return document.getElementById('subtasks');
}


/**
 * Checks if the subtask input is valid.
 * @param {HTMLInputElement} subtaskInput - The subtask input field to validate.
 * @returns {boolean} - Returns true if valid; otherwise, false.
 */
function isValidSubtask(subtaskInput) {
    return subtaskInput && subtaskInput.value.trim() !== '';
}


/**
 * Appends a new subtask to the subtask list.
 * @param {number} subtaskId - The ID of the subtask to append.
 * @param {string} subtaskText - The text of the subtask to append.
 */
function appendSubtaskToList(subtaskId, subtaskText) {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML += generateSubtaskHTML(subtaskId, subtaskText);
}


/**
 * Creates a subtask object.
 * @param {number} subtaskId - The ID of the subtask.
 * @param {string} subtaskText - The title of the subtask.
 * @returns {Object} - The created subtask object.
 */
function createSubtask(subtaskId, subtaskText) {
    return { id: subtaskId, title: subtaskText, completed: false };
}


/**
 * Edits a specific subtask by its index. Closes the currently edited subtask if another one is clicked.
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    if (editingSubtaskIndex !== null && editingSubtaskIndex !== index) {
        renderSubtasks();
    }
    editingSubtaskIndex = index;

    const subtask = subtasks[index];
    let subtaskElement = document.querySelectorAll('#subtask-list li')[index];
    subtaskElement.classList.add('edit-mode');
    subtaskElement.innerHTML = generateEditSubtaskHTML(index, subtask.title);
}


/**
 * Saves changes made to a specific subtask.
 * @param {number} index - The index of the subtask to save.
 */
function saveSubtask(index) {
    let newTitle = document.getElementById('edit-subtask-input').value.trim();

    if (newTitle !== '') {
        subtasks[index].title = newTitle;
        renderSubtasks();
        editingSubtaskIndex = null;
    }
}


/**
 * Cancels the editing of a subtask and re-renders the subtasks.
 * @param {number} index - The index of the subtask to cancel editing for.
 */
function cancelEdit(index) {
    renderSubtasks();
    editingSubtaskIndex = null;
}



/**
 * Deletes a specific subtask by its index.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks(); 
}


/**
 * Renders all subtasks in the subtask list.
 */
function renderSubtasks() {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        subtaskList.innerHTML += generateSubtaskItemHTML(subtask.title, index);
    });
}


/**
 * Shows action buttons for a specific subtask.
 * @param {number} index - The index of the subtask to show buttons for.
 */
function showButtons(index) {
    const buttons = document.getElementById(`subtask-buttons-${index}`);
    if (buttons) {
        buttons.style.display = 'inline';
    }
}


/**
 * Hides action buttons for a specific subtask.
 * @param {number} index - The index of the subtask to hide buttons for.
 */
function hideButtons(index) {
    const buttons = document.getElementById(`subtask-buttons-${index}`);
    if (buttons) {
        buttons.style.display = 'none';
    }
}