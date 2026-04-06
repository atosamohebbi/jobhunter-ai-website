let allJobs = [];
let currentFilter = "all";

async function loadJobs() {
  try {
    const response = await fetch("jobs.json");

    if (!response.ok) {
      throw new Error("jobs.json not found");
    }

    allJobs = await response.json();

    document.getElementById("loading").style.display = "none";

    document.getElementById("last-updated").innerText =
      "Last updated: " + new Date().toLocaleString();

    renderJobs();
  } catch (error) {
    console.error("LOAD ERROR:", error);
    document.getElementById("loading").innerText = "Failed to load jobs.";
  }
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  let jobs = currentFilter === "all"
    ? allJobs
    : allJobs.filter(j => j.category === currentFilter);

  jobs.sort((a, b) => (b.score || 0) - (a.score || 0));

  jobs.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "card";

    if (index === 0) {
      card.classList.add("top");
    }

    card.innerHTML = `
      ${index === 0 ? `<div class="badge">⭐ Best match</div>` : ""}

      <div class="row">
        <div>
          <div class="title">${job.title || ""}</div>
          <div class="company">${job.company || ""}</div>

          <ul>
            ${(job.reasons || []).map(r => `<li>${r}</li>`).join("")}
          </ul>

          <div class="confidence">${getConfidence(job.score || 0)}</div>
        </div>

        <div class="right">
          <div class="score">${job.score || 0}%</div>
          <a href="${job.url}" target="_blank">View role →</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function getConfidence(score) {
  if (score >= 90) return "🔥 Strong match";
  if (score >= 70) return "👍 Good fit";
  if (score >= 50) return "⚡ Potential";
  return "💡 Lower match";
}

function setFilter(e, filter) {
  currentFilter = filter;

  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");

  renderJobs();
}

loadJobs();
