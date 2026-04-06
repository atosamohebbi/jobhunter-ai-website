let allJobs = [];
let currentFilter = "all";

async function loadJobs() {
  try {
    const response = await fetch("jobs.json");
    allJobs = await response.json();

    document.getElementById("loading").style.display = "none";

    const now = new Date();
    document.getElementById("last-updated").innerText =
      "Last updated: " + now.toLocaleString();

    renderJobs();
  } catch (error) {
    console.error(error);
    document.getElementById("loading").innerText = "Failed to load jobs.";
  }
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  let filtered = allJobs;

  if (currentFilter !== "all") {
    filtered = allJobs.filter(job => job.category === currentFilter);
  }

  filtered.sort((a, b) => (b.score || 0) - (a.score || 0));

  filtered.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "job-card";

    if (index === 0) {
      card.classList.add("top-card");
    }

    card.innerHTML = `
      ${index === 0 ? `<div class="badge">⭐ Best match for you</div>` : ""}

      <div class="job-row">

        <div class="job-left">
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>

          <div class="why-title">Why this matches you</div>
          <ul class="why-list">
            ${(job.reasons || []).map(r => `<li>${r}</li>`).join("")}
          </ul>

          <div class="confidence">
            ${getConfidenceText(job.score || 0)}
          </div>
        </div>

        <div class="job-right">
          <div class="score">${job.score || 0}%</div>
          <a href="${job.url}" target="_blank" class="job-link">
            View role →
          </a>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

function getConfidenceText(score) {
  if (score >= 90) return "🔥 Strong match based on your background";
  if (score >= 70) return "👍 Solid fit with relevant experience";
  if (score >= 50) return "⚡ Potential stretch opportunity";
  return "💡 Lower match, but could be interesting";
}

function setFilter(event, filter) {
  currentFilter = filter;

  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  renderJobs();
}

loadJobs();
