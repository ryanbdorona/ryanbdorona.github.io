if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  const prepareFadeIn = (elements, baseDelay = 0, stagger = 90) => {
    elements.forEach((element, index) => {
      element.classList.add("fade-in");
      element.style.setProperty("--animation-delay", `${baseDelay + index * stagger}ms`);
    });
  };

  const revealElements = (elements) => {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });
  };

  const closeMenu = () => {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove("is-active");
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Highlight the matching homepage section while scrolling.
  const setActiveLink = () => {
    if (!sections.length) return;

    const scrollPosition = window.scrollY + 140;
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const hash = new URL(link.href, window.location.href).hash.slice(1);
      link.classList.toggle("active", hash === currentId);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });

  prepareFadeIn(Array.from(document.querySelectorAll("main > .section:not(.hero)")), 0, 0);
  prepareFadeIn(Array.from(document.querySelectorAll(".project-card")), 0, 110);
  prepareFadeIn(Array.from(document.querySelectorAll(".skill-column")), 0, 90);

  if (prefersReducedMotion) {
    revealElements(Array.from(document.querySelectorAll(".fade-in")));
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    document.querySelectorAll(".fade-in:not(.is-visible)").forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements(Array.from(document.querySelectorAll(".fade-in")));
  }
});
