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
    let tasksToRender = filteredSearchTasks.length > 0 ? filteredSearchTasks : tasks;
    let filteredTasks = tasksToRender.filter(task => task.progress === progressStatus);
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

function bubblingProtection(event) {
    event.stopPropagation();
}

function renderAssignedTo(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    let assignedToContent = "";
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return '';
    } else {
        for (let i = 0; i < assignedToArray.length; i++) {
            if (i > 4) {
                assignedToContent += getAssignedToTemplateAdditional(assignedTo.length);
                return assignedToContent;
            } else {
                let contact = contacts.find(c => c.name === assignedToArray[i]);
                let initial = contact.avatar.initials;
                let color = contact.avatar.color;
                assignedToContent += getAssignedToTemplate(initial, color);
            }
        }
        return assignedToContent;
    }
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

function closeDetailTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardDetailRef = document.getElementById('overlay-board-detail');
    overlayBoardDetailRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardDetailRef.classList.add('d-none');
        overlayBoardDetailRef.classList.remove('slide-out');
    }, 200);
}

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

function renderAssignedToOverlay(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return 'No contact in Assign To';
    } else {
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
}

function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function updateSubtaskStatus(indexSubTask, taskId) {
    let task = tasks.find(t => t.id === taskId);
    let subtasksArray = task.subtasks;
    subtasksArray[indexSubTask].completed = !subtasksArray[indexSubTask].completed;
    updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}

function toggleCheckbox(indexSubTask, taskId) {
    const checkbox = document.getElementById(`checkbox${indexSubTask}`);
    checkbox.checked = !checkbox.checked;
    updateSubtaskStatus(indexSubTask, taskId);
}


async function deleteTask(taskId) {
    await deleteFromDatabase(`tasks/${taskId}`);
    closeDetailTaskOverlay()
    onloadFuncBoard();
}

let filteredSearchTasks = [];

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