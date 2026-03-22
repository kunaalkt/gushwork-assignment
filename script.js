/* ----------------- HERO SECTION CAROUSEL ----------------------- */
const thumbs = document.querySelectorAll(".thumb");
const mainImg = document.getElementById("carousel-img");
const sfImg = document.getElementById("sf-img");

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    // update active state
    thumbs.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");

    // swap main image
    const src = thumb.querySelector("img").src.replace("w=200", "w=800");
    mainImg.src = src;

    // sync sticky fold thumbnail
    if (sfImg) sfImg.src = src.replace("w=800", "w=200");
  });
});

/* ----------------- DOWNLOAD TECHNICAL SHEET POPUP  ----------------------- */
const overlay = document.getElementById("modal-overlay");
const closeBtn = document.getElementById("modal-close");
const downloadBtn = document.querySelector(".btn-download");
const submitBtn = document.getElementById("modal-submit");
const emailInput = document.getElementById("modal-email");

function openModal() {
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => emailInput.focus(), 50);
}

function closeModal() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

downloadBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
});

submitBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  if (!email || !email.includes("@")) {
    emailInput.focus();
    emailInput.style.borderColor = "#e53e3e";
    emailInput.style.boxShadow = "0 0 0 3px rgba(229,62,62,0.12)";
    setTimeout(() => {
      emailInput.style.borderColor = "";
      emailInput.style.boxShadow = "";
    }, 1800);
    return;
  }

  submitBtn.textContent = "Sent! Check your inbox.";
  submitBtn.style.background = "#276749";
  submitBtn.disabled = true;
  setTimeout(() => closeModal(), 2000);
});

/* ----------------- REQUEST QUOTE POPUP ----------------------- */
const fOverlay = document.getElementById("f-modal-overlay");
const fClose = document.getElementById("f-modal-close");
const fTrigger = document.querySelector(".btn-cta");
const fSubmit = document.getElementById("f-btn-submit");
const fEmail = document.getElementById("f-email");
const fSelect = document.getElementById("f-country-select");
const fCodeDisp = document.getElementById("f-code-display");

function fOpenModal() {
  fOverlay.classList.add("f-open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("f-name").focus(), 50);
}

function fCloseModal() {
  fOverlay.classList.remove("f-open");
  document.body.style.overflow = "";
}

fTrigger.addEventListener("click", fOpenModal);
fClose.addEventListener("click", fCloseModal);

fOverlay.addEventListener("click", (e) => {
  if (e.target === fOverlay) fCloseModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && fOverlay.classList.contains("f-open"))
    fCloseModal();
});

fSelect.addEventListener("change", () => {
  fCodeDisp.textContent = fSelect.value;
});

fSubmit.addEventListener("click", () => {
  const email = fEmail.value.trim();
  if (!email || !email.includes("@")) {
    fEmail.focus();
    fEmail.style.borderColor = "#e53e3e";
    fEmail.style.boxShadow = "0 0 0 3px rgba(229,62,62,0.12)";
    setTimeout(() => {
      fEmail.style.borderColor = "";
      fEmail.style.boxShadow = "";
    }, 1800);
    return;
  }
  fSubmit.textContent = "Request Submitted!";
  fSubmit.style.background = "#276749";
  fSubmit.disabled = true;
  setTimeout(() => {
    fCloseModal();
    setTimeout(() => {
      fSubmit.textContent = "Submit Form";
      fSubmit.style.background = "";
      fSubmit.disabled = false;
    }, 400);
  }, 2000);
});

/* ----------------- PRODUCT STICKY FOLD ----------------------- */

const stickyFold = document.getElementById("sticky-fold");
const heroSection = document.querySelector(".product-hero");
const sfImg1 = document.getElementById("sf-img");
let lastScrollY = window.scrollY;

const origUpdateCarousel = updateCarousel;
function updateCarousel(index) {
  origUpdateCarousel(index);
  setTimeout(() => {
    sfImg1.src = images[(index + images.length) % images.length].replace(
      "w=800",
      "w=200",
    );
  }, 160);
}

function onScroll() {
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  const scrollingDown = window.scrollY > lastScrollY;
  lastScrollY = window.scrollY;

  const navbar = document.getElementById("navbar-wrapper");
  const navH = navbar ? navbar.offsetHeight : 0;
  stickyFold.style.top = navH + "px";

  if (heroBottom < 0 && scrollingDown) {
    // Past hero, scrolling down → show
    stickyFold.classList.add("sf-visible");
    stickyFold.setAttribute("aria-hidden", "false");
  } else if (!scrollingDown) {
    // Back in hero, scrolling up → hide
    stickyFold.classList.remove("sf-visible");
    stickyFold.setAttribute("aria-hidden", "true");
  } else if (heroBottom > 0) {
    // Hero visible → always hide
    stickyFold.classList.remove("sf-visible");
    stickyFold.setAttribute("aria-hidden", "true");
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ----------------- HERO IMAGE ZOOM FUNCTIONALITY ----------------------- */

(function initImageZoom() {
  if (window.innerWidth <= 900) return;

  const wrapper = document.getElementById("main-image");
  const img = document.getElementById("carousel-img");
  const lens = document.querySelector(".zoom-lens");
  const result = document.querySelector(".zoom-result");

  if (!wrapper || !img || !lens || !result) return;

  const ZOOM = 2.8; // magnification factor
  const LENS_W = 120; // lens box width  (px)
  const LENS_H = 100; // lens box height (px)

  lens.style.width = LENS_W + "px";
  lens.style.height = LENS_H + "px";

  /* ---- update zoom result background to match current carousel image ---- */
  function syncResultImage() {
    result.style.backgroundImage = `url('${img.src}')`;
    result.style.backgroundSize =
      img.naturalWidth * ZOOM + "px " + img.naturalHeight * ZOOM + "px";
  }

  /* Re-sync whenever the carousel swaps the src */
  const srcObserver = new MutationObserver(syncResultImage);
  srcObserver.observe(img, { attributes: true, attributeFilter: ["src"] });

  img.addEventListener("load", syncResultImage);
  syncResultImage();

  /* ---- mouse move handler ---- */
  function onMouseMove(e) {
    const rect = wrapper.getBoundingClientRect();

    // Cursor position relative to wrapper
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamp lens so it doesn't overflow the wrapper
    let lx = x - LENS_W / 2;
    let ly = y - LENS_H / 2;
    lx = Math.max(0, Math.min(lx, rect.width - LENS_W));
    ly = Math.max(0, Math.min(ly, rect.height - LENS_H));

    lens.style.left = lx + "px";
    lens.style.top = ly + "px";

    // Background position: centre of lens maps to same spot on zoomed image
    const bx = -(lx * ZOOM - (result.offsetWidth - LENS_W * ZOOM) / 2);
    const by = -(ly * ZOOM - (result.offsetHeight - LENS_H * ZOOM) / 2);

    result.style.backgroundPosition = bx + "px " + by + "px";
  }

  /* ---- show / hide ---- */
  wrapper.addEventListener("mouseenter", () => {
    // Skip if hovering a carousel button
    if (window.innerWidth <= 900) return;
    syncResultImage();
    lens.style.display = "block";
    result.style.display = "block";
  });

  wrapper.addEventListener("mouseleave", () => {
    lens.style.display = "none";
    result.style.display = "none";
  });

  wrapper.addEventListener("mousemove", onMouseMove);

  /* ---- hide if window resizes below breakpoint ---- */
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth <= 900) {
        lens.style.display = "none";
        result.style.display = "none";
      }
    },
    { passive: true },
  );
})();
