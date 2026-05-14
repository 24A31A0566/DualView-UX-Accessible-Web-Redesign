/* ============================================================
   BLIND.JS — DualView UX / UrbanCart
   Product alt text, button labels, overlays, search & filters.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.DV.load();

  /* ---- Hook: runs after every DV.apply() ---- */
  window.DV.onApply = function (c) {
    updateAltText(c);
    updateProductButtons(c);
    updateAltOverlays();
    updateButtonOverlays();
  };

  window.DV.initToolbar(cfg);
  window.DV.apply(cfg);

  /* ---- Swap alt attributes based on mode ---- */
  function updateAltText(c) {
    document.querySelectorAll("img[data-alt-bad]").forEach(function (img) {
      img.setAttribute("alt", c.accessible ? img.dataset.altGood : img.dataset.altBad);
    });
  }

  /* ---- Update button text and aria-label based on mode ---- */
  function updateProductButtons(c) {
    document.querySelectorAll(".product-card").forEach(function (card) {
      var nameEl = card.querySelector(".product-name");
      var btn    = card.querySelector(".product-btn");
      if (!nameEl || !btn) return;
      var name = nameEl.textContent.trim();
      btn.textContent = "View product";
      btn.setAttribute("aria-label", c.accessible ? "View product: " + name : "View product");
    });
  }

  /* ---- Alt overlays: always show on hover, update text content ---- */
  function updateAltOverlays() {
    document.querySelectorAll(".product-img-wrap").forEach(function (wrap, i) {
      var overlay = document.getElementById("p" + (i + 1) + "-overlay");
      var img     = wrap.querySelector("img");
      if (!overlay || !img) return;
      overlay.classList.add("visible");
      overlay.textContent = "Screen reader: " + img.getAttribute("alt");
    });
  }

  /* ---- Button overlays: always show on hover, update text content ---- */
  function updateButtonOverlays() {
    document.querySelectorAll(".product-card").forEach(function (card, i) {
      var btn     = card.querySelector(".product-btn");
      var overlay = document.getElementById("p" + (i + 1) + "-btn-overlay");
      if (!btn || !overlay) return;
      overlay.classList.add("visible");
      overlay.textContent = "Screen reader: " + btn.getAttribute("aria-label");
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

  /* ---- Category & price filters ---- */
  document.querySelectorAll(".filter-group input[type='checkbox']").forEach(function (cb) {
    cb.addEventListener("change", applyFilters);
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

  /* ---- Filter logic ---- */
  function applyFilters() {
    filterProducts(searchInput ? searchInput.value.trim().toLowerCase() : "");
  }

  function filterProducts(query) {
    var grid  = document.getElementById("product-grid");
    var cards = grid.querySelectorAll(".product-card");
    var any   = false;

    var activeCats   = [];
    var activePrices = [];

    document.querySelectorAll(".filter-group input[type='checkbox']:checked").forEach(function (cb) {
      var val = cb.value;
      if (val.includes("-") || val.includes("+")) {
        activePrices.push(val);
      } else {
        activeCats.push(val);
      }
    });

    cards.forEach(function (card) {
      var name      = (card.getAttribute("data-name") || "").toLowerCase();
      var cat       = (card.getAttribute("data-cat")  || "").toLowerCase();
      var priceText = card.querySelector(".product-price").textContent;
      var price     = parseInt(priceText.replace(/[₹,]/g, ""), 10);

      var matchQ     = !query || name.includes(query);
      var matchCat   = activeCats.length === 0 || activeCats.indexOf(cat) !== -1;
      var matchPrice = activePrices.length === 0 || activePrices.some(function (range) {
        if (range === "0-500")    return price < 500;
        if (range === "500-1000") return price >= 500 && price <= 1000;
        if (range === "1000-2000") return price > 1000 && price <= 2000;
        if (range === "2000+")    return price > 2000;
        return false;
      });

      var show = matchQ && matchCat && matchPrice;
      card.style.display = show ? "" : "none";
      if (show) any = true;
    });

    /* No results message */
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

    /* Live results count */
    var label = document.getElementById("results-label");
    if (label) {
      var count = grid.querySelectorAll(".product-card:not([style*='none'])").length;
      label.textContent = count + " Product" + (count !== 1 ? "s" : "");
    }
  }
});
