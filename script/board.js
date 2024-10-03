let currentDraggedElement;
let tasks;
let contacts;

async function onloadFuncBoard() {
    let tasksData = await loadFromDatabase(`/tasks`);
    tasks = Object.entries(tasksData).map(([id, task]) => ({ id, ...task }));
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    renderTasksBoard();
}

function renderTasksBoard() {
    renderTasksByProgress('todo', 'ctn-tasks-todo', 'No tasks To do')
    renderTasksByProgress('in progress', 'ctn-tasks-in-progress', 'No tasks In Progress')
    renderTasksByProgress('await feedback', 'ctn-tasks-await-feedback', 'No tasks Awaiting Feedback')
    renderTasksByProgress('done', 'ctn-tasks-done', 'No tasks Done')
}

function renderTasksByProgress(progressStatus, containerId, noTaskMessage) {
    let containerRef = document.getElementById(containerId);
    containerRef.innerHTML = "";
    let filteredTasks = tasks.filter(task => task.progress === progressStatus);
    if (filteredTasks.length === 0) {
        containerRef.innerHTML = getBoardNoTaskTemplate(noTaskMessage);
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            containerRef.innerHTML += getBoardTaskTemplate(filteredTasks[i]);
        }
    }
}

function startDragging(taskId) {
    currentDraggedElement = taskId;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(progress) {
    let task = tasks.find(t => t.id === currentDraggedElement);
    task.progress = progress;
    updateOnDatabase(`tasks/${currentDraggedElement}`, task)
    renderTasksBoard();
    removeAllHighlight();
}

function removeAllHighlight() {
    removeHighlight('highlight-todo');
    removeHighlight('highlight-in-progress');
    removeHighlight('highlight-await-feedback');
    removeHighlight('highlight-done');
}

function highlight(containerId) {
    document.getElementById(containerId).classList.add('drag-area-highlight');
}

function removeHighlight(containerId) {
    document.getElementById(containerId).classList.remove('drag-area-highlight');
}

function getBoardNoTaskTemplate(message) {
    return `                        
    <div class="ctn-no-tasks d-flex">
        ${message}
    </div>`;
}

function getBoardTaskTemplate(task) {
    return `
    <div onclick="showDetailTaskOverlay('${task.id}')" id="task-${task.id}" class="ctn-task d-flex-x" draggable="true" ondragstart="startDragging('${task.id}')">
        ${getTaskCategoryTemplate(task.category)}
        <p id="task-title" class="task-title">${task.title}</p>
        <p id="task-description" class="task-description">${task.description}</p>
        ${renderTaskProgressBar(task.subtasks)}
        <div class="ctn-task-bottom d-flex-y">
            <div class="ctn-assigned-to mesh d-flex-y">
                ${renderAssignedTo(task)}
            </div>
            ${getImagePrioTemplate(task.priority)}
        </div>
    </div>`;
}

function renderAssignedTo(task) {
    let assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
    let assignedToContent = "";
    for (let i = 0; i < assignedToArray.length; i++) {
        let contact = contacts.find(c => c.name === assignedToArray[i]);
        let initial = contact.avatar.initials;
        let color = contact.avatar.color;
        assignedToContent += getAssignedToTemplate(initial, color);
    }
    return assignedToContent;
}

function getAssignedToTemplate(initial, color) {
    return `<div class="assigned-to mesh d-flex" style="background-color:${color};">${initial}</div>`
}

function getImagePrioTemplate(priority) {
    const priortyImages = {
        'Low': '../assets/img/lowsym.png',
        'Medium': '../assets/img/mediumsym.png',
        'Urgent': '../assets/img/urgentsym.png'
    }
    return `<img class="image-prio-board" src="${priortyImages[priority]}" alt="">`
}

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

function getTaskProgressBarTemplate(totalSubtasks, completedSubtasks) {
    return `        
            <div class="task-subtasks d-flex-y">
                <progress max="${totalSubtasks}" value="${completedSubtasks}"></progress>
                <span class="subtasks-count">${completedSubtasks}/${totalSubtasks} Subtasks</span>
            </div>`;
}

function getTaskCategoryTemplate(category) {
    return `<p id="task-category" class="task-category ${category == 'User Story' ? 'bg-user-story' : 'bg-technical-task'}">${category}</p>`
}

function closeDetailTaskOverlay() {
    let overlayBoardRef = document.getElementById('overlay-board');
    overlayBoardRef.classList.add('slide-out')
    setTimeout(() => {
        overlayBoardRef.classList.add('d-none');
        overlayBoardRef.classList.remove('slide-out');
    }, 200);
}

function bubblingProtection(event) {
    event.stopPropagation();
}

function showDetailTaskOverlay(taskId) {
    let overlayBoardRef = document.getElementById('overlay-board');
    overlayBoardRef.classList.remove('d-none');
    overlayBoardRef.classList.add('slide-in')

    setTimeout(() => {
        overlayBoardRef.classList.remove('slide-in');
    }, 200);

    overlayBoardRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId)
    overlayBoardRef.innerHTML = getTaskOverlayTemplate(task);
}

function renderSubtasksOverlay(task) {
    let subtasksArray = task.subtasks;
    if (!subtasksArray || subtasksArray.length === 0) {
        return 'No subtasks in this task!';
    } else {
        let ctnSubtasks = "";
        for (let indexSubTask = 0; indexSubTask < subtasksArray.length; indexSubTask++) {
            ctnSubtasks += getSubtasksOverlayTemplate(indexSubTask, task);
        }
        return ctnSubtasks;
    }
}

function getTaskOverlayTemplate(task) {
    return `
    <div onclick="bubblingProtection(event)" id="overlay-detail-task-board" class="overlay-detail-task-board ctn-task no-hover d-flex-x">
        <div class="ctn-category-close d-flex-y">
        ${getTaskCategoryTemplate(task.category)}
            <img onclick="closeDetailTaskOverlay()" class="btn-close-detail-task" src="../assets/img/close.svg" alt="Image Close">
        </div>
        <div class="ctn-main-Detail-Task d-flex-x">
            <p id="task-title-detail" class="task-title-detail">${task.title}</p>
            <p id="task-description-detail" class="task-description-detail">${task.description}</p>
            <div class="ctn-due-date d-flex-y">
                <p class="label">Due date:</p>
                <p class="due-date">${formatDate(task.dueDate)}</p>
            </div>
            <div class="ctn-priority d-flex-y">
                <p class="label">Priority:</p>
                <p class="prio-detail">${task.priority}</p>
                ${getImagePrioTemplate(task.priority)}
            </div>
            <p class="label">Assigned To:</p>
            <div class="ctn-assigned-to-detail d-flex-x">
                ${renderAssignedToOverlay(task)}
            </div>
            <p class="label">Subtasks:</p>
            <div class="ctn-subtasks d-flex-x">
                ${renderSubtasksOverlay(task)}
            </div>
        </div>
        <div class="ctn-delete-edit d-flex-y">
            <img class="btn-delete-task" src="../assets/img/dustbinDarkText.svg" alt="Image Delete">
                <span class="vertikalLine"></span>
                <img class="btn-edit-task" src="../assets/img/editDarkText.svg" alt="Image Close">
                </div>
        </div>`
}

function renderAssignedToOverlay(task) {
    let assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
    let assignedToContent = "";
    for (let i = 0; i < assignedToArray.length; i++) {
        let contact = contacts.find(c => c.name === assignedToArray[i]);
        let initial = contact.avatar.initials;
        let color = contact.avatar.color;
        let name = assignedToArray[i];
        assignedToContent += getAssignedToTemplateOverlay(initial, color, name);
    }
    return assignedToContent;
}

function getAssignedToTemplateOverlay(initial, color, name) {
    return `     
        <div class="person-detail d-flex-y">
            <div class="assigned-to d-flex bg-1" style="background-color:${color};">${initial}</div>
            <p>${name}</p>
        </div>`
}

function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function getSubtasksOverlayTemplate(indexSubTask, task) {
    let subtasksArray = task.subtasks;
    return `
        <div class="subtask-item d-flex-y">
            <input onchange="updateSubtaskStatus(${indexSubTask}, '${task.id}')" type="checkbox" id="checkbox${indexSubTask}" class="subtask" ${(subtasksArray[indexSubTask].completed == true) ? "checked" : ""}>
            <label for="checkbox${indexSubTask}">${subtasksArray[indexSubTask].title}</label>
        </div>`
}

function updateSubtaskStatus(indexSubTask, taskId) {
    let task = tasks.find(t => t.id === taskId);
    let subtasksArray = task.subtasks;
    subtasksArray[indexSubTask].completed = !subtasksArray[indexSubTask].completed;
    updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}
