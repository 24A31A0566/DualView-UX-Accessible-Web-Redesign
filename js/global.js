/* ============================================================
   GLOBAL.JS — DualView UX
   Shared accessibility system: mode, font, spacing, contrast,
   dark mode, links, toolbar open/close, localStorage persist.
   ============================================================ */

(function () {
  "use strict";

  var STORE = "dv-cfg";

  var DEFAULTS = {
    accessible: false,
    fontSize:   "md",      // "md" | "lg" | "xl"
    spacing:    "normal",  // "normal" | "wide" | "wider"
    contrast:   false,
    dark:       false,
    links:      false
  };

  /* ---- Storage ---- */
  function load() {
    try {
      var s = localStorage.getItem(STORE);
      return s ? Object.assign({}, DEFAULTS, JSON.parse(s)) : Object.assign({}, DEFAULTS);
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function save(cfg) {
    try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch (e) {}
  }

  /* ---- Expose globally ---- */
  window.DV = window.DV || {};
  window.DV.load     = load;
  window.DV.save     = save;
  window.DV.STORE    = STORE;
  window.DV.DEFAULTS = DEFAULTS;

  /* ---- Core apply function ---- */
  window.DV.apply = function (cfg) {
    var body = document.body;

    /* Accessible / inaccessible mode */
    body.classList.toggle("demo-bad", !cfg.accessible);

    /* Sync mode pill */
    var btnBad  = document.getElementById("mode-bad");
    var btnGood = document.getElementById("mode-good");
    setActive([btnBad, btnGood], cfg.accessible ? btnGood : btnBad);

    /* Font size */
    body.classList.remove("font-lg", "font-xl");
    if (cfg.fontSize === "lg") body.classList.add("font-lg");
    if (cfg.fontSize === "xl") body.classList.add("font-xl");
    setActive(
      [document.getElementById("fs-md"), document.getElementById("fs-lg"), document.getElementById("fs-xl")],
      cfg.fontSize === "xl" ? document.getElementById("fs-xl")
        : cfg.fontSize === "lg" ? document.getElementById("fs-lg")
        : document.getElementById("fs-md")
    );

    /* Line spacing */
    body.classList.remove("spacing-wide", "spacing-wider");
    if (cfg.spacing === "wide")  body.classList.add("spacing-wide");
    if (cfg.spacing === "wider") body.classList.add("spacing-wider");
    setActive(
      [document.getElementById("sp-normal"), document.getElementById("sp-wide"), document.getElementById("sp-wider")],
      cfg.spacing === "wide"  ? document.getElementById("sp-wide")
        : cfg.spacing === "wider" ? document.getElementById("sp-wider")
        : document.getElementById("sp-normal")
    );

    /* High contrast — mutually exclusive with dark mode */
    if (cfg.contrast) {
      body.classList.add("high-contrast");
      body.classList.remove("dark-mode");
      cfg.dark = false;
    } else {
      body.classList.remove("high-contrast");
    }
    syncCheck("tog-contrast", cfg.contrast);

    /* Dark mode */
    body.classList.toggle("dark-mode", cfg.dark && !cfg.contrast);
    syncCheck("tog-dark", cfg.dark);

    /* Highlight links */
    body.classList.toggle("highlight-links", cfg.links);
    syncCheck("tog-links", cfg.links);

    /* Page-specific hook */
    if (typeof window.DV.onApply === "function") {
      window.DV.onApply(cfg);
    }

    save(cfg);
  };

  /* ---- Helpers ---- */
  function setActive(group, active) {
    group.forEach(function (btn) {
      if (!btn) return;
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    if (active) {
      active.classList.add("active");
      active.setAttribute("aria-pressed", "true");
    }
  }

  function syncCheck(id, val) {
    var el = document.getElementById(id);
    if (el) el.checked = val;
  }

  function bind(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  function bindCheck(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("change", function () { fn(this.checked); });
  }

  function announce(msg) {
    var el = document.createElement("div");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.className = "sr-only";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2000);
  }

  /* ---- Toolbar init (called on demo pages) ---- */
  window.DV.initToolbar = function (cfg) {
    var tabBtn   = document.getElementById("tab-btn");
    var panelEl  = document.getElementById("a11y-panel");
    var closeBtn = document.getElementById("panel-close");
    var resetBtn = document.getElementById("panel-reset");

    if (!tabBtn || !panelEl) return;

    function openPanel() {
      panelEl.classList.add("open");
      tabBtn.parentElement.classList.add("open");
      tabBtn.setAttribute("aria-expanded", "true");
      tabBtn.setAttribute("aria-label", "Close accessibility controls");
      if (closeBtn) closeBtn.focus();
    }

    function closePanel() {
      panelEl.classList.remove("open");
      tabBtn.parentElement.classList.remove("open");
      tabBtn.setAttribute("aria-expanded", "false");
      tabBtn.setAttribute("aria-label", "Open accessibility controls");
      tabBtn.focus();
    }

    /* Toggle on tab button click */
    tabBtn.addEventListener("click", function () {
      panelEl.classList.contains("open") ? closePanel() : openPanel();
    });

    /* Close when clicking outside the panel */
    document.addEventListener("click", function (e) {
      if (
        panelEl.classList.contains("open") &&
        !panelEl.contains(e.target) &&
        !tabBtn.contains(e.target)
      ) {
        closePanel();
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closePanel);
    panelEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });

    /* Reset */
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        Object.assign(cfg, window.DV.DEFAULTS);
        window.DV.apply(cfg);
        announce("All settings reset.");
      });
    }

    /* Mode pill */
    bind("mode-bad",  function () { cfg.accessible = false; window.DV.apply(cfg); });
    bind("mode-good", function () { cfg.accessible = true;  window.DV.apply(cfg); });

    /* Font size */
    bind("fs-md", function () { cfg.fontSize = "md"; window.DV.apply(cfg); });
    bind("fs-lg", function () { cfg.fontSize = "lg"; window.DV.apply(cfg); });
    bind("fs-xl", function () { cfg.fontSize = "xl"; window.DV.apply(cfg); });

    /* Line spacing */
    bind("sp-normal", function () { cfg.spacing = "normal"; window.DV.apply(cfg); });
    bind("sp-wide",   function () { cfg.spacing = "wide";   window.DV.apply(cfg); });
    bind("sp-wider",  function () { cfg.spacing = "wider";  window.DV.apply(cfg); });

    /* Toggles */
    bindCheck("tog-contrast", function (v) { cfg.contrast = v; if (v) cfg.dark = false; window.DV.apply(cfg); });
    bindCheck("tog-dark",     function (v) { cfg.dark = v;     if (v) cfg.contrast = false; window.DV.apply(cfg); });
    bindCheck("tog-links",    function (v) { cfg.links = v;    window.DV.apply(cfg); });
  };

})();
