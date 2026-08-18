document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '233205155149';

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

  // Promo bar: show today's weekly special when the weekly menu is present
  const promoText = document.getElementById('promoText');
  if (promoText) {
    const todayDish = document.querySelector('.week-card.today .week-dish');
    if (todayDish) {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todayIndex];
      promoText.textContent = dayName + ' special: ' + todayDish.textContent.trim() + ' \u2014 order now!';
    }
  }

  // Floating WhatsApp button (all pages)
  const waBtn = document.createElement('a');
  waBtn.className = 'wa-float';
  waBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hello Nakie Foods! I have a question.');
  waBtn.target = '_blank';
  waBtn.rel = 'noopener';
  waBtn.setAttribute('aria-label', 'Chat with Nakie Foods on WhatsApp');
  waBtn.innerHTML = '<span class="wa-tip">Chat with us</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  document.body.appendChild(waBtn);

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
