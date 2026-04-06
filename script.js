div.innerHTML = `
  ${isTop ? `<div class="badge">⭐ Best match for you</div>` : ""}

  <div class="job-row">

    <!-- LEFT -->
    <div class="job-left">
      <div class="job-title">${job.title}</div>
      <div class="job-company">${job.company}</div>
      <div class="score">${job.score}%</div>
    </div>

    <!-- MIDDLE -->
    <div class="job-middle">
      <div class="why-title">Why this matches you</div>
      <ul class="why-list">
        ${job.reasons.map(r => `<li>${r}</li>`).join("")}
      </ul>
      <div class="confidence">
        ${getConfidenceText(job.score)}
      </div>
    </div>

    <!-- RIGHT -->
    <div class="job-right">
      <a href="${job.url}" target="_blank" class="job-link">
        View role →
      </a>
    </div>

  </div>
`;
