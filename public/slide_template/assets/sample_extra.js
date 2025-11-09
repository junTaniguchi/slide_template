// Sample extra script injected via slides.json assets.scripts
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-ai-field='wrap_visual_theme']").forEach((node) => {
    node.setAttribute("title", "Extra JS applied");
  });
});
