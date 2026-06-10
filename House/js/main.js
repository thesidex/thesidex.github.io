(function () {
  const images = document.querySelectorAll(".gallery-image");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = document.querySelector(".gallery-prev");
  const nextBtn = document.querySelector(".gallery-next");
  const currentSlide = document.getElementById("current-slide");
  const totalSlides = document.getElementById("total-slides");
  const viewport = document.querySelector(".gallery-viewport");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.getElementById("year");

  let currentIndex = 0;
  let loadedCount = 0;

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function updateGallery(index) {
    currentIndex = (index + images.length) % images.length;

    images.forEach((img, i) => {
      img.classList.toggle("active", i === currentIndex);
    });

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });

    if (currentSlide) {
      currentSlide.textContent = currentIndex + 1;
    }
  }

  function checkImagesLoaded() {
    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        loadedCount++;
      } else {
        img.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount > 0 && viewport) {
            viewport.classList.add("has-image");
          }
        });
        img.addEventListener("error", () => {
          img.classList.add("error");
        });
      }
    });

    if (loadedCount > 0 && viewport) {
      viewport.classList.add("has-image");
    }
  }

  if (totalSlides) {
    totalSlides.textContent = images.length;
  }

  prevBtn?.addEventListener("click", () => updateGallery(currentIndex - 1));
  nextBtn?.addEventListener("click", () => updateGallery(currentIndex + 1));

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.dataset.index, 10);
      updateGallery(index);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") updateGallery(currentIndex - 1);
    if (e.key === "ArrowRight") updateGallery(currentIndex + 1);
  });

  let touchStartX = 0;
  viewport?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport?.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      updateGallery(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  checkImagesLoaded();
  updateGallery(0);
})();
