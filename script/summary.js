async function onloadFuncSummary() {
    let tasksObjekt = await getAllData("/tasks");
    let tasks = Object.values(tasksObjekt);
    console.log(tasks);
    getNumberOfTasks(tasks);
    greetUser();
}

async function getAllData(path = "") {
    let tasksResponse = await fetch(BASE_URL + path + ".json");
    let tasksResJson = await tasksResponse.json();
    return tasksResJson;
}

function getNumberOfTasks(tasks) {
    let toDoTasks = tasks.filter(task => task.progress === "todo");
    let inProgressTasks = tasks.filter(task => task.progress === "in progress");
    let awaitFeedbackTasks = tasks.filter(task => task.progress === "await feedback");
    let doneTasks = tasks.filter(task => task.progress === "done");
    let totalTasks = tasks.length;
    let urgentTasks = tasks.filter(task => task.priority === "urgent");
    renderNumberOfStatus(toDoTasks, inProgressTasks, awaitFeedbackTasks, doneTasks, totalTasks, urgentTasks);
}

function renderNumberOfStatus(toDoTasks, inProgressTasks, awaitFeedbackTasks, doneTasks, totalTasks, urgentTasks) {
    document.getElementById('summary-todo-counter').innerHTML = toDoTasks.length;
    document.getElementById('tasks-in-progress-counter').innerHTML = inProgressTasks.length;
    document.getElementById('feedback-counter').innerHTML = awaitFeedbackTasks.length;
    document.getElementById('summary-done-counter').innerHTML = doneTasks.length;
    document.getElementById('tasks-in-board-counter').innerHTML = totalTasks;
    document.getElementById('summary-urgent-counter').innerHTML = urgentTasks.length;
}

function greetUser() {
    const currentHour = new Date().getHours();
    let greeting;
    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning,";
    } else if (currentHour < 18) {
        greeting = "Guten afternoon,";
    } else {
        greeting = "Guten evening,";
    }
    document.getElementById('daytime-greeting').innerHTML = greeting;
}