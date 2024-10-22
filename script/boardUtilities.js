/**
 * Moves a task to a new progress status and updates it in the database.
 * @async
 * @param {string} progressStatus - The new progress status for the task.
 * @param {string} taskId - The ID of the task to move.
 * @function moveTaskResponsive
 */
async function moveTaskResponsive(progressStatus, taskId) {
    let task = tasks.find(t => t.id === taskId);
    task.progress = progressStatus;
    await updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}


/**
 * Toggles the visibility of the move-to menu for a task.
 * @param {string} taskId - The ID of the task whose menu is to be toggled.
 * @function toggleMenuMoveTo
 */
function toggleMenuMoveTo(taskId) {
    document.getElementById(`menu-${taskId}`).classList.toggle('d-none');
}


/**
 * Toggles the visibility of a task's dropdown menu.
 * Hides the menu if a click occurs outside of it.
 * @param {string} taskId - The ID of the task whose menu is toggled.
 */
function toggleMenuMoveTo(taskId) {
    const menu = document.getElementById(`menu-${taskId}`);
    const isVisible = !menu.classList.toggle('d-none');
    if (isVisible) {
        document.onclick = (event) => {
            if (!menu.contains(event.target)) {
                menu.classList.add('d-none');
                document.onclick = null;
            }
        };
    }
}


/**
 * Prevents event bubbling for menu click events.
 * @param {Event} event - The click event.
 * @function handleClickMenu
 */
function handleClickMenu(event) {
    event.stopPropagation();
}


/**
 * Initializes the dragging state for a task.
 * @param {string} taskId - The ID of the task being dragged.
 * @function startDragging
 */
function startDragging(taskId) {
    currentDraggedElement = taskId;
    const taskElement = document.getElementById(`task-${taskId}`);
    taskElement.style.transform = 'rotate(4deg)';
}


/**
 * Allows dropping of a dragged element by preventing default behavior.
 * @param {Event} ev - The drag event.
 * @function allowDrop
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves a task to a specified progress status and updates it in the database.
 * @async
 * @param {string} progress - The new progress status for the task.
 * @function moveTo
 */
async function moveTo(progress) {
    let task = tasks.find(t => t.id === currentDraggedElement);
    task.progress = progress;
    await updateOnDatabase(`tasks/${currentDraggedElement}`, task)
    renderTasksBoard();
    removeAllHighlight();
    resetDraggingState();
}


/**
 * Resets the dragging state by removing transformations and clearing the current dragged element.
 * @function resetDraggingState
 */
function resetDraggingState() {
    if (currentDraggedElement) {
        const taskElement = document.getElementById(`task-${currentDraggedElement}`);
        taskElement.style.transform = '';
        currentDraggedElement = null;
    }
}


/**
 * Removes highlight from all task containers.
 * @function removeAllHighlight
 */
function removeAllHighlight() {
    removeHighlight('highlight-todo');
    removeHighlight('highlight-in-progress');
    removeHighlight('highlight-await-feedback');
    removeHighlight('highlight-done');
}


/**
 * Highlights a specific task container during dragging.
 * @param {string} containerId - The ID of the container to highlight.
 * @function highlight
 */
function highlight(containerId) {
    document.getElementById(containerId).classList.add('drag-area-highlight');
}


/**
 * Removes highlight from a specific task container.
 * @param {string} containerId - The ID of the container to remove highlight from.
 * @function removeHighlight
 */
function removeHighlight(containerId) {
    document.getElementById(containerId).classList.remove('drag-area-highlight');
}


/**
 * Prevents event bubbling for certain events.
 * @param {Event} event - The event to prevent bubbling for.
 * @function bubblingProtection
 */
function bubblingProtection(event) {
    event.stopPropagation();
}


/**
 * Formats a date string from 'YYYY-MM-DD' to 'DD/MM/YYYY'.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 * @function formatDate
 */
function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


/**
 * Toggles the checked state of a subtask's checkbox and updates the subtask status in the database.
 * @async
 * @param {number} indexSubTask - The index of the subtask.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @function toggleCheckbox
 */
async function toggleCheckbox(indexSubTask, taskId) {
    let checkbox = document.getElementById(`checkbox${indexSubTask}`);
    checkbox.checked = !checkbox.checked;
    await updateSubtaskStatus(indexSubTask, taskId);
}

