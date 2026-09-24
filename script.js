/* ==========================================
   DEADLINE RADAR
   Designed & Built by Rishitha
========================================== */


/* ---------- DATA ---------- */

let deadlines = JSON.parse(
    localStorage.getItem("deadlineRadarData")
) || [];

let currentSection = "dashboard";


/* ---------- ELEMENTS ---------- */

const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const loginForm =
    document.getElementById("loginForm");

const loginPassword =
    document.getElementById("loginPassword");

const showPassword =
    document.getElementById("showPassword");

const logoutBtn =
    document.getElementById("logoutBtn");

const addDeadlineBtn =
    document.getElementById("addDeadlineBtn");

const modal =
    document.getElementById("deadlineModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const closeModal =
    document.getElementById("closeModal");

const deadlineForm =
    document.getElementById("deadlineForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskSubject =
    document.getElementById("taskSubject");

const taskDate =
    document.getElementById("taskDate");

const taskPriority =
    document.getElementById("taskPriority");

const deadlineList =
    document.getElementById("deadlineList");

const searchInput =
    document.getElementById("searchInput");


/* ---------- LOGIN ---------- */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const username =
            document.getElementById("loginEmail")
            .value
            .trim();

        const password =
            loginPassword.value.trim();

        if (!username || !password) {
            return;
        }

        localStorage.setItem(
            "deadlineRadarLoggedIn",
            "true"
        );

        openDashboard();

    }
);


/* ---------- PASSWORD ---------- */

showPassword.addEventListener(
    "click",
    function () {

        if (loginPassword.type === "password") {

            loginPassword.type = "text";

            showPassword.textContent = "Hide";

        } else {

            loginPassword.type = "password";

            showPassword.textContent = "Show";

        }

    }
);


/* ---------- LOGIN STATE ---------- */

function openDashboard() {

    loginPage.classList.add("hidden");

    dashboardPage.classList.remove("hidden");

    /* IMPORTANT:
       Make sure modal is ALWAYS closed
       when dashboard opens.
    */

    modal.classList.add("hidden");

    updateDate();

    updateDashboard();

}


function openLogin() {

    dashboardPage.classList.add("hidden");

    loginPage.classList.remove("hidden");

    modal.classList.add("hidden");

}


logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "deadlineRadarLoggedIn"
        );

        openLogin();

    }
);


/* ---------- CHECK LOGIN ---------- */

if (
    localStorage.getItem(
        "deadlineRadarLoggedIn"
    ) === "true"
) {

    openDashboard();

}


/* ---------- DATE ---------- */

function updateDate() {

    const now = new Date();

    document.getElementById(
        "todayDate"
    ).textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* ---------- MODAL ---------- */

function openModal() {

    modal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    taskDate.min = today;

    taskTitle.focus();

}


function closeDeadlineModal() {

    modal.classList.add("hidden");

    document.body.style.overflow = "auto";

    deadlineForm.reset();

}


addDeadlineBtn.addEventListener(
    "click",
    openModal
);

closeModal.addEventListener(
    "click",
    closeDeadlineModal
);

modalOverlay.addEventListener(
    "click",
    closeDeadlineModal
);


/* ---------- ADD DEADLINE ---------- */

deadlineForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const newDeadline = {

            id: Date.now(),

            title:
                taskTitle.value.trim(),

            subject:
                taskSubject.value.trim(),

            date:
                taskDate.value,

            priority:
                taskPriority.value,

            completed: false

        };


        deadlines.push(newDeadline);

        saveData();

        closeDeadlineModal();

        updateDashboard();

    }
);


/* ---------- SAVE ---------- */

function saveData() {

    localStorage.setItem(
        "deadlineRadarData",
        JSON.stringify(deadlines)
    );

}


/* ---------- DATE HELPERS ---------- */

function todayDate() {

    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;

}


function deadlineDateObject(deadline) {

    const date =
        new Date(
            deadline.date + "T00:00:00"
        );

    date.setHours(0, 0, 0, 0);

    return date;

}


function isToday(deadline) {

    return (
        deadlineDateObject(deadline)
        .getTime()
        ===
        todayDate().getTime()
    );

}


function isOverdue(deadline) {

    return (
        !deadline.completed
        &&
        deadlineDateObject(deadline)
        <
        todayDate()
    );

}


function isUpcoming(deadline) {

    return (
        !deadline.completed
        &&
        deadlineDateObject(deadline)
        >=
        todayDate()
    );

}


/* ---------- FORMAT DATE ---------- */

function formatDate(date) {

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ---------- NAVIGATION ---------- */

document
    .querySelectorAll(".nav-btn")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".nav-btn")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                button.classList.add(
                    "active"
                );

                currentSection =
                    button.dataset.section;

                updateDashboard();

            }
        );

    });


/* ---------- SEARCH ---------- */

searchInput.addEventListener(
    "input",
    function () {

        renderDeadlines();

    }
);


/* ---------- DASHBOARD ---------- */

function updateDashboard() {

    updateStats();

    updateProgress();

    updateSectionText();

    renderDeadlines();

}


/* ---------- STATS ---------- */

function updateStats() {

    const total =
        deadlines.length;

    const today =
        deadlines.filter(
            deadline =>
                isToday(deadline)
                &&
                !deadline.completed
        ).length;

    const overdue =
        deadlines.filter(
            deadline =>
                isOverdue(deadline)
        ).length;

    const completed =
        deadlines.filter(
            deadline =>
                deadline.completed
        ).length;


    document.getElementById(
        "totalCount"
    ).textContent = total;

    document.getElementById(
        "todayCount"
    ).textContent = today;

    document.getElementById(
        "overdueCount"
    ).textContent = overdue;

    document.getElementById(
        "completedCount"
    ).textContent = completed;

}


/* ---------- PROGRESS ---------- */

function updateProgress() {

    const total =
        deadlines.length;

    const completed =
        deadlines.filter(
            deadline =>
                deadline.completed
        ).length;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById(
        "progressValue"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "progressBar"
    ).style.width =
        percentage + "%";

}


/* ---------- SECTION TEXT ---------- */

function updateSectionText() {

    const data = {

        dashboard: {
            title: "Dashboard",
            section: "Upcoming Deadlines",
            description:
                "Stay on top of what’s coming next."
        },

        today: {
            title: "Due Today",
            section: "Due Today",
            description:
                "These deadlines need your attention today."
        },

        upcoming: {
            title: "Upcoming",
            section: "Upcoming Deadlines",
            description:
                "Your next tasks and assignments."
        },

        overdue: {
            title: "Overdue",
            section: "Overdue Deadlines",
            description:
                "Deadlines that have already passed."
        },

        completed: {
            title: "Completed",
            section: "Completed Tasks",
            description:
                "Tasks you have successfully finished."
        }

    };


    const selected =
        data[currentSection];


    document.getElementById(
        "pageTitle"
    ).textContent =
        selected.title;


    document.getElementById(
        "sectionTitle"
    ).textContent =
        selected.section;


    document.getElementById(
        "sectionDescription"
    ).textContent =
        selected.description;

}


/* ---------- FILTER ---------- */

function getFilteredDeadlines() {

    let result =
        [...deadlines];


    if (currentSection === "dashboard") {

        result =
            result.filter(
                deadline =>
                    !deadline.completed
            );

    }


    if (currentSection === "today") {

        result =
            result.filter(
                deadline =>
                    isToday(deadline)
                    &&
                    !deadline.completed
            );

    }


    if (currentSection === "upcoming") {

        result =
            result.filter(
                deadline =>
                    isUpcoming(deadline)
            );

    }


    if (currentSection === "overdue") {

        result =
            result.filter(
                deadline =>
                    isOverdue(deadline)
            );

    }


    if (currentSection === "completed") {

        result =
            result.filter(
                deadline =>
                    deadline.completed
            );

    }


    const search =
        searchInput.value
        .trim()
        .toLowerCase();


    if (search) {

        result =
            result.filter(
                deadline =>

                    deadline.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    deadline.subject
                        .toLowerCase()
                        .includes(search)
            );

    }


    result.sort(
        (a, b) =>
            deadlineDateObject(a)
            -
            deadlineDateObject(b)
    );


    return result;

}


/* ---------- RENDER ---------- */

function renderDeadlines() {

    const list =
        getFilteredDeadlines();


    deadlineList.innerHTML = "";


    if (list.length === 0) {

        deadlineList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">✓</div>

                <h3>No deadlines here</h3>

                <p>
                    ${
                        currentSection === "completed"
                        ? "Completed tasks will appear here."
                        : "You're all caught up for now."
                    }
                </p>

            </div>

        `;

        return;

    }


    list.forEach(
        function (deadline) {

            const item =
                document.createElement("div");

            item.className =
                "deadline-item";


            const completedClass =
                deadline.completed
                    ? "completed"
                    : "";


            const doneClass =
                deadline.completed
                    ? "done"
                    : "";


            let status;

            if (deadline.completed) {

                status = "Completed";

            } else if (isOverdue(deadline)) {

                status = "Overdue";

            } else if (isToday(deadline)) {

                status = "Due today";

            } else {

                status = "Upcoming";

            }


            item.innerHTML = `

                <button
                    class="check-btn ${completedClass}"
                    onclick="toggleDeadline(${deadline.id})"
                    title="Complete"
                >
                    ${deadline.completed ? "✓" : ""}
                </button>


                <div class="deadline-info">

                    <h3 class="${doneClass}">
                        ${escapeHTML(deadline.title)}
                    </h3>

                    <div class="deadline-meta">

                        <span class="subject">
                            ${escapeHTML(deadline.subject)}
                        </span>

                        <span class="priority ${deadline.priority}">
                            ${capitalize(deadline.priority)}
                        </span>

                    </div>

                </div>


                <div class="deadline-date">

                    <strong>
                        ${formatDate(deadline.date)}
                    </strong>

                    <small>
                        ${status}
                    </small>

                </div>


                <button
                    class="delete-btn"
                    onclick="deleteDeadline(${deadline.id})"
                    title="Delete deadline"
                >
                    ×
                </button>

            `;


            deadlineList.appendChild(item);

        }
    );

}


/* ---------- COMPLETE ---------- */

function toggleDeadline(id) {

    deadlines =
        deadlines.map(
            deadline => {

                if (deadline.id === id) {

                    return {
                        ...deadline,
                        completed:
                            !deadline.completed
                    };

                }

                return deadline;

            }
        );


    saveData();

    updateDashboard();

}


/* ---------- DELETE ---------- */

function deleteDeadline(id) {

    const confirmDelete =
        confirm(
            "Delete this deadline?"
        );


    if (!confirmDelete) {
        return;
    }


    deadlines =
        deadlines.filter(
            deadline =>
                deadline.id !== id
        );


    saveData();

    updateDashboard();

}


/* ---------- UTILITIES ---------- */

function capitalize(text) {

    return (
        text.charAt(0).toUpperCase()
        +
        text.slice(1)
    );

}


function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;

}


/* ---------- ESC KEY ---------- */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
            &&
            !modal.classList.contains("hidden")
        ) {

            closeDeadlineModal();

        }

    }
);


/* ---------- INITIAL ---------- */

updateDate();