const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const unitList = document.querySelector("[data-units]");
const filters = document.querySelectorAll("[data-filter]");
const planTabs = document.querySelectorAll("[data-plan-tab]");
const planImage = document.querySelector("[data-plan-image]");
const planLabel = document.querySelector("[data-plan-label]");
const planTitle = document.querySelector("[data-plan-title]");
const planDescription = document.querySelector("[data-plan-description]");
const planButtons = document.querySelector("[data-plan-buttons]");
const selectedUnit = document.querySelector("[data-selected-unit]");
const form = document.querySelector("[data-form]");
const formNote = document.querySelector("[data-form-note]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealObserver;
const whatsappNumber = "201006080664"; // Replace with your WhatsApp number in international format 

const statusLabels = {
  available: "متاحة",
  reserved: "محجوزة",
  sold: "مباعة",
};

const typeLabels = {
  retail: "محل تجاري",
  restaurant: "مطعم / كافيه",
  admin: "إداري / عيادة",
};

const floorLabels = {
  ground: "الدور الأرضي",
  first: "الدور الأول",
  second: "الدور الثاني",
};

const units = [
  { id: "G-01", floor: "ground", type: "restaurant", area: "واجهة رئيسية", price: "عند الطلب", status: "available" },
  { id: "G-02", floor: "ground", type: "retail", area: "متوسطة", price: "عند الطلب", status: "available" },
  { id: "G-03", floor: "ground", type: "retail", area: "متوسطة", price: "عند الطلب", status: "reserved" },
  { id: "G-04", floor: "ground", type: "retail", area: "متوسطة", price: "عند الطلب", status: "available" },
  { id: "G-05", floor: "ground", type: "retail", area: "متوسطة", price: "عند الطلب", status: "available" },
  { id: "G-09", floor: "ground", type: "restaurant", area: "كبيرة", price: "عند الطلب", status: "available" },
  { id: "G-10", floor: "ground", type: "retail", area: "كبيرة", price: "عند الطلب", status: "sold" },
  { id: "G-15", floor: "ground", type: "retail", area: "متوسطة", price: "عند الطلب", status: "available" },
  { id: "F-01", floor: "first", type: "retail", area: "كبيرة", price: "عند الطلب", status: "available" },
  { id: "F-03", floor: "first", type: "retail", area: "متوسطة", price: "عند الطلب", status: "available" },
  { id: "F-07", floor: "first", type: "retail", area: "متوسطة", price: "عند الطلب", status: "reserved" },
  { id: "F-11", floor: "first", type: "restaurant", area: "كبيرة", price: "عند الطلب", status: "available" },
  { id: "F-17", floor: "first", type: "retail", area: "كبيرة", price: "عند الطلب", status: "available" },
  { id: "Admin 1", floor: "second", type: "admin", area: "كبيرة", price: "عند الطلب", status: "available" },
  { id: "Admin 3", floor: "second", type: "admin", area: "كبيرة", price: "عند الطلب", status: "reserved" },
  { id: "Admin 5", floor: "second", type: "admin", area: "متوسطة", price: "عند الطلب", status: "available" },
  { id: "Admin 8", floor: "second", type: "admin", area: "كبيرة", price: "عند الطلب", status: "available" },
];

const plans = {
  ground: {
    label: "Ground Floor",
    title: "الدور الأرضي التجاري",
    image: "assets/project/ground-plan.jpg",
    description: "وحدات G-01 إلى G-15 مناسبة للمطاعم والمحلات والخدمات اليومية، مع واجهات مباشرة على الممشى.",
    ids: ["G-01", "G-02", "G-03", "G-04", "G-05", "G-06", "G-07", "G-08", "G-09", "G-10", "G-11", "G-12", "G-13", "G-14", "G-15"],
  },
  first: {
    label: "First Floor",
    title: "الدور الأول التجاري",
    image: "assets/project/first-plan.jpg",
    description: "وحدات F-01 إلى F-17 لأنشطة العرض والتجزئة والكافيهات، مع توزيع واضح حول الممر الرئيسي.",
    ids: ["F-01", "F-02", "F-03", "F-04", "F-05", "F-06", "F-07", "F-08", "F-09", "F-10", "F-11", "F-12", "F-13", "F-14", "F-15", "F-16", "F-17"],
  },
  second: {
    label: "Second Floor",
    title: "الدور الثاني إداري وعيادات",
    image: "assets/project/second-plan.jpg",
    description: "مساحات Admin & Clinics مخصصة للمكاتب والعيادات والخدمات الإدارية.",
    ids: ["Admin 1", "Admin 2", "Admin 3", "Admin 4", "Admin 5", "Admin 6", "Admin 7", "Admin 8"],
  },
};

const updateHeader = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 34);
  }
};

const prepareReveal = (item, motion = "fade-up", delay = 0) => {
  if (!item) {
    return;
  }

  item.setAttribute("data-reveal", "");
  item.dataset.motion = motion;
  item.style.setProperty("--reveal-delay", `${delay}ms`);
};

const observeReveals = (items, motion = "fade-up", step = 70) => {
  const validItems = [...items].filter(Boolean);

  if (reduceMotion || !revealObserver) {
    validItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  validItems.forEach((item, index) => {
    if (!item.hasAttribute("data-reveal")) {
      prepareReveal(item, motion, Math.min(index, 6) * step);
    } else if (!item.style.getPropertyValue("--reveal-delay")) {
      item.style.setProperty("--reveal-delay", `${Math.min(index, 6) * step}ms`);
    }

    revealObserver.observe(item);
  });
};

const initReveals = () => {
  const revealPairs = [
    [".hero .eyebrow", "hero-copy", 0],
    [".hero h1", "hero-title", 110],
    [".hero-subtitle", "hero-copy", 210],
    [".hero-text", "hero-copy", 300],
    [".hero-actions", "fade-up", 390],
    [".hero-facts > div", "stagger-up", 480],
    [".quick-brief", "fade-soft", 0],
    ["#about .section-copy", "from-right", 0],
    [".about-logo", "scale-soft", 80],
    [".competitive-edge", "fade-up", 180],
    ["#about .about-panel", "from-left", 110],
    ["#mall .mall-grid > div:first-child", "from-left", 0],
    ["#mall .spec-grid", "from-right", 120],
    ["#features .section-heading", "from-right", 0],
    ["#features .feature-grid article", "stagger-up", 90],
    ["#units .section-heading", "from-right", 0],
    [".filters label", "stagger-up", 90],
    ["#plans .section-heading", "from-left", 0],
    [".plan-tabs button", "stagger-up", 80],
    [".plan-image-wrap", "scale-soft", 90],
    [".plan-details", "from-left", 150],
    ["#gallery .section-heading", "from-right", 0],
    [".gallery-grid button", "scale-soft", 80],
    ["#location .location-grid > div:first-child", "from-right", 0],
    ["#location .map-card", "scale-soft", 140],
    [".nearby-list li", "stagger-up", 80],
    ["#updates .section-copy", "from-left", 0],
    [".update-list article", "stagger-up", 85],
    ["#booking .booking-grid > div:first-child", "from-right", 0],
    [".lead-form", "from-left", 120],
    [".lead-form label, .lead-form button", "stagger-up", 70],
    ["#contact .contact-grid > div:first-child", "from-right", 0],
    [".contact-cards a", "stagger-up", 85],
    [".site-footer", "fade-soft", 0],
  ];

  revealPairs.forEach(([selector, motion, baseDelay]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      prepareReveal(item, motion, baseDelay + Math.min(index, 6) * 70);
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  observeReveals(document.querySelectorAll("[data-reveal]"));
};

const renderUnits = () => {
  const active = Object.fromEntries([...filters].map((filter) => [filter.dataset.filter, filter.value]));
  const visible = units.filter((unit) => {
    return (
      (active.floor === "all" || unit.floor === active.floor) &&
      (active.status === "all" || unit.status === active.status) &&
      (active.type === "all" || unit.type === active.type)
    );
  });

  unitList.innerHTML = visible
    .map(
      (unit) => `
        <article class="unit-card">
          <header>
            <h3>${unit.id}</h3>
            <span class="status ${unit.status}">${statusLabels[unit.status]}</span>
          </header>
          <div class="unit-meta">
            <div><span>الدور</span><strong>${floorLabels[unit.floor]}</strong></div>
            <div><span>النوع</span><strong>${typeLabels[unit.type]}</strong></div>
            <div><span>المساحة</span><strong>${unit.area}</strong></div>
            <div><span>السعر</span><strong>${unit.price}</strong></div>
          </div>
        </article>
      `,
    )
    .join("");

  if (!visible.length) {
    unitList.innerHTML = '<p class="empty-state">لا توجد وحدات مطابقة للفلاتر الحالية.</p>';
  }

  const renderedItems = unitList.querySelectorAll(".unit-card, .empty-state");
  renderedItems.forEach((item, index) => prepareReveal(item, "stagger-up", Math.min(index, 6) * 65));
  observeReveals(renderedItems);
};

const selectPlanUnit = (unitId) => {
  const data = units.find((unit) => unit.id === unitId);
  selectedUnit.innerHTML = data
    ? `<strong>${data.id}</strong><br>${floorLabels[data.floor]} - ${typeLabels[data.type]}<br>الحالة: ${statusLabels[data.status]}<br>السعر: ${data.price}`
    : `<strong>${unitId}</strong><br>تفاصيل الوحدة تُضاف عند اعتماد جدول المساحات والأسعار.`;

  planButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.textContent === unitId);
  });
};

const setPlan = (key) => {
  const plan = plans[key];
  planTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.planTab === key));
  planImage.src = plan.image;
  planImage.alt = plan.title;
  planLabel.textContent = plan.label;
  planTitle.textContent = plan.title;
  planDescription.textContent = plan.description;
  selectedUnit.textContent = "اختر وحدة من القائمة لعرض تفاصيلها.";
  planButtons.innerHTML = plan.ids.map((id) => `<button type="button">${id}</button>`).join("");
  planButtons.querySelectorAll("button").forEach((button, index) => prepareReveal(button, "stagger-up", Math.min(index, 6) * 45));
  observeReveals(planButtons.querySelectorAll("button"));
};

updateHeader();
initReveals();
renderUnits();
setPlan("ground");

window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("click", (event) => {
  const isMenuClick = nav.contains(event.target) || menuToggle.contains(event.target);

  if (!isMenuClick && nav.classList.contains("is-open")) {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  }
});

filters.forEach((filter) => filter.addEventListener("change", renderUnits));

planTabs.forEach((tab) => {
  tab.addEventListener("click", () => setPlan(tab.dataset.planTab));
});

planButtons.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    selectPlanUnit(event.target.textContent);
  }
});

document.querySelectorAll("[data-gallery]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.gallery;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const messageFields = [
      ["الاسم", formData.get("name")],
      ["رقم الهاتف", formData.get("phone")],
      ["البريد الإلكتروني", formData.get("email")],
      ["نوع الوحدة المطلوبة", formData.get("unitType")],
      ["الرسالة", formData.get("message")],
    ].filter(([, value]) => String(value || "").trim());

    const message = [
      "مرحبًا فريق Zemam Development،",
      "لدي طلب جديد بخصوص مشروع ARC WALK.",
      "",
      "بيانات العميل:",
      ...messageFields.map(([label, value]) => `- ${label}: ${String(value).trim()}`),
      "",
      "تم إرسال البيانات من نموذج الحجز على الموقع.",
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    form.reset();

    if (formNote) {
      formNote.textContent = "تم تجهيز رسالة واتساب بالبيانات. راجعها ثم اضغط إرسال.";
    }
  });
}
