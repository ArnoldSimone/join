//check
let tasks;
let contacts;
let currentDraggedElement;
let filteredSearchTasks = [];

//check
async function onloadFuncBoard() {
    let tasksData = await loadFromDatabase(`/tasks`);
    tasks = Object.entries(tasksData).map(([id, task]) => ({ id, ...task }));
    console.log(tasks);
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    console.log(contacts);
    renderTasksBoard();
}

//check
function renderTasksBoard() {
    renderTasksByProgress('todo', 'ctn-tasks-todo', 'No tasks To do');
    renderTasksByProgress('in progress', 'ctn-tasks-in-progress', 'No tasks In Progress');
    renderTasksByProgress('await feedback', 'ctn-tasks-await-feedback', 'No tasks Awaiting Feedback');
    renderTasksByProgress('done', 'ctn-tasks-done', 'No tasks Done');
}


//check
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

//check
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

//check
function renderAssignedTo(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return '';
    } else {
        return processAssignedToContacts(assignedToArray);
    }
}


//check
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


//check
function getContactTemplate(assignedToArrayContact) {
    let contact = contacts.find(c => c.id === assignedToArrayContact.id);
    let initial = contact.avatar.initials;
    let color = contact.avatar.color;
    return getAssignedToTemplate(initial, color);
}


//check
function closeDetailTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardDetailRef = document.getElementById('overlay-board-detail');
    overlayBoardDetailRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardDetailRef.classList.add('d-none');
        overlayBoardDetailRef.classList.remove('slide-out');
    }, 200);
}

//check
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
    console.log('Task', task);

    overlayBoardRef.innerHTML = getTaskOverlayTemplate(task);
}


//check
function renderAssignedToOverlay(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return 'No contact in Assign To';
    } else {
        return processAssignedToOverlay(assignedToArray);
    }
}

//check
function processAssignedToOverlay(assignedToArray) {
    let assignedToContent = '';
    for (let i = 0; i < assignedToArray.length; i++) {
        assignedToContent += getContactOverlayTemplate(assignedToArray[i]);
    }
    return assignedToContent;
}

//check
function getContactOverlayTemplate(assignedToArrayContact) {
    let contact = contacts.find(c => c.id === assignedToArrayContact.id);
    let initial = contact.avatar.initials;
    let color = contact.avatar.color;
    let name = assignedToArrayContact.name;
    return getAssignedToTemplateOverlay(initial, color, name);
}

//check
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

//check
async function updateSubtaskStatus(indexSubTask, taskId) {
    let task = tasks.find(t => t.id === taskId);
    let subtasksArray = task.subtasks;
    subtasksArray[indexSubTask].completed = !subtasksArray[indexSubTask].completed;
    await updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}


//check
async function deleteTask(taskId) {
    await deleteFromDatabase(`tasks/${taskId}`);
    closeDetailTaskOverlay()
    onloadFuncBoard();
}

//check
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