/* Centrx marketing site: chrome, icons, motion, pricing renderers, contact form.
   Classic script on top of core/ns.js + core/icons.js (+ data/plans.js on pricing pages). */
(function () {
  const C = window.Centrx;
  const $ = C.$, $$ = C.$$, esc = C.esc;
  const APP = 'app.html';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const I = (name) => `<span data-i="${name}"></span>`;
  const page = document.body.dataset.page || '';

  /* ---------- Chrome ---------- */
  const NAV = [
    ['features.html', 'Features', 'features'],
    ['pricing.html', 'Pricing', 'pricing'],
    ['contact.html', 'Contact', 'contact'],
  ];
  const brand = `<a class="site-brand" href="index.html" aria-label="Centrx home">${C.brandMark(22)}<span>Centrx</span></a>`;
  const navLinks = NAV.map(([href, label, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  const header = $('[data-site-header]');
  if (header) {
    header.innerHTML = `<div class="container">
      ${brand}
      <nav class="site-nav" aria-label="Main">${navLinks}</nav>
      <div class="site-actions">
        <a class="btn btn-ghost" href="${APP}#/login">Sign in</a>
        <a class="btn btn-primary" href="${APP}#/signup">Start free trial</a>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-sheet" aria-label="Open menu">${I('menu')}</button>
      <div class="nav-sheet" id="nav-sheet">
        ${navLinks}
        <a href="${APP}?demo#/">Live demo</a>
        <div class="sheet-cta">
          <a class="btn btn-lg" href="${APP}#/login">Sign in</a>
          <a class="btn btn-lg btn-primary" href="${APP}#/signup">Start free trial</a>
        </div>
      </div>
    </div>`;
    const toggle = $('.nav-toggle', header);
    const setOpen = (open) => {
      header.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.innerHTML = C.icon(open ? 'x' : 'menu', 20);
    };
    toggle.addEventListener('click', () => setOpen(!header.classList.contains('open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setOpen(false));
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const footer = $('[data-site-footer]');
  if (footer) {
    footer.innerHTML = `<div class="container">
      <div class="foot-grid">
        <div class="foot-brand">${brand}<p>Customers, orders, payments, inventory, shipping and messaging for local and retail businesses.</p></div>
        <div class="foot-col"><h3>Product</h3>
          <a href="features.html">Features</a><a href="pricing.html">Pricing</a><a href="${APP}?demo#/">Live demo</a><a href="${APP}#/login">Sign in</a></div>
        <div class="foot-col"><h3>Company</h3>
          <a href="contact.html">Contact</a><a href="mailto:sales@centrx.co">sales@centrx.co</a><a href="mailto:support@centrx.co">support@centrx.co</a></div>
        <div class="foot-col"><h3>Legal</h3>
          <a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div>
      </div>
      <div class="foot-base"><span>© ${new Date().getFullYear()} Centrx. All rights reserved.</span><span>Payments processed by Stripe and PayPal.</span></div>
    </div>`;
  }

  /* ---------- Pricing renderers (need data/plans.js) ---------- */
  const hasPlans = !!C.PLANS;
  const KEY = 'centrx.site.billing';
  let billing = 'monthly';
  try { if (localStorage.getItem(KEY) === 'annual') billing = 'annual'; } catch {}

  const money0 = (c) => C.fmt.money0(c);
  const annualTotal = (p) => p.price * C.ANNUAL_MONTHS;
  const priceFor = (p, b) => (b === 'annual' ? annualTotal(p) : p.price);
  const perFor = (b) => (b === 'annual' ? '/year' : '/month');
  const noteFor = (p, b) => (b === 'annual'
    ? `${C.fmt.money(annualTotal(p) / 12)}/mo billed yearly · 2 months free`
    : `or ${money0(annualTotal(p))}/yr, 2 months free`);
  const signupUrl = (id, b) => `${APP}#/signup?plan=${id}&billing=${b}`;
  const fmtBullet = (s) => esc(s).replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<code>$1</code>');

  function planCard(p) {
    const parent = p.inherits && C.PLANS[p.inherits];
    const second = p.id === 'business'
      ? `<a class="btn btn-lg btn-block btn-ghost sub-btn" href="contact.html">Talk to sales</a>`
      : `<a class="btn btn-lg btn-block btn-ghost sub-btn" href="${APP}?demo#/">Try the live demo</a>`;
    return `<article class="plan${p.popular ? ' popular' : ''}" data-plan="${p.id}">
      <div class="plan-top"><h3 class="plan-name">${esc(p.name)}</h3>${p.popular ? '<span class="pill-plan">Most popular</span>' : ''}</div>
      <p class="plan-tag">${esc(p.tagline)}</p>
      <div class="price"><span class="price-amt num" data-amt>${money0(priceFor(p, billing))}</span><span class="price-per" data-per>${perFor(billing)}</span></div>
      <p class="price-note" data-note>${noteFor(p, billing)}</p>
      <a class="btn btn-lg btn-block${p.popular ? ' btn-primary' : ''}" data-cta href="${signupUrl(p.id, billing)}">Start free trial</a>
      ${second}
      <ul class="plan-list">
        ${parent ? `<li class="inherit">Everything in ${esc(parent.name)}, plus:</li>` : ''}
        ${p.bullets.map((b) => `<li>${fmtBullet(b)}</li>`).join('')}
      </ul>
    </article>`;
  }

  function setBilling(next, animate = true) {
    billing = next;
    try { localStorage.setItem(KEY, next); } catch {}
    $$('[data-billing] button').forEach((b) => {
      const on = b.dataset.value === next;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
    $$('.plan[data-plan]').forEach((card) => {
      const p = C.PLANS[card.dataset.plan];
      const amt = $('[data-amt]', card);
      const apply = () => {
        amt.textContent = money0(priceFor(p, next));
        $('[data-per]', card).textContent = perFor(next);
        $('[data-note]', card).textContent = noteFor(p, next);
        $('[data-cta]', card).href = signupUrl(p.id, next);
        amt.classList.remove('swap');
      };
      if (!animate || RM) return apply();
      amt.classList.add('swap');
      setTimeout(apply, 170);
    });
    $$('[data-th-price]').forEach((el) => {
      const p = C.PLANS[el.dataset.thPrice];
      el.textContent = `${money0(priceFor(p, next))}${next === 'annual' ? '/yr' : '/mo'}`;
    });
  }

  function renderPlans() {
    $$('[data-plans]').forEach((el) => {
      el.innerHTML = C.PLAN_ORDER.map((id) => planCard(C.PLANS[id])).join('');
    });
    $$('[data-billing]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-value]');
        if (b && b.dataset.value !== billing) setBilling(b.dataset.value);
      });
    });
    setBilling(billing, false);
  }

  // Messaging packs: pick a monthly volume, get the cheapest pack (overage included) highlighted.
  function renderEstimator() {
    const el = $('[data-estimator]');
    if (!el) return;
    const RANGE = {
      email: { max: 60000, step: 500, start: 8000, label: 'Campaign emails you send a month' },
      sms: { max: 6000, step: 50, start: 800, label: 'Texts you send a month' },
    };
    const FOOT = {
      email: 'Receipts, payment links and order updates are always included and never count toward a pack.',
      sms: 'Every text counts, including replies and texted payment links. Long texts count once per segment.',
    };
    const cash = (c) => (c % 100 ? C.fmt.money(c) : money0(c));
    const rate = (ch, pk) => (ch === 'email' ? `${C.fmt.money((pk.price / pk.qty) * 1000)} per 1,000` : `${+(pk.price / pk.qty).toFixed(1)}¢ each`);
    const vals = { email: RANGE.email.start, sms: RANGE.sms.start };
    const range = $('[data-est-range]', el);
    let ch = 'email';
    const bestFor = (v) => C.ADDONS[ch].packs
      .map((pk) => { const over = Math.max(0, v - pk.qty); return { pk, over, cost: pk.price + (over ? C.overageCents(ch, over) : 0) }; })
      .reduce((a, b) => (b.cost < a.cost ? b : a));
    const draw = () => {
      const a = C.ADDONS[ch], v = vals[ch], b = bestFor(v), unit = a.unit.replace(/s$/, '');
      $$('[data-ch]', el).forEach((btn) => { const on = btn.dataset.ch === ch; btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on); });
      $('[data-est-label]', el).textContent = RANGE[ch].label;
      $('[data-est-num]', el).innerHTML = `${C.fmt.num(v)}<small>${a.unit}</small>`;
      $('[data-est-max]', el).textContent = C.fmt.num(RANGE[ch].max);
      range.max = RANGE[ch].max; range.step = RANGE[ch].step; range.value = v;
      range.setAttribute('aria-valuetext', `${C.fmt.num(v)} ${a.unit}`);
      const meter = $('[data-est-meter]', el);
      if (!v) {
        $('[data-est-pack]', el).textContent = 'No pack needed';
        $('[data-est-use]', el).textContent = '';
        meter.parentElement.classList.remove('warn');
        meter.style.width = '0%';
        $('[data-est-total]', el).textContent = '$0';
        $('[data-est-note]', el).textContent = 'You only need a pack to send campaigns.';
      } else {
        $('[data-est-pack]', el).textContent = `${C.fmt.num(b.pk.qty)}-${unit} pack`;
        $('[data-est-use]', el).textContent = `${C.fmt.num(v)} / ${C.fmt.num(b.pk.qty)}`;
        meter.parentElement.classList.toggle('warn', v > b.pk.qty);
        meter.style.width = Math.min(100, (v / b.pk.qty) * 100) + '%';
        $('[data-est-total]', el).textContent = cash(b.cost);
        $('[data-est-note]', el).textContent = b.over
          ? `Includes ${cash(C.overageCents(ch, b.over))} for ${C.fmt.num(b.over)} ${a.unit} beyond the pack.`
          : `${C.fmt.num(b.pk.qty - v)} ${a.unit} to spare each month.`;
      }
      $('[data-pack-rows]', el).innerHTML = a.packs.map((pk) => {
        const on = v > 0 && pk === b.pk;
        return `<tr class="${on ? 'best' : ''}">
          <td><span class="cell-main">${C.fmt.num(pk.qty)} ${a.unit}</span>${on ? '<span class="badge accent plain">Best fit</span>' : ''}</td>
          <td class="right muted">${rate(ch, pk)}</td>
          <td class="right"><span class="cell-main num">${money0(pk.price)}</span><span class="muted">/mo</span></td>
        </tr>`;
      }).join('');
      $('[data-est-over]', el).textContent = a.overage.label;
      $('[data-est-foot]', el).textContent = FOOT[ch];
    };
    range.addEventListener('input', () => { vals[ch] = +range.value; draw(); });
    $('[data-channel]', el).addEventListener('click', (e) => {
      const b = e.target.closest('[data-ch]');
      if (b && b.dataset.ch !== ch) { ch = b.dataset.ch; draw(); }
    });
    draw();
  }

  function renderCompare() {
    const el = $('[data-compare]');
    if (!el) return;
    const plans = C.PLAN_ORDER.map((id) => C.PLANS[id]);
    const cell = (v) => {
      if (v === true) return `<span class="yes" aria-label="Included">${I('check')}</span>`;
      if (v === false || v == null || v === 0) return `<span class="no" aria-label="Not included">${I('minus')}</span>`;
      if (v === Infinity) return 'Unlimited';
      if (typeof v === 'number') return C.fmt.num(v);
      return fmtBullet(String(v));
    };
    el.innerHTML = `<table>
      <thead><tr><th scope="col"><span class="sr-only">Feature</span></th>${plans.map((p) => `<th scope="col" data-col="${p.id}">${esc(p.name)}<small data-th-price="${p.id}"></small></th>`).join('')}</tr></thead>
      <tbody>${C.PLAN_MATRIX.map((g) => `<tr class="group"><td colspan="${plans.length + 1}">${esc(g.group)}</td></tr>${g.rows.map(([label, fn]) => `<tr><td>${esc(label)}</td>${plans.map((p) => `<td data-col="${p.id}">${cell(fn(p))}</td>`).join('')}</tr>`).join('')}`).join('')}</tbody>
    </table>`;
    const sw = $('[data-compare-switch]');
    if (sw) {
      sw.innerHTML = `<div class="segmented" role="group" aria-label="Plan to compare">${plans.map((p) => `<button type="button" data-col-pick="${p.id}">${esc(p.name)}</button>`).join('')}</div>`;
      const pick = (id) => {
        $$('[data-col-pick]', sw).forEach((b) => { b.classList.toggle('on', b.dataset.colPick === id); b.setAttribute('aria-pressed', b.dataset.colPick === id); });
        $$('[data-col]', el).forEach((c) => c.classList.toggle('show', c.dataset.col === id));
      };
      sw.addEventListener('click', (e) => { const b = e.target.closest('[data-col-pick]'); if (b) pick(b.dataset.colPick); });
      pick(plans.find((p) => p.popular)?.id || plans[0].id);
    }
  }

  if (hasPlans) {
    renderPlans();
    renderEstimator();
    renderCompare();
    setBilling(billing, false);
    $$('[data-overage]').forEach((el) => { el.textContent = C.ADDONS[el.dataset.overage].overage.label; });
    $$('[data-annual-list]').forEach((el) => {
      const parts = C.PLAN_ORDER.map((id) => `${C.PLANS[id].name} ${money0(annualTotal(C.PLANS[id]))}`);
      el.textContent = parts.slice(0, -1).join(', ') + ' or ' + parts[parts.length - 1];
    });
  }

  /* ---------- Icons + brand (after all markup exists) ---------- */
  $$('[data-i]').forEach((el) => { el.innerHTML = C.icon(el.dataset.i, 20); });
  $$('[data-brand]').forEach((el) => { el.innerHTML = C.brandMark(+el.dataset.brand || 22); });

  /* ---------- Visibility helpers ---------- */
  const once = (els, fn, opts = { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }) => {
    if (!('IntersectionObserver' in window)) return els.forEach(fn);
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { io.unobserve(en.target); fn(en.target); }
    }), opts);
    els.forEach((el) => io.observe(el));
  };
  // Runs tick() on an interval only while el is on screen and the tab is visible.
  const loop = (el, tick, ms) => {
    let timer = null, seen = false;
    const run = () => { if (!timer && seen && !document.hidden) { timer = setInterval(tick, ms); } };
    const halt = () => { clearInterval(timer); timer = null; };
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; seen ? run() : halt(); }).observe(el);
    document.addEventListener('visibilitychange', () => (document.hidden ? halt() : run()));
  };

  $$('[data-reveal-group]').forEach((g) => $$('[data-reveal]', g).forEach((el, i) => el.style.setProperty('--d', i)));
  once($$('[data-reveal], [data-inview]'), (el) => el.classList.add('is-in'));
  // Rings are zero-size anchors, so watch the section they sit in.
  $$('.rings').forEach((r) => once([r.parentElement], () => r.classList.add('is-in'), { threshold: 0 }));

  /* ---------- Hero ---------- */
  const stage = $('.hero-stage');
  if (stage) requestAnimationFrame(() => stage.classList.add('is-in'));

  /* ---------- Product tour: tabs advance on their own until someone clicks ---------- */
  const tour = $('[data-tour]');
  if (tour) {
    const tabs = $$('[data-tab]', tour), panes = $$('[data-pane]', tour);
    let cur = 0;
    const show = (n, focus) => {
      cur = (n + tabs.length) % tabs.length;
      tabs.forEach((t, k) => {
        const on = k === cur;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        const bar = $('.tour-bar', t);
        if (on && bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      });
      panes.forEach((p, k) => { p.hidden = k !== cur; });
      if (focus) tabs[cur].focus();
    };
    const manual = () => tour.classList.add('manual');
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => { manual(); show(k); });
      $('.tour-bar', t)?.addEventListener('animationend', () => { if (!tour.classList.contains('manual')) show(cur + 1); });
    });
    $('[role="tablist"]', tour).addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault(); manual(); show(cur + d, true);
    });
    if (RM) manual();
    let hover = false, seen = false;
    const sync = () => tour.classList.toggle('paused', hover || !seen);
    tour.addEventListener('mouseenter', () => { hover = true; sync(); });
    tour.addEventListener('mouseleave', () => { hover = false; sync(); });
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; sync(); }, { threshold: 0.3 }).observe(tour);
    sync();
    show(0);
  }

  const chart = $('[data-chart]');
  if (chart) {
    const W = 600, H = 170, pad = 10;
    const pts = [42, 46, 44, 51, 49, 55, 53, 60, 58, 57, 64, 62, 68, 66, 72, 70, 69, 77, 75, 81, 79, 86, 84, 83, 90, 88, 95, 93, 99, 104];
    const max = 110, min = 30;
    const xy = pts.map((v, i) => [(i / (pts.length - 1)) * W, pad + (1 - (v - min) / (max - min)) * (H - pad * 2)]);
    const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const grid = [0.25, 0.5, 0.75].map((f) => `<line class="grid-line" x1="0" x2="${W}" y1="${H * f}" y2="${H * f}" vector-effect="non-scaling-stroke"/>`).join('');
    chart.innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A5CFF" stop-opacity=".12"/><stop offset="1" stop-color="#0A5CFF" stop-opacity="0"/></linearGradient>
        <clipPath id="chartReveal"><rect class="reveal-rect" width="${W}" height="${H}"/></clipPath>
      </defs>
      ${grid}
      <g clip-path="url(#chartReveal)">
        <path class="area" d="${line} L${W} ${H} L0 ${H} Z"/>
        <path class="line" d="${line}" vector-effect="non-scaling-stroke"/>
      </g>
    </svg>`;
    const svg = $('svg', chart);
    once([chart], () => (RM ? svg.classList.add('drawn') : setTimeout(() => svg.classList.add('drawn'), 450)));
  }

  const countUp = (el) => {
    const to = parseFloat(el.dataset.count), fmt = el.dataset.fmt;
    const show = (v) => { el.textContent = fmt === 'money' ? C.fmt.money0(v * 100) : fmt === 'pct' ? v.toFixed(1) + '%' : C.fmt.num(Math.round(v)); };
    if (RM) return show(to);
    const t0 = performance.now(), dur = 1100;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      show(to * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counters = $$('[data-count]');
  counters.forEach((el) => { el.textContent = el.dataset.fmt === 'money' ? '$0' : '0'; });
  once(counters, (el) => setTimeout(() => countUp(el), 300), { threshold: 0 });

  const toast = $('[data-toast]');
  if (toast) {
    const MSGS = [
      ['checkCircle', 'Payment received · $248.00'],
      ['receipt', 'New order #1042 · Maya Chen'],
      ['truck', 'Label created · UPS Ground'],
      ['send', 'Campaign sent to 1,284 customers'],
    ];
    let i = 0;
    const show = () => {
      const [icon, text] = MSGS[i++ % MSGS.length];
      toast.innerHTML = `${C.icon(icon, 18)}<span>${text}</span>`;
      toast.classList.add('in');
    };
    if (RM) show();
    else {
      setTimeout(show, 1800);
      loop(toast.parentElement, () => { toast.classList.remove('in'); setTimeout(show, 450); }, 3800);
    }
  }

  /* ---------- Payment card flip ---------- */
  $$('[data-paycard]').forEach((pay) => {
    let paid = false;
    const set = (v) => {
      paid = v;
      $('[data-state="due"]', pay).classList.toggle('gone', paid);
      $('[data-state="paid"]', pay).classList.toggle('gone', !paid);
      const btn = $('[data-pay-btn]', pay);
      btn.innerHTML = paid ? `${C.icon('checkCircle', 18)}Paid · receipt sent` : `${C.icon('lock', 16)}Pay $248.00`;
      btn.classList.toggle('btn-primary', !paid);
      $$('[data-inv]', pay).forEach((el) => {
        el.innerHTML = paid ? '<span class="badge success">Sold</span>' : '<span class="badge warn">Reserved</span>';
      });
    };
    set(false);
    if (!RM) loop(pay, () => set(!paid), 3200);
  });

  /* ---------- Typed headline ---------- */
  $$('[data-typer]').forEach((el) => {
    const words = JSON.parse(el.dataset.typer);
    const out = $('[data-typed]', el);
    if (RM || words.length < 2) return;
    let seen = true;
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; }).observe(el);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const ready = async () => { while (!seen || document.hidden) await wait(300); };
    (async () => {
      let i = 0;
      await wait(2400);
      for (;;) {
        await ready();
        el.classList.add('typing');
        for (let n = words[i].length - 1; n >= 0; n--) { out.textContent = words[i].slice(0, n); await wait(26); }
        i = (i + 1) % words.length;
        await wait(280);
        for (let n = 1; n <= words[i].length; n++) { out.textContent = words[i].slice(0, n); await wait(48 + Math.random() * 42); }
        el.classList.remove('typing');
        await wait(2400);
      }
    })();
  });

  /* ---------- Phone bubbles ---------- */
  $$('[data-phone]').forEach((phone) => {
    const bubbles = $$('.bubble', phone);
    once([phone], () => bubbles.forEach((b, i) => setTimeout(() => b.classList.add('in'), RM ? 0 : 350 + i * 700)));
  });

  /* ---------- Sender identity swap ---------- */
  const from = $('[data-from]');
  if (from) {
    const STATES = [
      { addr: "John's Pizza &lt;notify@centrx.co&gt;", plan: 'Starter & Growth' },
      { addr: "John's Pizza &lt;notifications@johnspizza.com&gt;", plan: 'Business · your own domain' },
    ];
    const label = $('[data-from-plan]');
    let k = 0;
    const apply = () => { from.innerHTML = STATES[k].addr; if (label) label.textContent = STATES[k].plan; };
    apply();
    if (!RM) loop(from, () => {
      from.classList.add('out');
      setTimeout(() => { k = (k + 1) % STATES.length; apply(); from.classList.remove('out'); }, 260);
    }, 3000);
  }

  /* ---------- Features sub-nav scroll-spy ---------- */
  const subnav = $('[data-subnav]');
  if (subnav && 'IntersectionObserver' in window) {
    const chips = $$('a.chip', subnav);
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      chips.forEach((c) => {
        const on = c.getAttribute('href') === '#' + en.target.id;
        c.classList.toggle('on', on);
        if (on) c.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('.feature[id]').forEach((s) => spy.observe(s));
  }

  /* ---------- Contact form (simulated; nothing leaves the browser) ---------- */
  const form = $('[data-contact]');
  if (form) {
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const err = (input, msg) => {
      input.classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', !!msg);
      const box = input.closest('.field').querySelector('.error-text');
      box.textContent = msg || '';
    };
    form.addEventListener('input', (e) => { if (e.target.classList.contains('invalid')) err(e.target, ''); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = form.elements;
      const checks = [
        [f.name, f.name.value.trim() ? '' : 'Enter your name.'],
        [f.email, EMAIL.test(f.email.value.trim()) ? '' : 'Enter a valid work email.'],
        [f.company, f.company.value.trim() ? '' : 'Enter your business name.'],
      ];
      checks.forEach(([input, msg]) => err(input, msg));
      const bad = checks.find(([, msg]) => msg);
      if (bad) return bad[0].focus();
      const btn = $('button[type="submit"]', form);
      btn.classList.add('busy');
      setTimeout(() => {
        const first = esc(f.name.value.trim().split(/\s+/)[0]);
        form.closest('.form-card').innerHTML = `<div class="form-done" role="status">
          <span class="done-ring">${C.icon('check', 24)}</span>
          <h2 class="h3">Thanks, ${first}. We'll be in touch.</h2>
          <p class="body-muted" style="margin-top:8px">Someone from our team will reply within one business day to set up your demo.</p>
          <div class="hero-cta" style="margin-top:24px"><a class="btn btn-lg" href="${APP}?demo#/">Explore the live demo</a></div>
        </div>`;
      }, 900);
    });
  }
})();
