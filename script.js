let allJobs = [];
let currentFilter = "all";

async function loadJobs() {
  try {
    const response = await fetch("jobs.json");
    allJobs = await response.json();

    // enrich jobs with score + reasons
    allJobs = allJobs.map(job => ({
      ...job,
      score: calculateScore(job),
      reasons: generateReasons(job)
    }));

    document.getElementById("loading").style.display = "none";

    const now = new Date();
    document.getElementById("last-updated").innerText =
      "Last updated: " + now.toLocaleString();

    renderJobs();
  } catch (error) {
    document.getElementById("loading").innerText = "Failed to load jobs.";
  }
}

/* 🔥 SIMPLE SCORING LOGIC */
function calculateScore(job) {
  let score = 50;

  if (job.tags.includes("product")) score += 20;
  if (job.tags.includes("b2b")) score += 10;
  if (job.years_required <= 5) score += 10;

  if (job.experience_level === "senior") score -= 10;
  if (job.experience_level === "staff") score -= 20;

  return Math.min(100, Math.max(0, score));
}

/* 🔥 GENERATE REASONS */
function generateReasons(job) {
  const reasons = [];

  if (job.tags.includes("product")) {
    reasons.push("Matches your preferred role");
  }

  if (job.years_required <= 5) {
    reasons.push("Fits your experience level");
  } else {
    reasons.push("Slight stretch opportunity");
  }

  if (job.tags.includes("b2b")) {
    reasons.push("Relevant B2B experience");
  }

  return reasons;
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  let filtered = allJobs;

  if (currentFilter !== "all") {
    filtered = allJobs.filter(job =>
      job.tags.includes(currentFilter)
    );
  }

  // sort by score
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
