
async function onloadFuncBoard() {
    tasks = Object.values(await loadFromDatabase(`/tasks`));
    renderTasksBoard(tasks);
}

function renderTasksBoard(tasks) {
    renderTasksInProcess();
    renderTasksTodo();
    renderTasksAwaitFeedback();
    renderTasksDone();


}

function renderTasksTodo() {
    let TasksTodoRef = document.getElementById('ctn-tasks-todo');
    TasksTodoRef.innerHTML = "";
    let todoTasks = tasks.filter(task => task.progress === "todo");
    if (todoTasks.length === 0) {
        TasksTodoRef.innerHTML = getBoardNoTaskTemplate();
    } else {
        for (let i = 0; i < todoTasks.length; i++) {
            TasksTodoRef.innerHTML += getBoardTaskTemplate(todoTasks[i]);
        }
    }
}

function renderTasksInProcess() {
    let taskInProcessRef = document.getElementById('ctn-tasks-in-progress');
    taskInProcessRef.innerHTML = "";
    let inProgressTasks = tasks.filter(task => task.progress === "in progress");
    if (inProgressTasks.length === 0) {
        taskInProcessRef.innerHTML = getBoardNoTaskTemplate();
    } else {
        for (let i = 0; i < inProgressTasks.length; i++) {
            taskInProcessRef.innerHTML += getBoardTaskTemplate(inProgressTasks[i]);
        }
    }
}

function renderTasksAwaitFeedback() {
    let taskAwaitFeedbackRef = document.getElementById('ctn-tasks-await-feedback');
    taskAwaitFeedbackRef.innerHTML = "";
    let awaitFeedbackTasks = tasks.filter(task => task.progress === "await feedback");
    if (awaitFeedbackTasks.length === 0) {
        taskAwaitFeedbackRef.innerHTML = getBoardNoTaskTemplate();
    } else {
        for (let i = 0; i < awaitFeedbackTasks.length; i++) {
            taskAwaitFeedbackRef.innerHTML += getBoardTaskTemplate(awaitFeedbackTasks[i]);
        }
    }
}

function renderTasksDone() {
    let taskDoneRef = document.getElementById('ctn-tasks-done');
    taskDoneRef.innerHTML = "";
    let doneTasks = tasks.filter(task => task.progress === "done");
    if (doneTasks.length === 0) {
        taskDoneRef.innerHTML = getBoardNoTaskTemplate();
    } else {
        for (let i = 0; i < doneTasks.length; i++) {
            taskDoneRef.innerHTML += getBoardTaskTemplate(doneTasks[i]);
        }
    }
}


function getBoardNoTaskTemplate() {
    return `                        
    <div class="no-tasks-todo d-flex">
        No tasks To do
    </div>`;
}

function getBoardTaskTemplate(task) {
    return `
    <div onclick="showDetailTaskOverlay()" id="task-board" class="ctn-task d-flex-x" draggable="true" ondragstart="startDragging()">
        ${getTaskCategoryTemplate(task.category)}
        <p id="task-title" class="task-title">${task.title}</p>
        <p id="task-description" class="task-description">${task.description}</p>
        <div class="task-subtasks d-flex-y">
            <progress max="3" value="2"></progress>
            <span class="subtasks-count">1/3 Subtasks</span>
        </div>
        <div class="ctn-task-bottom d-flex-y">
            <div class="ctn-assigned-to mesh d-flex-y">
                <div class="assigned-to mesh d-flex bg-1">AM</div>
                <div class="assigned-to mesh d-flex bg-2">BR</div>
                <div class="assigned-to mesh d-flex bg-3">HI</div>
            </div>
            <img class="image-prio-board" src="../assets/img/lowsym.png" alt="">
        </div>
    </div>`;
}


function getTaskCategoryTemplate(category) {
    return `<p id="task-category" class="task-category ${category == 'User Story' ? 'bg-user-story' : 'bg-technical-task'}">${category}</p>`

}

function closeDetailTaskOverlay() {
    document.getElementById('overlay-board').classList.add('d-none');
    document.getElementById('overlay-detail-task-board').classList.add('d-none');
}

function showDetailTaskOverlay() {
    document.getElementById('overlay-board').classList.remove('d-none');
    document.getElementById('overlay-detail-task-board').classList.remove('d-none');
}

function bubblingProtection(event) {
    event.stopPropagation();
}



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
