const roadmapFile = "data/roadmap.json";

let roadmap = null;

let completedDays =
    JSON.parse(localStorage.getItem("completedDays")) || [];

async function initializePortal() {

    await loadRoadmap();

    loadDashboard();

    renderModules();

}

async function loadRoadmap() {

    const response = await fetch(roadmapFile);

    roadmap = await response.json();

}

function loadDashboard() {

    document.getElementById("learningDay").innerText =
        completedDays.length + " / " +
        roadmap.academy.totalLearningDays;

    const percentage =
        (completedDays.length /
            roadmap.academy.totalLearningDays) * 100;

    document.getElementById("progressPercentage").innerText =
        percentage.toFixed(0) + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressText").innerText =
        completedDays.length +
        " of " +
        roadmap.academy.totalLearningDays +
        " Learning Days Completed";

}

function renderModules() {

    const container =
        document.getElementById("moduleContainer");

    container.innerHTML = "";

    roadmap.modules.forEach(module => {

        const card =
            document.createElement("div");

        card.className = "module-card";

        card.innerHTML = `

            <h3>📦 Module ${module.id}</h3>

            <h2>${module.title}</h2>

            <p><strong>Duration:</strong> ${module.duration} Learning Days</p>

            <p><strong>Level:</strong> ${module.level}</p>

            <p><strong>Status:</strong> ${module.status}</p>

            <button onclick="openModule(${module.id})">

                Open Module

            </button>

        `;

        container.appendChild(card);

    });

}

function openModule(id){

    const lesson =
        document.getElementById("lessonViewer");

    lesson.innerHTML = `

        <h2>📚 Module ${id}</h2>

        <br>

        <p>

        Learning Days for this module will appear here.

        </p>

        <br>

        <p>

        (Next Commit)

        </p>

    `;

}

initializePortal();
