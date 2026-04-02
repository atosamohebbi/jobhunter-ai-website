let allJobs = [];
let currentFilter = "all";

// 👉 Your profile (this is your "AI input")
const userProfile = {
  yearsExperience: 3,
  preferredRoles: ["product", "ux"],
  domains: ["saas", "b2b", "developer tools"]
};

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
    console.error(error);
  }
}

// 🧠 MATCH LOGIC
function calculateMatch(job) {
  let score = 0;
  let reasons = [];

  // Role match
  if (job.tags.some(tag => userProfile.preferredRoles.includes(tag))) {
    score += 30;
    reasons.push("Matches your preferred role");
  }

  // Experience match
  if (job.years_required <= userProfile.yearsExperience + 1) {
    score += 30;
    reasons.push("Fits your experience level");
  } else {
    score += 10;
    reasons.push("Slight stretch opportunity");
  }

  // Domain match
  if (userProfile.domains.includes(job.domain)) {
    score += 25;
    reasons.push("Relevant industry experience");
  }

  // Bonus
  if (job.tags.includes("b2b")) {
    score += 10;
    reasons.push("B2B product experience");
  }

  // Cap score
  score = Math.min(score, 95);

  return { score, reasons };
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  let jobsWithScores = allJobs.map(job => {
    const match = calculateMatch(job);
    return { ...job, ...match };
  });

  // 🔥 Sort by best match
  jobsWithScores.sort((a, b) => b.score - a.score);

  let filteredJobs = jobsWithScores;

  if (currentFilter === "product") {
    filteredJobs = jobsWithScores.filter(job =>
      job.tags.includes("product")
    );
  }

  if (currentFilter === "ux") {
    filteredJobs = jobsWithScores.filter(job =>
      job.tags.includes("ux") || job.tags.includes("ui")
    );
  }

  filteredJobs.forEach((job, index) => {
    const div = document.createElement("div");
    div.className = "job-card";

    const badge = index === 0 ? "⭐ Best Match" : "";

    div.innerHTML = `
      <div class="job-header">
        <div>
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>
        </div>
        <div class="score">${job.score}%</div>
      </div>

      <div class="badge">${badge}</div>

      <div class="match-title">Why this matches you:</div>
      ${job.reasons.map(r => `<div class="match-item">• ${r}</div>`).join("")}

      <a href="${job.url}" target="_blank" class="job-link">
        View role →
      </a>
    `;

    container.appendChild(div);
  });
}

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filters button").forEach(btn =>
    btn.classList.remove("active")
  );

  event.target.classList.add("active");

  renderJobs();
}

loadJobs();