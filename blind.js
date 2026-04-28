/* blind.js — DualView UX Blind Demo */
document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.DV.load();
  cfg.accessible = false; /* always start inaccessible */

  window.DV.onApply = function (c) {
    updateProductButtons(c);
    updateAltText(c);
    updateAltOverlays(c); /* always-on: just refresh text */
  };

  window.DV.initToolbar(cfg);
  window.DV.apply(cfg);

  /* ---- Product button link text ---- */
  function updateProductButtons(c) {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var nameEl = card.querySelector(".product-name");
      var btn    = card.querySelector(".product-btn");
      if (!nameEl || !btn) return;
      var name = nameEl.textContent.trim();
      if (c.accessible) {
        btn.textContent = "View: " + name;
        btn.setAttribute("aria-label", "View product: " + name);
      } else {
        btn.textContent = "View product";
        btn.setAttribute("aria-label", "View product");
      }
    });
  }

  /* ---- Alt text attribute swap ---- */
  function updateAltText(c) {
    document.querySelectorAll("img[data-alt-bad]").forEach(function (img) {
      img.setAttribute("alt",
        c.accessible ? img.getAttribute("data-alt-good") : img.getAttribute("data-alt-bad")
      );
    });
  }

  /* ---- Alt overlay: always visible on hover ---- */
  function updateAltOverlays(c) {
    document.querySelectorAll(".product-img-wrap").forEach(function (wrap, i) {
      var overlay = document.getElementById("p" + (i + 1) + "-overlay");
      var img     = wrap.querySelector("img");
      if (!overlay || !img) return;
      /* Always show on hover — just update the text content */
      overlay.classList.add("visible");
      overlay.textContent = "Screen reader: " + img.getAttribute("alt");
    });
  }

  /* ---- Search ---- */
  var searchForm  = document.querySelector(".search-bar");
  var searchInput = document.getElementById("product-search");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      filterProducts(searchInput.value.trim().toLowerCase());
    });
    searchInput.addEventListener("input", function () {
      filterProducts(this.value.trim().toLowerCase());
    });
  }

  /* ---- Category filters ---- */
  document.querySelectorAll(".filter-group input[type='checkbox']").forEach(function (cb) {
    cb.addEventListener("change", function () { applyFilters(); });
  });

  var clearBtn = document.querySelector(".filter-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      document.querySelectorAll(".filter-group input[type='checkbox']").forEach(function (cb) {
        cb.checked = false;
      });
      if (searchInput) searchInput.value = "";
      filterProducts("");
    });
  }

  function filterProducts(query) {
    var grid  = document.getElementById("product-grid");
    var cards = grid.querySelectorAll(".product-card");
    var any   = false;

    var activeCats = [];
    document.querySelectorAll(".filter-group input[type='checkbox']:checked").forEach(function (cb) {
      activeCats.push(cb.value);
    });

    cards.forEach(function (card) {
      var name = (card.getAttribute("data-name") || "").toLowerCase();
      var cat  = (card.getAttribute("data-cat")  || "").toLowerCase();
      var matchQ   = !query || name.includes(query);
      var matchCat = activeCats.length === 0 || activeCats.indexOf(cat) !== -1;
      var show = matchQ && matchCat;
      card.style.display = show ? "" : "none";
      if (show) any = true;
    });

    var noRes = grid.querySelector(".no-results");
    if (!any) {
      if (!noRes) {
        var msg = document.createElement("p");
        msg.className = "no-results";
        msg.textContent = "No products match your search.";
        grid.appendChild(msg);
      }
    } else {
      if (noRes) noRes.remove();
    }

    var label = document.getElementById("results-label");
    if (label) {
      var count = grid.querySelectorAll(".product-card:not([style*='none'])").length;
      label.textContent = count + " Product" + (count !== 1 ? "s" : "");
    }
  }

  function applyFilters() {
    filterProducts(searchInput ? searchInput.value.trim().toLowerCase() : "");
  }
});
