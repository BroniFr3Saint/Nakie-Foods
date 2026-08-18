document.addEventListener('DOMContentLoaded', () => {

  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }

  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (nav) {
      if (currentScroll > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    lastScroll = currentScroll;
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item-block, .menu-item');
  const weeklyBlock = document.getElementById('weeklyBlock');

  if (menuTabs.length) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const category = tab.dataset.category;
        if (weeklyBlock) {
          weeklyBlock.style.display = category === 'week' ? 'block' : 'none';
        }
        menuItems.forEach(item => {
          if (category !== 'week' && (category === 'all' || item.dataset.cat === category)) {
            item.style.display = 'flex';
            item.style.animation = 'fadeIn 0.4s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Highlight today's card in the weekly menu grids
  const todayIndex = new Date().getDay();
  document.querySelectorAll('.week-card').forEach(card => {
    if (parseInt(card.dataset.day, 10) === todayIndex) {
      card.classList.add('today');
      const tag = document.createElement('span');
      tag.className = 'week-today';
      tag.textContent = 'Today';
      card.appendChild(tag);
    }
  });

  document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const statusEl = form.querySelector('.form-status');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '&#128190; Sending...';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }

      const data = new URLSearchParams(new FormData(form));
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/x-www-form-urlencoded, text/html, */*' },
        body: data.toString()
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          btn.innerHTML = '&#10004; Sent!';
          btn.style.background = 'var(--green)';
          if (statusEl) {
            statusEl.textContent = 'Thank you! Your request has been sent — we\u2019ll get back to you soon.';
            statusEl.className = 'form-status success';
          }
          form.reset();
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        })
        .catch(() => {
          btn.innerHTML = '&#10060; Failed to send \u2014 please try again';
          btn.style.background = '#c0392b';
          if (statusEl) {
            statusEl.textContent = 'Something went wrong. Please try again in a moment.';
            statusEl.className = 'form-status error';
          }
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        });
    });
  });

  const WHATSAPP_NUMBER = '233205155149';
  document.querySelectorAll('.menu-item-block').forEach(item => {
    const nameEl = item.querySelector('h3');
    if (!nameEl) return;
    const dish = nameEl.textContent.trim();
    const priceEl = item.querySelector('.price');
    const price = priceEl ? priceEl.textContent.trim() : '';
    const message = 'I\u2019d like to order: ' + dish + (price ? ' (' + price + ')' : '') + ' from Nakie Foods.';
    const link = document.createElement('a');
    link.className = 'order-link';
    link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    link.target = '_blank';
    link.rel = 'noopener';
    link.innerHTML = 'Order';
    const meta = item.querySelector('.meta');
    if (meta) {
      meta.appendChild(link);
    } else {
      item.appendChild(link);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

});
