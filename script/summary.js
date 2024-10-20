/**
 * Loads task and contact data from the database and initializes the summary page.
 * @async
 * @function onloadFuncSummary
 * @returns {Promise<void>} - Resolves when data loading is complete.
 */
async function onloadFuncSummary() {
    tasks = Object.values(await loadFromDatabase(`/tasks`));
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    getNumberOfTasks(tasks);
    getUpcomingDeadline();
    handleResponsiveLayout()
}


/**
 * Adjusts the layout based on the window width.
 * @function handleResponsiveLayout
 * @returns {void}
 */
function handleResponsiveLayout() {
    if (window.innerWidth < 1280) {
        animationSummaryResponsive();
    } else {
        greetingUser();
        greetingUserName();
    }
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
    let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
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
 * Handles the responsive layout for the summary page by determining 
 * whether to show a greeting animation or all elements based on screen width.
 * @function animationSummaryResponsive
 * @returns {void}
 */
function animationSummaryResponsive() {
    const greetingSummary = document.getElementById("greeting-summary");
    const headerSummary = document.getElementById("header-summary");
    const tasksSummary = document.getElementById("ctn-tasks-summary");
    const isAnimationDone = localStorage.getItem('greetingAnimationDone') === 'true';
    greetingUser();
    greetingUserName();
    if (window.innerWidth <= 1280) {
        handleAnimation(isAnimationDone, greetingSummary, headerSummary, tasksSummary);
    } else {
        showAllElements(greetingSummary, headerSummary, tasksSummary);
    }
}


/**
 * Manages the animation display logic based on whether the greeting animation 
 * has been completed or not.
 * @function handleAnimation
 * @param {boolean} isAnimationDone - Indicates if the greeting animation has been completed.
 * @param {HTMLElement} greetingSummary - The element displaying the greeting message.
 * @param {HTMLElement} headerSummary - The element for the header section.
 * @param {HTMLElement} tasksSummary - The element for the tasks section.
 * @returns {void}
 */
function handleAnimation(isAnimationDone, greetingSummary, headerSummary, tasksSummary) {
    if (!isAnimationDone) {
        handleAnimationStart(greetingSummary, headerSummary, tasksSummary);
    } else {
        handleAnimationComplete(greetingSummary, headerSummary, tasksSummary);
    }
}


/**
 * Initiates the greeting animation by hiding the header and tasks sections 
 * and displaying the greeting message for a specified duration.
 * @function handleAnimationStart
 * @param {HTMLElement} greetingSummary - The element displaying the greeting message.
 * @param {HTMLElement} headerSummary - The element for the header section.
 * @param {HTMLElement} tasksSummary - The element for the tasks section.
 * @returns {void}
 */
function handleAnimationStart(greetingSummary, headerSummary, tasksSummary) {
    headerSummary.style.display = "none";
    tasksSummary.style.display = "none";
    greetingSummary.style.display = "flex";
    setTimeout(() => {
        greetingSummary.style.display = "none";
        headerSummary.style.display = "flex";
        tasksSummary.style.display = "flex";
        localStorage.setItem('greetingAnimationDone', 'true');
    }, 2000);
}


/**
 * Completes the animation by hiding the greeting message and showing the 
 * header and tasks sections.
 * @function handleAnimationComplete
 * @param {HTMLElement} greetingSummary - The element displaying the greeting message.
 * @param {HTMLElement} headerSummary - The element for the header section.
 * @param {HTMLElement} tasksSummary - The element for the tasks section.
 * @returns {void}
 */
function handleAnimationComplete(greetingSummary, headerSummary, tasksSummary) {
    greetingSummary.style.display = "none";
    headerSummary.style.display = "flex";
    tasksSummary.style.display = "flex";
}


/**
 * Shows all elements in the summary layout.
 * @function showAllElements
 * @param {HTMLElement} greetingSummary - The element displaying the greeting message.
 * @param {HTMLElement} headerSummary - The element for the header section.
 * @param {HTMLElement} tasksSummary - The element for the tasks section.
 * @returns {void}
 */
function showAllElements(greetingSummary, headerSummary, tasksSummary) {
    greetingSummary.style.display = "flex";
    headerSummary.style.display = "flex";
    tasksSummary.style.display = "flex";
}


