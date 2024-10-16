/**
 * Moves a task to a new progress status and updates it in the database.
 * @async
 * @function moveTask
 * @param {string} progressStatus - The new progress status of the task (e.g., 'todo', 'in progress', 'await feedback', 'done').
 * @param {string} taskId - The unique identifier of the task to be moved.
 * @returns {Promise<void>} - A promise that resolves when the task has been updated and the board is re-rendered.
 */
async function moveTaskResponsive(progressStatus, taskId) {
    let task = tasks.find(t => t.id === taskId);
    task.progress = progressStatus;
    await updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}


/**
 * Toggles the visibility of the "Move To" menu for a task.
 * @function
 * @param {string} taskId - The ID of the task whose menu should be toggled.
 */
function toggleMenuMoveTo(taskId) {
    document.getElementById(`menu-${taskId}`).classList.toggle('d-none');
}


/**
 * Stops the event propagation to prevent click events from bubbling.
 * @function
 * @param {Event} event - The event to stop propagation on.
 */
function handleClickMenu(event) {
    event.stopPropagation();
}


/**
 * Starts dragging a task and applies a visual rotation to it.
 * @function
 * @param {string} taskId - The ID of the task being dragged.
 */
function startDragging(taskId) {
    currentDraggedElement = taskId;
    const taskElement = document.getElementById(`task-${taskId}`);
    taskElement.style.transform = 'rotate(4deg)';
}


/**
 * Allows a dragged item to be dropped by preventing the default event.
 * @function
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves the dragged task to a new progress status and updates it in the database.
 * @async
 * @function
 * @param {string} progress - The new progress status for the dragged task.
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
 * Resets the transformation and clears the currently dragged element.
 */
function resetDraggingState() {
    if (currentDraggedElement) {
        const taskElement = document.getElementById(`task-${currentDraggedElement}`);
        taskElement.style.transform = '';
        currentDraggedElement = null;
    }
}


/**
 * Removes highlights from all drag areas.
 * @function
 */
function removeAllHighlight() {
    removeHighlight('highlight-todo');
    removeHighlight('highlight-in-progress');
    removeHighlight('highlight-await-feedback');
    removeHighlight('highlight-done');
}


/**
 * Adds a highlight to the specified drag container.
 * @function
 * @param {string} containerId - The ID of the container to highlight.
 */
function highlight(containerId) {
    document.getElementById(containerId).classList.add('drag-area-highlight');
}


/**
 * Removes the highlight from the specified drag container.
 * @function
 * @param {string} containerId - The ID of the container to remove the highlight from.
 */
function removeHighlight(containerId) {
    document.getElementById(containerId).classList.remove('drag-area-highlight');
}


/**
 * Prevents event bubbling for the given event.
 * @function
 * @param {Event} event - The event for which to stop propagation.
 */
function bubblingProtection(event) {
    event.stopPropagation();
}


/**
 * Formats a date string from the format YYYY-MM-DD to DD/MM/YYYY.
 * @function
 * @param {string} dateString - The date string in the format YYYY-MM-DD.
 * @returns {string} The formatted date in the format DD/MM/YYYY.
 */
function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


/**
 * Toggles the checked state of a checkbox for a given subtask and updates its status in the database.
 * @async
 * @function toggleCheckbox
 * @param {number} indexSubTask - The index of the subtask whose checkbox state is being toggled.
 * @param {string} taskId - The unique identifier of the parent task that contains the subtask.
 * @returns {Promise<void>} - A promise that resolves when the subtask's status has been updated in the database.
 */
async function toggleCheckbox(indexSubTask, taskId) {
    let checkbox = document.getElementById(`checkbox${indexSubTask}`);
    checkbox.checked = !checkbox.checked;
    await updateSubtaskStatus(indexSubTask, taskId);
}

