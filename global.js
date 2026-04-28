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
    fontSize:   "md",       // "sm" | "md" | "lg"
    spacing:    "normal",   // "normal" | "wide" | "wider"
    contrast:   false,
    dark:       false,
    links:      false,
    alttext:    false
  };

  /* ---- Storage ---- */
  function load() {
    try {
      var s = localStorage.getItem(STORE);
      return s ? Object.assign({}, DEFAULTS, JSON.parse(s)) : Object.assign({}, DEFAULTS);
    } catch (e) { return Object.assign({}, DEFAULTS); }
  }

  function save(cfg) {
    try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch (e) {}
  }

  /* ---- Expose globally ---- */
  window.DV = window.DV || {};
  window.DV.load    = load;
  window.DV.save    = save;
  window.DV.STORE   = STORE;
  window.DV.DEFAULTS = DEFAULTS;

  /* ---- Core apply function ---- */
  window.DV.apply = function (cfg) {
    var body = document.body;

    /* Accessible / inaccessible mode */
    if (cfg.accessible) {
      body.classList.remove("demo-bad");
    } else {
      body.classList.add("demo-bad");
    }

    /* Sync mode pill buttons */
    var btnBad  = document.getElementById("mode-bad");
    var btnGood = document.getElementById("mode-good");
    setActive([btnBad, btnGood], cfg.accessible ? btnGood : btnBad);

    /* Sync navbar mode button if on home */
    var homeBtn = document.getElementById("home-mode-btn");
    if (homeBtn) {
      homeBtn.textContent = cfg.accessible ? "Accessible: On" : "Accessible: Off";
      homeBtn.setAttribute("aria-pressed", String(cfg.accessible));
      cfg.accessible ? homeBtn.classList.add("on") : homeBtn.classList.remove("on");
    }

    /* Font size */
    body.classList.remove("font-sm", "font-lg");
    if (cfg.fontSize === "sm") body.classList.add("font-sm");
    if (cfg.fontSize === "lg") body.classList.add("font-lg");
    setActive(
      [document.getElementById("fs-sm"), document.getElementById("fs-md"), document.getElementById("fs-lg")],
      cfg.fontSize === "sm" ? document.getElementById("fs-sm") :
      cfg.fontSize === "lg" ? document.getElementById("fs-lg") :
                              document.getElementById("fs-md")
    );

    /* Spacing */
    body.classList.remove("spacing-wide", "spacing-wider");
    if (cfg.spacing === "wide")  body.classList.add("spacing-wide");
    if (cfg.spacing === "wider") body.classList.add("spacing-wider");
    setActive(
      [document.getElementById("sp-normal"), document.getElementById("sp-wide"), document.getElementById("sp-wider")],
      cfg.spacing === "wide"  ? document.getElementById("sp-wide") :
      cfg.spacing === "wider" ? document.getElementById("sp-wider") :
                                document.getElementById("sp-normal")
    );

    /* High contrast — mutually exclusive with dark */
    if (cfg.contrast) {
      body.classList.add("high-contrast");
      body.classList.remove("dark-mode");
      cfg.dark = false;
    } else {
      body.classList.remove("high-contrast");
    }
    var togContrast = document.getElementById("tog-contrast");
    if (togContrast) togContrast.checked = cfg.contrast;

    /* Dark mode */
    if (cfg.dark && !cfg.contrast) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    var togDark = document.getElementById("tog-dark");
    if (togDark) togDark.checked = cfg.dark;

    /* Highlight links */
    cfg.links ? body.classList.add("highlight-links") : body.classList.remove("highlight-links");
    var togLinks = document.getElementById("tog-links");
    if (togLinks) togLinks.checked = cfg.links;

    /* Alt text toggle state sync */
    var togAlt = document.getElementById("tog-alttext");
    if (togAlt) togAlt.checked = cfg.alttext;

    /* Page-specific hooks */
    if (typeof window.DV.onApply === "function") {
      window.DV.onApply(cfg);
    }

    save(cfg);
  };

  /* ---- Helper ---- */
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

  /* ---- Toolbar init (demo pages only) ---- */
  window.DV.initToolbar = function (cfg) {
    var tabBtn   = document.getElementById("tab-btn");
    var panelEl  = document.getElementById("a11y-panel");
    var closeBtn = document.getElementById("panel-close");
    var resetBtn = document.getElementById("panel-reset");

    if (!tabBtn || !panelEl) return;

    function openPanel() {
      panelEl.classList.add("open");
      tabBtn.setAttribute("aria-expanded", "true");
      tabBtn.setAttribute("aria-label", "Close accessibility controls");
      if (closeBtn) closeBtn.focus();
    }

    function closePanel() {
      panelEl.classList.remove("open");
      tabBtn.setAttribute("aria-expanded", "false");
      tabBtn.setAttribute("aria-label", "Open accessibility controls");
      tabBtn.focus();
    }

    tabBtn.addEventListener("click", function () {
      panelEl.classList.contains("open") ? closePanel() : openPanel();
    });

    if (closeBtn) closeBtn.addEventListener("click", closePanel);

    panelEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        Object.assign(cfg, window.DV.DEFAULTS);
        window.DV.apply(cfg);
        announce("All settings reset.");
      });
    }

    /* Mode pill */
    var btnBad  = document.getElementById("mode-bad");
    var btnGood = document.getElementById("mode-good");
    if (btnBad)  btnBad.addEventListener("click",  function () { cfg.accessible = false; window.DV.apply(cfg); });
    if (btnGood) btnGood.addEventListener("click", function () { cfg.accessible = true;  window.DV.apply(cfg); });

    /* Font */
    bind("fs-sm",  function () { cfg.fontSize = "sm"; window.DV.apply(cfg); });
    bind("fs-md",  function () { cfg.fontSize = "md"; window.DV.apply(cfg); });
    bind("fs-lg",  function () { cfg.fontSize = "lg"; window.DV.apply(cfg); });

    /* Spacing */
    bind("sp-normal", function () { cfg.spacing = "normal"; window.DV.apply(cfg); });
    bind("sp-wide",   function () { cfg.spacing = "wide";   window.DV.apply(cfg); });
    bind("sp-wider",  function () { cfg.spacing = "wider";  window.DV.apply(cfg); });

    /* Contrast */
    bindCheck("tog-contrast", function (v) {
      cfg.contrast = v;
      if (v) cfg.dark = false;
      window.DV.apply(cfg);
    });

    /* Dark mode */
    bindCheck("tog-dark", function (v) {
      cfg.dark = v;
      if (v) cfg.contrast = false;
      window.DV.apply(cfg);
    });

    /* Links */
    bindCheck("tog-links", function (v) { cfg.links = v; window.DV.apply(cfg); });

    /* Alt text */
    bindCheck("tog-alttext", function (v) { cfg.alttext = v; window.DV.apply(cfg); });
  };

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

})();
