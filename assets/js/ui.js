const Theme = {
  STORAGE_KEY: "rawand-theme",

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.set(saved || "light");

    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        this.set(next);
      });
    });
  },

  set(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(this.STORAGE_KEY, theme);
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.innerHTML = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }
};

const UI = {
  showLoader(container) {
    if (!container) return;
    const text = typeof I18N !== "undefined" ? I18N.t("loading") : "Loading...";
    container.innerHTML = `<div class="loader"><div class="loader-spinner"></div><p>${text}</p></div>`;
  },

  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  formatPrice(price) {
    const n = Math.round(Number(price) || 0);
    const formatted = n.toLocaleString("en-US");
    if (STORE_CONFIG.currency === "IQD") {
      return `${formatted} ${STORE_CONFIG.currencySymbol}`;
    }
    return `${STORE_CONFIG.currencySymbol}${Number(price).toFixed(2)}`;
  },

  formatDate(ts) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  },

  getProductUrl(id) {
    return `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}product.html?id=${id}`;
  },

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("Link copied to clipboard!");
    } catch {
      this.showToast("Failed to copy link", "error");
    }
  },

  async shareProduct(product) {
    const url = this.getProductUrl(product.id);
    const data = { title: product.name, text: `Check out ${product.name}`, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* user cancelled */
      }
    } else {
      this.copyToClipboard(url);
    }
  },

  renderQRCode(container, url) {
    if (!container || typeof QRCode === "undefined") return;
    container.innerHTML = "";
    new QRCode(container, { text: url, width: 128, height: 128, colorDark: "#7c3aed", colorLight: "#ffffff" });
  },

  animateOnScroll() {
    const els = document.querySelectorAll(".animate-in");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
  }
};
