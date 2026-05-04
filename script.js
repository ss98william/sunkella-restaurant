/**
 * Sunkella — Lógica de interfaz
 * Requiere: Tailwind Play CDN (define `tailwind`), Lucide UMD (`lucide`).
 * Orden en HTML: primero cdn.tailwindcss.com, luego este archivo.
 */

/* ---------- Configuración de Tailwind (tema Coastal Modern) ---------- */
if (typeof tailwind !== "undefined") {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          display: ['"Cormorant Garamond"', "Georgia", "serif"],
          sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        },
        colors: {
          ocean: {
            950: "#061a2e",
            900: "#0a2540",
            800: "#0f3558",
            700: "#154a73",
          },
          sand: {
            50: "#fdfbf7",
            100: "#f6f0e6",
            200: "#e8dcc4",
            300: "#d4c4a8",
          },
          coral: {
            DEFAULT: "#f2654a",
            dark: "#d94d33",
            light: "#ff8a72",
          },
        },
        boxShadow: {
          soft: "0 4px 24px -4px rgba(6, 26, 46, 0.12)",
          lift: "0 12px 40px -12px rgba(6, 26, 46, 0.2)",
        },
      },
    },
  };
}

/* ---------- WhatsApp Business (URL centralizada) ---------- */
var SUNKELLA_WHATSAPP = {
  /** Número en formato internacional sin + (ej. Perú 51 + celular) */
  phoneE164: "51900000000",
  /** Mensaje predeterminado al abrir el chat */
  defaultMessage: "Hola Sunkella, quiero reservar una mesa en Huanchaco.",
};

function buildWhatsAppHref() {
  var q = encodeURIComponent(SUNKELLA_WHATSAPP.defaultMessage);
  return "https://wa.me/" + SUNKELLA_WHATSAPP.phoneE164 + "?text=" + q;
}

function initWhatsAppFloat() {
  var el = document.getElementById("whatsapp-float");
  if (el) {
    el.href = buildWhatsAppHref();
  }
}

function refreshLucideIcons() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

function initLucideAndYear() {
  refreshLucideIcons();
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var panel = document.getElementById("mobile-nav");
  if (!toggle || !panel) return;

  var menuIcon = toggle.querySelector(".menu-icon");
  var closeIcon = toggle.querySelector(".close-icon");

  function setOpen(open) {
    panel.classList.toggle("hidden", !open);
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (menuIcon) menuIcon.classList.toggle("hidden", open);
    if (closeIcon) closeIcon.classList.toggle("hidden", !open);
    refreshLucideIcons();
  }

  toggle.addEventListener("click", function () {
    setOpen(panel.classList.contains("hidden"));
  });

  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });
}

function initMenuTabs() {
  var tabs = [
    { tab: document.getElementById("tab-entradas"), panel: document.getElementById("panel-entradas") },
    { tab: document.getElementById("tab-fondo"), panel: document.getElementById("panel-fondo") },
    { tab: document.getElementById("tab-bebidas"), panel: document.getElementById("panel-bebidas") },
  ].filter(function (x) {
    return x.tab && x.panel;
  });

  if (tabs.length === 0) return;

  var activeIndex = 0;

  function activate(index) {
    tabs.forEach(function (item, i) {
      var selected = i === index;
      item.tab.setAttribute("aria-selected", selected ? "true" : "false");
      item.tab.tabIndex = selected ? 0 : -1;
      item.panel.classList.toggle("hidden", !selected);
      item.panel.hidden = !selected;
      item.tab.classList.toggle("bg-white", selected);
      item.tab.classList.toggle("shadow-sm", selected);
      item.tab.classList.toggle("text-ocean-900", selected);
      item.tab.classList.toggle("text-ocean-700/90", !selected);
    });
    refreshLucideIcons();
  }

  activate(0);

  tabs.forEach(function (item, index) {
    item.tab.addEventListener("click", function () {
      activeIndex = index;
      activate(activeIndex);
      item.tab.focus();
    });

    item.tab.addEventListener("keydown", function (e) {
      var next = activeIndex;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = (activeIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = (activeIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = tabs.length - 1;
      } else {
        return;
      }
      activeIndex = next;
      activate(activeIndex);
      tabs[activeIndex].tab.focus();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initWhatsAppFloat();
  initLucideAndYear();
  initMobileNav();
  initMenuTabs();
});
