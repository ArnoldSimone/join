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
        'low': '../assets/img/lowsym.png',
        'medium': '../assets/img/mediumsym.png',
        'urgent': '../assets/img/urgentsym.png'
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
    // document.getElementById('overlay-detail-task-board').classList.add('d-none');
}

function bubblingProtection(event) {
    event.stopPropagation();
}

function showDetailTaskOverlay(id) {
    document.getElementById('overlay-board').classList.remove('d-none');
    // document.getElementById('overlay-detail-task-board').classList.remove('d-none');
    console.log(id);


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
