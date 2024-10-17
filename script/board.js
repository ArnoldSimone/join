/**
 * Currently dragged element ID.
 * @type {string}
 */
let currentDraggedElement;


/**
 * Array of tasks in the task management system.
 * @type {Array<Object>}
 */
let tasks;


/**
 * Array of contacts associated with tasks.
 * @type {Array<Object>}
 */
let contacts;


/**
 * Filtered array of tasks based on search criteria.
 * @type {Array<Object>}
 */
let filteredSearchTasks = [];


/**
 * Loads tasks and contacts from the database on page load and renders the task board.
 * @function
 */
async function onloadFuncBoard() {
    let tasksData = await loadFromDatabase(`/tasks`);
    tasks = Object.entries(tasksData).map(([id, task]) => ({ id, ...task }));
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    renderTasksBoard();
}


/**
 * Renders the task board by calling renderTasksByProgress for each task status.
 * @function
 */
function renderTasksBoard() {
    renderTasksByProgress('todo', 'ctn-tasks-todo', 'No tasks To do');
    renderTasksByProgress('in progress', 'ctn-tasks-in-progress', 'No tasks In Progress');
    renderTasksByProgress('await feedback', 'ctn-tasks-await-feedback', 'No tasks Awaiting Feedback');
    renderTasksByProgress('done', 'ctn-tasks-done', 'No tasks Done');
}


/**
 * Renders tasks based on their progress status into the specified container.
 * @function
 * @param {string} progressStatus - The progress status of the tasks to render.
 * @param {string} containerId - The ID of the container to render the tasks into.
 * @param {string} noTaskMessage - The message to display if no tasks exist in the specified progress status.
 */
function renderTasksByProgress(progressStatus, containerId, noTaskMessage) {
    let containerRef = document.getElementById(containerId);
    let inputRef = document.getElementById('input-search-task');
    containerRef.innerHTML = "";
    let tasksToRender = (filteredSearchTasks.length > 0 || inputRef.value !== "") ? filteredSearchTasks : tasks;
    let filteredTasks = tasksToRender.filter(task => task.progress === progressStatus);
    if (filteredTasks.length === 0) {
        containerRef.innerHTML = getBoardNoTaskTemplate(noTaskMessage);
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            containerRef.innerHTML += getBoardTaskTemplate(filteredTasks[i]);
        }
    }
}


/**
 * Renders the "Assigned To" section for a task.
 * @function
 * @param {Array<string>|string} assignedTo - The list of assigned contacts or a single contact.
 * @returns {string} The HTML content for the assigned contacts.
 */
function renderAssignedTo(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0) return '';
    let assignedToContent = '';
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return '';
    } else {
        return processAssignedToContacts(assignedToArray);
    }
}


/**
 * Processes the array of assigned contacts and generates HTML content.
 * @param {Array} assignedToArray - The array of assigned contacts.
 * @returns {string} - The HTML content for the assigned contacts.
 */
function processAssignedToContacts(assignedToArray) {
    let assignedToContent = '';
    for (let i = 0; i < assignedToArray.length; i++) {
        if (i > 4) {
            assignedToContent += getAssignedToTemplateAdditional(assignedToArray.length);
            break;
        }
        assignedToContent += getContactTemplate(assignedToArray[i]);
    }
    return assignedToContent;
}


/**
 * Generates the contact template for a given contact name.
 * @param {string} contactName - The name of the contact.
 * @returns {string} - The HTML content for the assigned contact.
 */
function getContactTemplate(contactName) {
    let contact = contacts.find(c => c.name === contactName);
    let initial = contact.avatar.initials;
    let color = contact.avatar.color;
    return getAssignedToTemplate(initial, color);
}


/**
 * Renders the progress bar for task subtasks.
 * @function
 * @param {Array<Object>} subtasks - The subtasks associated with the task.
 * @returns {string} The HTML content for the progress bar.
 */
function renderTaskProgressBar(subtasks) {
    if (!subtasks || subtasks.length === 0) {
        return '';
    } else {
        let totalSubtasks = subtasks.length;
        let completedSubtasks = subtasks.filter(subtask => subtask.completed == true).length;
        let progressBar = getTaskProgressBarTemplate(totalSubtasks, completedSubtasks);
        return progressBar;
    }
}


/**
 * Closes the task detail overlay and removes it from the view.
 * @function
 */
function closeDetailTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardDetailRef = document.getElementById('overlay-board-detail');
    overlayBoardDetailRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardDetailRef.classList.add('d-none');
        overlayBoardDetailRef.classList.remove('slide-out');
    }, 200);
}


/**
 * Displays the task detail overlay for a specific task.
 * @function
 * @param {string} taskId - The ID of the task to show in the detail overlay.
 */
function showDetailTaskOverlay(taskId) {
    document.body.style.overflow = 'hidden';
    let overlayBoardRef = document.getElementById('overlay-board-detail');
    overlayBoardRef.classList.remove('d-none');
    overlayBoardRef.classList.add('slide-in');
    setTimeout(() => {
        overlayBoardRef.classList.remove('slide-in');
    }, 200);
    overlayBoardRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    overlayBoardRef.innerHTML = getTaskOverlayTemplate(task);
}


/**
 * Renders the subtasks section inside the task detail overlay.
 * @function
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The HTML content for the subtasks section.
 */
function renderSubtasksOverlay(task) {
    let subtasksArray = task.subtasks;
    if (!subtasksArray || subtasksArray.length === 0 || subtasksArray === "") {
        return 'No subtasks in this task!';
    } else {
        let ctnSubtasks = "";
        for (let indexSubTask = 0; indexSubTask < subtasksArray.length; indexSubTask++) {
            ctnSubtasks += getSubtasksOverlayTemplate(indexSubTask, task);
        }
        return ctnSubtasks;
    }
}


/**
 * Renders the assigned contacts for the overlay of a given task.
 * 
 * @param {Array|string} assignedTo - The assigned contacts, either as an array or a single string.
 * @returns {string} - The HTML content for assigned contacts or a message if none are present.
 */
function renderAssignedToOverlay(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return 'No contact in Assign To';
    } else {
        return processAssignedToOverlay(assignedToArray);
    }
}


/**
 * Processes the array of assigned contacts and generates HTML content for the overlay.
 * @param {Array} assignedToArray - The array of assigned contacts.
 * @returns {string} - The HTML content for the assigned contacts overlay.
 */
function processAssignedToOverlay(assignedToArray) {
    let assignedToContent = '';
    for (let i = 0; i < assignedToArray.length; i++) {
        assignedToContent += getContactOverlayTemplate(assignedToArray[i]);
    }
    return assignedToContent;
}


/**
 * Generates the overlay template for a given contact name.
 * @param {string} contactName - The name of the contact.
 * @returns {string} - The HTML content for the assigned contact overlay.
 */
function getContactOverlayTemplate(contactName) {
    let contact = contacts.find(c => c.name === contactName);
    let initial = contact.avatar.initials;
    let color = contact.avatar.color;
    return getAssignedToTemplateOverlay(initial, color, contactName);
}


/**
 * Updates the completion status of a specific subtask and refreshes the task board.
 * @async
 * @function
 * @param {number} indexSubTask - The index of the subtask in the subtasks array.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @returns {Promise<void>}
 */
async function updateSubtaskStatus(indexSubTask, taskId) {
    let task = tasks.find(t => t.id === taskId);
    let subtasksArray = task.subtasks;
    subtasksArray[indexSubTask].completed = !subtasksArray[indexSubTask].completed;
    await updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}


/**
 * Deletes a task from the database and refreshes the task board.
 * @async
 * @function
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    await deleteFromDatabase(`tasks/${taskId}`);
    closeDetailTaskOverlay()
    onloadFuncBoard();
}


/**
 * Filters the tasks on the task board based on the user's search input.
 * @function
 */
function filterTasksBoard() {
    filteredSearchTasks = [];
    let inputRef = document.getElementById('input-search-task');
    let input = inputRef.value.toLowerCase();
    for (let i = 0; i < tasks.length; i++) {
        let taskTitle = tasks[i].title.toLowerCase();
        let taskDescription = tasks[i].description.toLowerCase();
        if (taskTitle.includes(input) || taskDescription.includes(input)) {
            filteredSearchTasks.push(tasks[i]);
        }
    }

    renderTasksBoard();
}