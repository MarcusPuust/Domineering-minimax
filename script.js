// This file is intentionally simple for now.
// It keeps the page beginner-friendly and does not add any game logic.

document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.querySelector(".page-title");

  if (pageTitle) {
    pageTitle.textContent = "Domineering Minimax";
  }

  console.log("Domineering Minimax page loaded successfully.");
});
