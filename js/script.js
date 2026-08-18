document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '233205155149';
  const NETLIFY_FORM_ENDPOINT = '/netlify-forms.html';

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
    const updateOrderWhatsAppLink = () => {
      if (form.id !== 'orderForm') return;
      const link = document.getElementById('orderWhatsAppFallback');
      if (!link) return;
      const data = new FormData(form);
      const message = [
        'Hello Nakie Foods! I would like to place an order.',
        '',
        'Name: ' + (data.get('name') || 'Not provided'),
        'Phone: ' + (data.get('phone') || 'Not provided'),
        'Delivery address: ' + (data.get('address') || 'Not provided'),
        'Order: ' + (data.get('items') || 'Not provided'),
        'Payment: ' + (data.get('payment') || 'Not provided'),
        'Special instructions: ' + (data.get('notes') || 'None')
      ].join('\n');
      link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    };
    updateOrderWhatsAppLink();
    form.addEventListener('input', updateOrderWhatsAppLink);
    form.addEventListener('change', updateOrderWhatsAppLink);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      updateOrderWhatsAppLink();
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
      fetch(NETLIFY_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/x-www-form-urlencoded, text/html, */*' },
        body: data.toString()
      })
        .then(response => {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const isOrderForm = form.id === 'orderForm';
          btn.innerHTML = isOrderForm ? '&#10004; ORDER PLACED SUCCESSFULLY' : '&#10004; Sent!';
          btn.style.background = 'var(--green)';
          if (statusEl) {
            statusEl.textContent = isOrderForm
              ? 'ORDER PLACED SUCCESSFULLY! The kitchen has received your order and will contact you shortly.'
              : 'Thank you! Your request has been sent — we\u2019ll get back to you soon.';
            statusEl.className = 'form-status success';
          }
          if (isOrderForm) {
            localStorage.removeItem('nakie-foods-cart');
          }
          form.reset();
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        })
        .catch((error) => {
          btn.innerHTML = '&#10060; Failed to send \u2014 please try again';
          btn.style.background = '#c0392b';
          if (statusEl) {
            statusEl.textContent = 'The online inbox could not be reached (' + error.message + '). Use “Send directly on WhatsApp” below so the kitchen receives your order now.';
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

  // Menu cart: items are kept while the visitor moves from the menu to the order form.
  const CART_KEY = 'nakie-foods-cart';
  const menuItemsForCart = document.querySelectorAll('.menu-item-block');
  const readCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  };
  const writeCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const formatMoney = (amount) => 'GH₵ ' + amount.toFixed(2);
  const cartOrderText = (cart) => {
    const lines = cart.map(item => item.quantity + '× ' + item.name + ' — ' + formatMoney(item.price * item.quantity));
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return lines.join('\n') + '\n\nEstimated total: ' + formatMoney(total);
  };

  if (menuItemsForCart.length) {
    const cartButton = document.createElement('button');
    cartButton.type = 'button';
    cartButton.className = 'cart-toggle';
    cartButton.setAttribute('aria-expanded', 'false');
    cartButton.innerHTML = '🧺 Kitchen basket <span class="cart-count">0</span>';
    document.body.appendChild(cartButton);

    const cartPanel = document.createElement('aside');
    cartPanel.className = 'cart-panel';
    cartPanel.setAttribute('aria-label', 'Your order cart');
    const cartHeader = document.createElement('div');
    cartHeader.className = 'cart-header';
    const cartTitleGroup = document.createElement('div');
    const cartKicker = document.createElement('p');
    cartKicker.className = 'cart-kicker';
    cartKicker.textContent = 'Today’s selection';
    const cartTitle = document.createElement('h2');
    cartTitle.textContent = 'Kitchen basket';
    cartTitleGroup.append(cartKicker, cartTitle);
    const closeCart = document.createElement('button');
    closeCart.type = 'button';
    closeCart.className = 'cart-close';
    closeCart.setAttribute('aria-label', 'Close cart');
    closeCart.textContent = '×';
    cartHeader.append(cartTitleGroup, closeCart);
    const cartItems = document.createElement('div');
    cartItems.className = 'cart-items';
    const cartFooter = document.createElement('div');
    cartFooter.className = 'cart-footer';
    cartPanel.append(cartHeader, cartItems, cartFooter);
    document.body.appendChild(cartPanel);

    const orderChoice = document.createElement('div');
    orderChoice.className = 'order-choice';
    orderChoice.setAttribute('role', 'dialog');
    orderChoice.setAttribute('aria-modal', 'true');
    orderChoice.setAttribute('aria-labelledby', 'orderChoiceTitle');
    const choiceCard = document.createElement('div');
    choiceCard.className = 'order-choice-card';
    const choiceClose = document.createElement('button');
    choiceClose.type = 'button';
    choiceClose.className = 'order-choice-close';
    choiceClose.setAttribute('aria-label', 'Close order options');
    choiceClose.textContent = '×';
    const choiceKicker = document.createElement('p');
    choiceKicker.className = 'cart-kicker';
    choiceKicker.textContent = 'Fresh from the kitchen';
    const choiceTitle = document.createElement('h2');
    choiceTitle.id = 'orderChoiceTitle';
    choiceTitle.textContent = 'How would you like to order?';
    const choiceText = document.createElement('p');
    choiceText.className = 'order-choice-text';
    const choiceActions = document.createElement('div');
    choiceActions.className = 'order-choice-actions';
    const basketChoice = document.createElement('button');
    basketChoice.type = 'button';
    basketChoice.className = 'btn btn-primary';
    basketChoice.textContent = 'Add to kitchen basket';
    const whatsappChoice = document.createElement('a');
    whatsappChoice.className = 'btn btn-whatsapp';
    whatsappChoice.target = '_blank';
    whatsappChoice.rel = 'noopener';
    whatsappChoice.textContent = 'Order on WhatsApp';
    choiceActions.append(basketChoice, whatsappChoice);
    choiceCard.append(choiceClose, choiceKicker, choiceTitle, choiceText, choiceActions);
    orderChoice.appendChild(choiceCard);
    document.body.appendChild(orderChoice);

    const setCartOpen = (isOpen) => {
      cartPanel.classList.toggle('open', isOpen);
      cartButton.classList.toggle('open', isOpen);
      cartButton.setAttribute('aria-expanded', String(isOpen));
    };
    const renderCart = () => {
      const cart = readCart();
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartButton.querySelector('.cart-count').textContent = itemCount;
      cartItems.replaceChildren();
      cartFooter.replaceChildren();
      if (!cart.length) {
        const empty = document.createElement('p');
        empty.className = 'cart-empty';
        empty.textContent = 'Your basket is empty. Pick something fresh from today’s kitchen.';
        cartItems.appendChild(empty);
        return;
      }
      cart.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        const details = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = item.name;
        const price = document.createElement('span');
        price.textContent = formatMoney(item.price * item.quantity);
        details.append(name, price);
        const controls = document.createElement('div');
        controls.className = 'cart-quantity';
        [['−', -1, 'Remove one '], ['+', 1, 'Add one ']].forEach(([label, change, description]) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = label;
          button.setAttribute('aria-label', description + item.name);
          button.addEventListener('click', () => {
            const updated = readCart().map(entry => entry.name === item.name ? { ...entry, quantity: entry.quantity + change } : entry).filter(entry => entry.quantity > 0);
            writeCart(updated);
            renderCart();
          });
          controls.appendChild(button);
          if (change === -1) {
            const quantity = document.createElement('span');
            quantity.textContent = item.quantity;
            quantity.setAttribute('aria-label', item.quantity + ' ' + item.name);
            controls.appendChild(quantity);
          }
        });
        row.append(details, controls);
        cartItems.appendChild(row);
      });
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalRow = document.createElement('p');
      totalRow.className = 'cart-total';
      totalRow.textContent = 'Estimated total: ' + formatMoney(total);
      const checkout = document.createElement('a');
      checkout.className = 'btn btn-primary cart-checkout';
      checkout.href = 'order.html';
      checkout.textContent = 'Review & place order';
      const clearCart = document.createElement('button');
      clearCart.type = 'button';
      clearCart.className = 'clear-cart';
      clearCart.textContent = 'Clear basket';
      clearCart.addEventListener('click', () => {
        writeCart([]);
        renderCart();
      });
      cartFooter.append(totalRow, checkout, clearCart);
    };
    const addToCart = (name, price, openCart = true) => {
      const cart = readCart();
      const existing = cart.find(entry => entry.name === name);
      if (existing) existing.quantity += 1;
      else cart.push({ name, price, quantity: 1 });
      writeCart(cart);
      renderCart();
      if (openCart) setCartOpen(true);
    };
    const closeOrderChoice = () => orderChoice.classList.remove('open');
    const openOrderChoice = (name, price) => {
      choiceText.textContent = name + ' is ready when you are. Choose how you would like to send your order.';
      whatsappChoice.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('I\u2019d like to order: ' + name + ' (' + formatMoney(price) + ') from Nakie Foods.');
      basketChoice.onclick = () => {
        addToCart(name, price);
        closeOrderChoice();
      };
      orderChoice.classList.add('open');
    };
    menuItemsForCart.forEach((item) => {
      const name = item.querySelector('h3')?.textContent.trim();
      const priceText = item.querySelector('.price')?.textContent || '';
      const price = Number(priceText.replace(/[^0-9.]/g, ''));
      const meta = item.querySelector('.meta');
      if (!name || !Number.isFinite(price) || !meta) return;
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'add-to-cart';
      addButton.textContent = 'Add to basket';
      addButton.addEventListener('click', () => {
        addToCart(name, price);
      });
      const orderButton = document.createElement('button');
      orderButton.type = 'button';
      orderButton.className = 'choose-order-method';
      orderButton.textContent = 'Order now';
      orderButton.addEventListener('click', () => openOrderChoice(name, price));
      meta.append(addButton, orderButton);
    });
    cartButton.addEventListener('click', () => setCartOpen(!cartPanel.classList.contains('open')));
    closeCart.addEventListener('click', () => setCartOpen(false));
    choiceClose.addEventListener('click', closeOrderChoice);
    orderChoice.addEventListener('click', (event) => {
      if (event.target === orderChoice) closeOrderChoice();
    });
    renderCart();
  }

  // Pre-fill the order field after checkout from the menu cart.
  const orderItemsField = document.getElementById('order-items');
  if (orderItemsField) {
    const cart = readCart();
    if (cart.length && !orderItemsField.value) {
      orderItemsField.value = cartOrderText(cart);
      orderItemsField.dispatchEvent(new Event('input', { bubbles: true }));
      const note = document.querySelector('.order-form-note');
      if (note) note.textContent = 'Your cart has been added below. Add any special instructions, then send your order.';
    }
  }

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
