(function () {
  "use strict";

  /* ============================================================
     1. NAVBAR — scroll state + mobile toggle
  ============================================================ */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });


  /* ============================================================
     2. SCROLL REVEAL — Intersection Observer
  ============================================================ */
  const revealTargets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-up"
  );

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ============================================================
     3. ANIMATED STAT COUNTERS
  ============================================================ */
  const counters     = document.querySelectorAll(".stat-counter");
  let countersStarted = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute("data-target"), 10);
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  const impactSection   = document.getElementById("impact");
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach(animateCounter);
          counterObserver.unobserve(impactSection);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (impactSection) {
    counterObserver.observe(impactSection);
  }


  /* ============================================================
     4. GALLERY FILTER
  ============================================================ */
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.getAttribute("data-filter");

      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      // Show / hide cards with a fade
      galleryCards.forEach(function (card) {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          card.style.display = "";
          card.style.opacity = "0";
          card.classList.remove("hidden");
          requestAnimationFrame(function () {
            card.style.transition = "opacity 0.4s ease";
            card.style.opacity    = "1";
          });
        } else {
          card.style.opacity    = "0";
          card.style.transition = "opacity 0.3s ease";
          setTimeout(function () {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });


  /* ============================================================
     5. TESTIMONIAL CAROUSEL
  ============================================================ */
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const dots             = document.querySelectorAll(".dot");
  let currentSlide       = 0;
  let autoSlideInterval;

  function goToSlide(index) {
    testimonialCards.forEach(function (card) { card.classList.remove("active"); });
    dots.forEach(function (dot) { dot.classList.remove("active"); });

    testimonialCards[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const index = parseInt(dot.getAttribute("data-index"), 10);
      goToSlide(index);
      resetAutoSlide();
    });
  });

  function autoSlide() {
    const next = (currentSlide + 1) % testimonialCards.length;
    goToSlide(next);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 5000);
  }

  autoSlideInterval = setInterval(autoSlide, 5000);


  /* ============================================================
     6. DONATION FORM INTERACTIONS
  ============================================================ */
  const amountBtns  = document.querySelectorAll(".amount-btn");
  const customInput = document.getElementById("customAmount");
  const freqBtns    = document.querySelectorAll(".freq-btn");
  const donateBtn   = document.getElementById("donateBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose  = document.getElementById("modalClose");

  // Preset amount selection
  amountBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      amountBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      if (customInput) {
        customInput.value = "";
        customInput.placeholder = "0.00";
      }
    });
  });

  // Clear preset when typing custom
  if (customInput) {
    customInput.addEventListener("input", function () {
      if (customInput.value.trim() !== "") {
        amountBtns.forEach(function (b) { b.classList.remove("active"); });
      }
    });
  }

  // Frequency toggle
  freqBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      freqBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
    });
  });

  // Donation submission
  if (donateBtn) {
    donateBtn.addEventListener("click", function () {
      const activeAmount = document.querySelector(".amount-btn.active");
      const customVal    = customInput ? customInput.value.trim() : "";
      const amount       = customVal || (activeAmount ? activeAmount.getAttribute("data-amount") : null);

      const nameInput  = document.querySelector('.donor-input[type="text"]') ||
                         document.querySelectorAll(".donor-input")[0];
      const emailInput = document.querySelector('.donor-input[type="email"]') ||
                         document.querySelectorAll(".donor-input")[1];

      const name  = nameInput  ? nameInput.value.trim()  : "";
      const email = emailInput ? emailInput.value.trim() : "";

      if (!amount || Number(amount) <= 0) {
        shakeElement(donateBtn);
        return;
      }

      if (!name) {
        shakeElement(nameInput);
        return;
      }

      if (!email || !email.includes("@")) {
        shakeElement(emailInput);
        return;
      }

      // Show success modal
      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";

      // Reset form
      if (customInput) customInput.value = "";
      amountBtns.forEach(function (b) { b.classList.remove("active"); });
      if (amountBtns[0]) amountBtns[0].classList.add("active");
      if (nameInput)  nameInput.value  = "";
      if (emailInput) emailInput.value = "";
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ESC key closes modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  // Shake utility for validation feedback
  function shakeElement(el) {
    if (!el) return;
    el.style.transition = "transform 0.1s ease";
    const positions = [0, -6, 6, -4, 4, -2, 2, 0];
    let i = 0;

    function step() {
      if (i < positions.length) {
        el.style.transform = "translateX(" + positions[i] + "px)";
        i++;
        setTimeout(step, 50);
      } else {
        el.style.transform = "";
      }
    }
    step();
  }


  /* ============================================================
     7. BACK TO TOP BUTTON
  ============================================================ */
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* ============================================================
     8. SMOOTH SCROLL for anchor links (older browser fallback)
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 72;
        const top    = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

})();
