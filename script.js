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

  // sort by score (highest first)
  filtered.sort((a, b) => b.score - a.score);

  filtered.forEach((job, index) => {
    const div = document.createElement("div");
    div.className = "job-card";

    const isTop = index === 0;

    div.innerHTML = `
      ${isTop ? `<div class="badge">⭐ Best match for you</div>` : ""}

      <div class="job-header">
        <div>
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>
        </div>
        <div class="score">${job.score}%</div>
      </div>

      <div class="why-title">Why this matches you</div>
      <ul class="why-list">
        ${job.reasons.map(r => `<li>${r}</li>`).join("")}
      </ul>

      <div class="confidence">
        ${getConfidenceText(job.score)}
      </div>

      <a href="${job.url}" target="_blank" class="job-link">
        View role →
      </a>
    `;

    if (isTop) {
      div.classList.add("top-card");
    }

    container.appendChild(div);
  });
}

function getConfidenceText(score) {
  if (score >= 90) return "🔥 Strong match based on your background";
  if (score >= 70) return "👍 Solid fit with relevant experience";
  if (score >= 50) return "⚡ Potential stretch opportunity";
  return "💡 Lower match, but could be interesting";
}

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  renderJobs();
}

loadJobs();
