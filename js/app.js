/* ==========================================
   Enterprise AI & MLOps Bootcamp Portal
   Version 1.0
========================================== */

const TOTAL_DAYS = 200;

// ----------------------------
// Local Storage
// ----------------------------

let completedDays =
    JSON.parse(localStorage.getItem("completedDays")) || [];

// ----------------------------
// Load Roadmap
// ----------------------------

async function loadRoadmap() {

    try {

        const response = await fetch("data/roadmap.json");

        const data = await response.json();

        createCurriculum(data.phases);

        updateProgress();

    }

    catch (error) {

        console.error("Unable to load roadmap.json");

        console.error(error);

    }

}

// ----------------------------
// Create Curriculum
// ----------------------------

function createCurriculum(phases) {

    const container = document.getElementById("phaseContainer");

    container.innerHTML = "";

    phases.forEach((phase) => {

        const phaseCard = document.createElement("div");

        phaseCard.className = "phase-card";

        phaseCard.innerHTML = `

            <h2>${phase.title}</h2>

            <p>

                <strong>Duration:</strong>

                ${phase.weeks} Weeks

            </p>

            <p>

                ${phase.description}

            </p>

            <br>

            <button onclick="showMessage('${phase.title}')">

                View Curriculum

            </button>

        `;

        container.appendChild(phaseCard);

    });

}

// ----------------------------
// Progress
// ----------------------------

function updateProgress() {

    const progress = document.getElementById("progressFill");

    const progressText = document.getElementById("progressText");

    const percentage =

        (completedDays.length / TOTAL_DAYS) * 100;

    progress.style.width = percentage + "%";

    progressText.innerHTML =

        `${completedDays.length} / ${TOTAL_DAYS} Days Completed`;

}

// ----------------------------
// Temporary Button
// ----------------------------

function showMessage(name) {

    alert(

        "Phase Selected:\\n\\n"

        + name

        + "\\n\\n(Detailed curriculum coming next.)"

    );

}

// ----------------------------
// Future Function
// ----------------------------

// Later we will create

// Week View

// Day View

// Check Mark

// Notes

// Assignments

// Interview Questions

// Progress Analytics

// Search

// Dashboard

// ----------------------------

loadRoadmap();
