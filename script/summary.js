async function onloadFuncSummary() {
    tasks = Object.values(await loadFromDatabase(`tasks`));
    console.log(tasks);
    getNumberOfTasks(tasks);
    greetingUser();
    getUpcomingDeadline();
}

function getNumberOfTasks(tasks) {
    let toDoTasks = tasks.filter(task => task.progress === "todo");
    let inProgressTasks = tasks.filter(task => task.progress === "in progress");
    let awaitFeedbackTasks = tasks.filter(task => task.progress === "await feedback");
    let doneTasks = tasks.filter(task => task.progress === "done");
    let totalTasks = tasks.length;
    let urgentTasks = tasks.filter(task => task.priority === "urgent");
    renderNumberOfTasks(toDoTasks, inProgressTasks, awaitFeedbackTasks, doneTasks, totalTasks, urgentTasks);
}

function renderNumberOfTasks(toDoTasks, inProgressTasks, awaitFeedbackTasks, doneTasks, totalTasks, urgentTasks) {
    document.getElementById('summary-todo-counter').innerHTML = toDoTasks.length;
    document.getElementById('tasks-in-progress-counter').innerHTML = inProgressTasks.length;
    document.getElementById('feedback-counter').innerHTML = awaitFeedbackTasks.length;
    document.getElementById('summary-done-counter').innerHTML = doneTasks.length;
    document.getElementById('tasks-in-board-counter').innerHTML = totalTasks;
    document.getElementById('summary-urgent-counter').innerHTML = urgentTasks.length;
}

function greetingUser() {
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

function getUpcomingDeadline() {
    let urgentTasks = tasks.filter(task => task.priority === "urgent");
    console.log(urgentTasks);

    if (urgentTasks == "") {
        document.getElementById('main-summary-middle-right').innerHTML = `<div>No upcoming Deadline</div>`;
    } else {
        urgentTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        let upcomingDeadline = urgentTasks[0].dueDate;
        document.getElementById('date-upcoming-deadline').innerHTML = formattingDate(upcomingDeadline);
    }
}

function formattingDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}



