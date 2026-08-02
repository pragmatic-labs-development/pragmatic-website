// Mobile navigation toggle
(function () {
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('is-active');
    menu.classList.toggle('is-open');
  });

  // Close menu when a nav link is clicked
  var links = menu.querySelectorAll('.nav__link');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      toggle.classList.remove('is-active');
      menu.classList.remove('is-open');
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('is-active');
      menu.classList.remove('is-open');
    }
  });
})();

// Scroll reveal with IntersectionObserver
(function () {
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();

// Active nav link highlighting on scroll
(function () {
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  function onScroll() {
    var scrollPos = window.scrollY + 120;
    var current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#2563eb';
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Retainer capacity selector — pills and tier cards share one selection state
(function () {
  var pills = document.querySelectorAll('.pricing__pill');
  var tiers = document.querySelectorAll('.pricing__tier');

  if (!pills.length || !tiers.length) return;

  function selectHours(hours) {
    pills.forEach(function (pill) {
      var isMatch = pill.getAttribute('data-hours') === hours;
      pill.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      pill.setAttribute('tabindex', isMatch ? '0' : '-1');
    });

    tiers.forEach(function (tier) {
      var isMatch = tier.getAttribute('data-hours') === hours;
      tier.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  pills.forEach(function (pill, index) {
    pill.addEventListener('click', function () {
      selectHours(pill.getAttribute('data-hours'));
    });

    // Roving-tabindex arrow key navigation per the ARIA radiogroup pattern
    pill.addEventListener('keydown', function (e) {
      var nextIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % pills.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + pills.length) % pills.length;
      } else {
        return;
      }
      e.preventDefault();
      var nextPill = pills[nextIndex];
      selectHours(nextPill.getAttribute('data-hours'));
      nextPill.focus();
    });
  });

  tiers.forEach(function (tier) {
    tier.addEventListener('click', function () {
      selectHours(tier.getAttribute('data-hours'));
    });
  });
})();

// Our Work — filter cards by category, horizontal scroll-snap carousel
(function () {
  var tabs = document.querySelectorAll('.work__tab');
  var cards = document.querySelectorAll('.work__card');
  var list = document.querySelector('.work__list');
  var prevBtn = document.querySelector('.work__nav-btn--prev');
  var nextBtn = document.querySelector('.work__nav-btn--next');

  if (!tabs.length || !cards.length || !list) return;

  function updateNavButtons() {
    if (!prevBtn || !nextBtn) return;
    var maxScroll = list.scrollWidth - list.clientWidth;
    prevBtn.disabled = list.scrollLeft <= 4;
    nextBtn.disabled = list.scrollLeft >= maxScroll - 4;
  }

  function scrollByCard(direction) {
    var firstVisibleCard = list.querySelector('.work__card:not([hidden])');
    var amount = firstVisibleCard
      ? firstVisibleCard.getBoundingClientRect().width + 24
      : list.clientWidth * 0.9;
    list.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.getAttribute('data-filter');

      tabs.forEach(function (t) {
        t.classList.toggle('work__tab--active', t === tab);
      });

      cards.forEach(function (card) {
        var categories = card.getAttribute('data-categories').split(' ');
        card.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
      });

      list.scrollTo({ left: 0, behavior: 'smooth' });
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });

  list.addEventListener('scroll', updateNavButtons);
  window.addEventListener('resize', updateNavButtons);
  updateNavButtons();
})();

// Low-risk engagement cost comparison — numbers live in one place here,
// not scattered across the markup
(function () {
  var comparison = {
    annualFullyLoadedCost: 180000,
    estimatedTwoWeekCost: 7500,
    engagementPrice: 1999
  };

  var twoWeekEl = document.getElementById('lowrisk-twoweek-cost');
  var engagementEl = document.getElementById('lowrisk-engagement-price');
  var annualEl = document.getElementById('lowrisk-annual-cost');

  if (!twoWeekEl || !engagementEl) return;

  function usd(n) {
    return '$' + n.toLocaleString('en-US');
  }

  twoWeekEl.textContent = '~' + usd(comparison.estimatedTwoWeekCost);
  engagementEl.textContent = usd(comparison.engagementPrice);

  if (annualEl) {
    annualEl.textContent = usd(comparison.annualFullyLoadedCost);
  }
})();
