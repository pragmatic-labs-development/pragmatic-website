// Mobile navigation toggle
(function () {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('is-active');
    menu.classList.toggle('is-open');
  });

  // Close menu when a nav link is clicked
  menu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('is-active');
      menu.classList.remove('is-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('is-active');
      menu.classList.remove('is-open');
    }
  });
})();

// Contact form handling
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.querySelector('#name').value;
    var email = form.querySelector('#email').value;
    var message = form.querySelector('#message').value;

    // Build mailto link as a fallback
    var subject = encodeURIComponent('Contact from ' + name);
    var body = encodeURIComponent(
      'Name: ' + name + '\nEmail: ' + email + '\n\n' + message
    );
    window.location.href = 'mailto:hello@pragmaticlabs.dev?subject=' + subject + '&body=' + body;

    // Show success message
    form.innerHTML =
      '<div class="contact-form__success">' +
      '<strong>Thanks for reaching out!</strong>' +
      'Your email client should open with the message. If it doesn\'t, email us at hello@pragmaticlabs.dev.' +
      '</div>';
  });
})();
