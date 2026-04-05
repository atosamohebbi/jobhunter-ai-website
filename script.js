let allJobs = [];
let currentFilter = "all";

const userProfile = {
  role: "product",
  yearsExperience: 3,
  domains: ["saas", "b2b", "developer tools"]
};

async function loadJobs() {
  try {
    const response = await fetch("./jobs.json");
    allJobs = await response.json();

    document.getElementById("loading").style.display = "none";

    const now = new Date();
    document.getElementById("last-updated").innerText =
      "Last updated: " + now.toLocaleString();

    updateJobs();

  } catch (error) {
    document.getElementById("loading").innerText = "Failed to load jobs.";
    console.error(error);
  }
}


function updateJobs() {
  allJobs = allJobs.map(job => {
    const score = calculateScore(job);
    const reasons = generateReasons(job);
    return { ...job, score, reasons };
  });

  renderJobs();
}

function calculateScore(job) {
  let score = 0;

  if (job.category === userProfile.role) score += 40;

  if (job.years_required <= userProfile.yearsExperience + 1) score += 25;

  if (userProfile.domains.includes(job.domain)) score += 25;

  return score;
}

function generateReasons(job) {
  let reasons = [];

  if (job.category === userProfile.role)
    reasons.push("Matches your preferred role");

  if (job.years_required <= userProfile.yearsExperience + 1)
    reasons.push("Fits your experience level");

  if (userProfile.domains.includes(job.domain))
    reasons.push("Relevant industry experience");

  if (job.years_required > userProfile.yearsExperience + 2)
    reasons.push("Slight stretch opportunity");

  return reasons;
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  let filtered = allJobs;

  if (currentFilter !== "all") {
    filtered = allJobs.filter(job => job.category === currentFilter);
  }

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

    if (isTop) div.classList.add("top-card");

    container.appendChild(div);
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
