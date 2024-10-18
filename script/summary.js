/**
 * Loads task and contact data from the database and initializes the summary page.
 * @async
 * @function onloadFuncSummary
 * @returns {Promise<void>}
 */
async function onloadFuncSummary() {
    tasks = Object.values(await loadFromDatabase(`/tasks`));
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    getNumberOfTasks(tasks);
    greetingUser();
    greetingUserName();
    getUpcomingDeadline();
}


/**
 * Calculates and renders the number of tasks based on their progress and priority.
 * @function getNumberOfTasks
 * @param {Array<Object>} tasks - The array of task objects.
 * @returns {void}
 */
function getNumberOfTasks(tasks) {
    let toDoTasks = tasks.filter(task => task.progress === "todo");
    let inProgressTasks = tasks.filter(task => task.progress === "in progress");
    let awaitFeedbackTasks = tasks.filter(task => task.progress === "await feedback");
    let doneTasks = tasks.filter(task => task.progress === "done");
    let totalTasks = tasks.length;
    let urgentTasks = tasks.filter(task => task.priority === "Urgent");
    renderNumberOfTasks(toDoTasks, inProgressTasks, awaitFeedbackTasks, doneTasks, totalTasks, urgentTasks);
}


/**
 * Renders the number of tasks in various categories onto the page.
 * @function renderNumberOfTasks
 * @param {Array<Object>} toDoTasks - Array of tasks with "todo" status.
 * @param {Array<Object>} inProgressTasks - Array of tasks with "in progress" status.
 * @param {Array<Object>} awaitFeedbackTasks - Array of tasks awaiting feedback.
 * @param {Array<Object>} doneTasks - Array of tasks marked as "done".
 * @param {number} totalTasks - Total number of tasks.
 * @param {Array<Object>} urgentTasks - Array of tasks marked as "Urgent".
 * @returns {void}
 */
function renderNumberOfTasks(toDoTasks, inProgressTasks, awaitFeedbackTasks, doneTasks, totalTasks, urgentTasks) {
    document.getElementById('summary-todo-counter').innerHTML = toDoTasks.length;
    document.getElementById('tasks-in-progress-counter').innerHTML = inProgressTasks.length;
    document.getElementById('feedback-counter').innerHTML = awaitFeedbackTasks.length;
    document.getElementById('summary-done-counter').innerHTML = doneTasks.length;
    document.getElementById('tasks-in-board-counter').innerHTML = totalTasks;
    document.getElementById('summary-urgent-counter').innerHTML = urgentTasks.length;
}


/**
 * Displays a greeting message based on the current time of day.
 * @function greetingUser
 * @returns {void}
 */
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


/**
 * Displays the name of the logged-in user or a default message for guests.
 * @function greetingUserName
 * @returns {void}
 */
function greetingUserName() {
    if (loggedInUser) {
        let loggedInUserMail = loggedInUser.email;
        let contactDetails = contacts.find(c => c.email === loggedInUserMail);
        if (contactDetails) {
            document.getElementById('user-greeting').innerHTML = contactDetails.name;
        }
    } else {
        document.getElementById('user-greeting').innerHTML = "Guest";
    }
}


/**
 * Displays the upcoming deadline for urgent tasks or a message if there are none.
 * @function getUpcomingDeadline
 * @returns {void}
 */
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


/**
 * Formats a date string to a more readable format.
 * @function formattingDate
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
function formattingDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}


/**
 * Initializes animations when the DOM content is loaded.
 * @function animationSummaryResponsive
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function () {
    animationSummaryResponsive();
});


/**
 * Adds animation effects for responsive design on the summary page.
 * @function animationSummaryResponsive
 * @returns {void}
 */
function animationSummaryResponsive() {
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
            showAnimation = true;
        });
    } else {
        greetingSummaryRef.style.display = 'flex';
    }
}





