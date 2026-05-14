/* ============================================================
   HOME.JS — DualView UX
   Accordion open/close behaviour for the About section.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = this.getAttribute("aria-expanded") === "true";
      var body = document.getElementById(this.getAttribute("aria-controls"));
      this.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (body) body.classList.toggle("open", !expanded);
    });
  });
});
