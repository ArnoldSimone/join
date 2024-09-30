const BASE_URL = "https://join-5800e-default-rtdb.europe-west1.firebasedatabase.app/"

let tasks = [
    {
        "assignedTo": ["Anton Mayer", "Eva Fischer"],
        "category": "User Story",
        "description": "Firebase anlegen für die neue App.",
        "dueDate": "15/10/2024",
        "priority": "medium",
        "progress": "in progress",
        "subtasks": [
            "Firebase-Projekt erstellen",
            "Datenbank einrichten",
            "Authentifizierung konfigurieren"
        ]
    },
    {
        "assignedTo": "Anton Mayer",
        "category": "Technical Task",
        "description": "API für die App entwickeln.",
        "dueDate": "01/11/2024",
        "priority": "urgent",
        "progress": "todo",
        "subtasks": [
            "API-Schnittstellen entwerfen",
            "Endpoints implementieren"
        ]
    },
    {
        "assignedTo": "Eva Fischer",
        "category": "User Story",
        "description": "Fehler beim Login beheben.",
        "dueDate": "05/10/2024",
        "priority": "urgent",
        "progress": "in progress",
        "subtasks": [
            "Fehleranalyse durchführen",
            "Lösung implementieren",
            "Tests durchführen"
        ]
    },
    {
        "assignedTo": ["Anton Mayer", "John Smith"],
        "category": "Technical Task",
        "description": "UI-Verbesserungen für das Dashboard.",
        "dueDate": "25/10/2024",
        "priority": "low",
        "progress": "await feedback",
        "subtasks": [
            "Designvorschläge erstellen",
            "Änderungen im Frontend umsetzen",
            "Feedback einholen"
        ]
    },
    {
        "assignedTo": "John Smith",
        "category": "User Story",
        "description": "Integration von Push-Benachrichtigungen.",
        "dueDate": "10/11/2024",
        "priority": "medium",
        "progress": "done",
        "subtasks": [
            "Benachrichtigungssystem entwerfen",
            "Push-Services konfigurieren",
            "App-Benachrichtigungen testen"
        ]
    }
];

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


async function onloadFunc() {
    let tasks = await getAllData("/tasks");
    console.table(tasks);
    // await pushTasks(tasks);
}

async function getAllData(path = "") {
    let tasksResponse = await fetch(BASE_URL + path + ".json");
    let tasksResJson = await tasksResponse.json();
    return tasksResJson;
}

async function pushTasks(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        await pushTask(tasks[i]);
    }
}

async function pushTask(task) {
    const response = await fetch(BASE_URL + "tasks.json", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
}
