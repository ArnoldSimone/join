let currentDraggedElement;
let tasks;

async function onloadFuncBoard() {
    let tasksData = await loadFromDatabase(`/tasks`);
    tasks = Object.entries(tasksData).map(([id, task]) => ({ id, ...task }));
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
                <div class="assigned-to mesh d-flex bg-1">AM</div>
                <div class="assigned-to mesh d-flex bg-2">BR</div>
                <div class="assigned-to mesh d-flex bg-3">HI</div>
            </div>
            ${getImagePrioTemplate(task.priority)}
        </div>
    </div>`;
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
    document.getElementById('overlay-board').classList.add('d-none');
}

function bubblingProtection(event) {
    event.stopPropagation();
}

function showDetailTaskOverlay(taskId) {
    let overlayBoardRef = document.getElementById('overlay-board');

    overlayBoardRef.classList.remove('d-none');
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
            ctnSubtasks += getSubtasksOverlayTemplate(indexSubTask, subtasksArray);
        }
        return ctnSubtasks;
    }
}

function getSubtasksOverlayTemplate(indexSubTask, subtasksArray) {
    return `
        <div class="subtask-item d-flex-y">
            <input type="checkbox" id="checkbox${indexSubTask}" class="subtask">
            <label for="checkbox${indexSubTask}">${subtasksArray[indexSubTask].title}</label>
        </div>
    `
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
                <div class="person-detail d-flex-y">
                    <div class="assigned-to d-flex bg-1">AM</div>
                    <p>Anton Maier</p>
                </div>
                <div class="person-detail d-flex-y">
                    <div class="assigned-to d-flex bg-3">ST</div>
                    <p>Sabine Taube</p>
                </div>
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

function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


// OVERLAY DETAIL-TASK






// let tasks = [
//     {
//         "title": "Firebase Setup",
//         "assignedTo": ["Anton Mayer", "Eva Fischer"],
//         "category": "User Story",
//         "description": "Firebase anlegen für die neue App.",
//         "dueDate": "2025-02-17",
//         "priority": "medium",
//         "progress": "in progress",
//         "subtasks": [
//             "Firebase-Projekt erstellen",
//             "Datenbank einrichten",
//             "Authentifizierung konfigurieren"
//         ]
//     },
//     {
//         "title": "API Development",
//         "assignedTo": "Anton Mayer",
//         "category": "Technical Task",
//         "description": "API für die App entwickeln.",
//         "dueDate": "2024-12-22",
//         "priority": "urgent",
//         "progress": "todo",
//         "subtasks": [
//             "API-Schnittstellen entwerfen",
//             "Endpoints implementieren"
//         ]
//     },
//     {
//         "title": "Login Bug Fix",
//         "assignedTo": "Eva Fischer",
//         "category": "User Story",
//         "description": "Fehler beim Login beheben.",
//         "dueDate": "2024-10-03",
//         "priority": "urgent",
//         "progress": "in progress",
//         "subtasks": [
//             "Fehleranalyse durchführen",
//             "Lösung implementieren",
//             "Tests durchführen"
//         ]
//     },
//     {
//         "title": "Dashboard UI Improvements",
//         "assignedTo": ["Anton Mayer", "John Smith"],
//         "category": "Technical Task",
//         "description": "UI-Verbesserungen für das Dashboard.",
//         "dueDate": "2024-10-10",
//         "priority": "low",
//         "progress": "await feedback",
//         "subtasks": [
//             "Designvorschläge erstellen",
//             "Änderungen im Frontend umsetzen",
//             "Feedback einholen"
//         ]
//     },
//     {
//         "title": "Push Notifications Integration",
//         "assignedTo": "John Smith",
//         "category": "User Story",
//         "description": "Integration von Push-Benachrichtigungen.",
//         "dueDate": "2024-10-15",
//         "priority": "medium",
//         "progress": "done",
//         "subtasks": [
//             "Benachrichtigungssystem entwerfen",
//             "Push-Services konfigurieren",
//             "App-Benachrichtigungen testen"
//         ]
//     }
// ];

// async function onloadFunc() {
//     let tasks = await getAllData("/tasks");
//     console.table(tasks);
//     // await pushTasks(tasks);
// }

// async function getAllData(path = "") {
//     let tasksResponse = await fetch(BASE_URL + path + ".json");
//     let tasksResJson = await tasksResponse.json();
//     return tasksResJson;
// }

// async function pushTasks(tasks) {
//     for (let i = 0; i < tasks.length; i++) {
//         await pushTask(tasks[i]);
//     }
// }

// async function pushTask(task) {
//     const response = await fetch(BASE_URL + "tasks.json", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(task)
//     });
// }
