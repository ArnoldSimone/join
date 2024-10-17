let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

async function onloadFuncSummary() {
    tasks = Object.values(await loadFromDatabase(`/tasks`));
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    getNumberOfTasks(tasks);
    greetingUser();
    greetingUserName();
    getUpcomingDeadline();
}

function getNumberOfTasks(tasks) {
    let toDoTasks = tasks.filter(task => task.progress === "todo");
    let inProgressTasks = tasks.filter(task => task.progress === "in progress");
    let awaitFeedbackTasks = tasks.filter(task => task.progress === "await feedback");
    let doneTasks = tasks.filter(task => task.progress === "done");
    let totalTasks = tasks.length;
    let urgentTasks = tasks.filter(task => task.priority === "Urgent");
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
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }
    document.getElementById('daytime-greeting').innerHTML = greeting;
}

function greetingUserName() {
    let loggedInUser;
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        loggedInUser = JSON.parse(currentUser);
        let loggedInUserMail = loggedInUser.email;
        let contactDetails = contacts.find(c => c.email === loggedInUserMail);
        if (contactDetails) {
            document.getElementById('user-greeting').innerHTML = contactDetails.name;
        }
    } else {
        document.getElementById('user-greeting').innerHTML = "Guest";
    }
}

function getUpcomingDeadline() {
    let urgentTasks = tasks.filter(task => task.priority === "Urgent");
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


document.addEventListener('DOMContentLoaded', function () {
    let greetingSummaryRef = document.querySelector('.greeting-summary');
    let headerSummaryRef = document.querySelector('.header-summary');
    let ctnTasksSummaryRef = document.querySelector('.ctn-tasks-summary');
    if (window.innerWidth <= 1280) {
        greetingSummaryRef.addEventListener('animationend', function () {
            greetingSummaryRef.style.display = 'none';
            headerSummaryRef.style.display = 'flex';
            ctnTasksSummaryRef.style.display = 'flex';
            headerSummaryRef.classList.add('fade-in');
            ctnTasksSummaryRef.classList.add('fade-in');
        });
    }
});




