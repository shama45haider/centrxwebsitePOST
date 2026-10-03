/* Centrx marketing site: chrome, icons, motion, pricing renderers, contact form.
   Classic script on top of core/ns.js + core/icons.js (+ data/plans.js on pricing pages). */
(function () {
  const C = window.Centrx;
  const $ = C.$, $$ = C.$$, esc = C.esc;
  const APP = '/app';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const I = (name) => `<span data-i="${name}"></span>`;
  const page = document.body.dataset.page || '';

  /* ---------- Chrome ---------- */
  const NAV = [
    ['/features', 'Features', 'features'],
    ['/pricing', 'Pricing', 'pricing'],
    ['/help', 'Help', 'help'],
    ['/contact', 'Contact', 'contact'],
  ];
  const brand = `<a class="site-brand" href="/" aria-label="Centrx home">${C.brandMark(22)}<span>Centrx</span></a>`;
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
        <div class="foot-brand">${brand}<p>Customers, orders, payments, inventory, shipping, messaging and an AI assistant for local and retail businesses.</p></div>
        <div class="foot-col"><h3>Product</h3>
          <a href="/features">Features</a><a href="/pricing">Pricing</a><a href="${APP}?demo#/">Live demo</a><a href="${APP}#/login">Sign in</a></div>
        <div class="foot-col"><h3>Company</h3>
          <a href="/help">Help center</a><a href="/contact">Contact</a><a href="mailto:sales@centrx.co">sales@centrx.co</a><a href="mailto:support@centrx.co">support@centrx.co</a></div>
        <div class="foot-col"><h3>Legal</h3>
          <a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
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

  // In a swipe row on phones, each card lists this many features until "Show all" is tapped.
  const SHORT_LIST = 5;

  function planCard(p) {
    const parent = p.inherits && C.PLANS[p.inherits];
    const second = p.id === 'business'
      ? `<a class="btn btn-lg btn-block btn-ghost sub-btn" href="/contact">Talk to sales</a>`
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
        ${p.bullets.map((b, i) => `<li${i >= SHORT_LIST ? ' class="more"' : ''}>${fmtBullet(b)}</li>`).join('')}
      </ul>
      ${p.bullets.length > SHORT_LIST ? `<button type="button" class="plan-more" data-plan-more aria-expanded="false">Show all ${p.bullets.length} features</button>` : ''}
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

  // On narrow screens a .swipe row of cards scrolls sideways; a segmented switch above it
  // jumps to a card and follows along as you swipe. Wide screens hide the switch.
  function swipeRow(row, labels, start) {
    let sw = row.previousElementSibling;
    if (!sw || !sw.hasAttribute('data-swipe-switch')) {
      sw = document.createElement('div');
      sw.className = 'swipe-switch';
      sw.setAttribute('data-swipe-switch', '');
      row.before(sw);
      sw.addEventListener('click', (e) => {
        const b = e.target.closest('[data-to]');
        if (b) go(+b.dataset.to, !RM);
      });
      row.addEventListener('scroll', () => {
        const mid = row.scrollLeft + row.clientWidth / 2;
        const cards = [...row.children];
        let k = 0;
        cards.forEach((c, i) => { if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(cards[k].offsetLeft + cards[k].offsetWidth / 2 - mid)) k = i; });
        mark(k);
      }, { passive: true });
    }
    sw.innerHTML = `<div class="segmented" role="group" aria-label="Choose a card">${labels.map((l, i) => `<button type="button" data-to="${i}">${esc(l)}</button>`).join('')}</div>`;
    function mark(k) { $$('[data-to]', sw).forEach((b) => { const on = +b.dataset.to === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); }
    function go(k, smooth) {
      const c = row.children[k];
      if (!c) return;
      row.scrollTo({ left: c.offsetLeft - (row.clientWidth - c.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
      mark(k);
    }
    go(start, false);
  }

  function renderPlans() {
    $$('[data-plans]').forEach((el) => {
      el.innerHTML = C.PLAN_ORDER.map((id) => planCard(C.PLANS[id])).join('');
      if (el.classList.contains('swipe')) {
        // One tap opens every card's list, so the row stays even as you swipe.
        el.addEventListener('click', (e) => {
          if (!e.target.closest('[data-plan-more]')) return;
          const open = el.classList.toggle('expanded');
          $$('[data-plan-more]', el).forEach((b) => {
            b.setAttribute('aria-expanded', open);
            b.textContent = open ? 'Show fewer features' : `Show all ${$$('.plan-list li:not(.inherit)', b.closest('.plan')).length} features`;
          });
        });
        swipeRow(el, C.PLAN_ORDER.map((id) => C.PLANS[id].name), Math.max(0, C.PLAN_ORDER.findIndex((id) => C.PLANS[id].popular)));
      }
    });
    $$('[data-billing]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-value]');
        if (b && b.dataset.value !== billing) setBilling(b.dataset.value);
      });
    });
    setBilling(billing, false);
  }

  // Email and SMS packs: three cards per channel, shaped like the plan cards, one channel at a time.
  function renderPacks() {
    const el = $('[data-packs]'), toggle = $('[data-pack-toggle]');
    if (!el || !C.ADDONS) return;
    const rate = (ch, pk) => (ch === 'email'
      ? `${C.fmt.money((pk.price / pk.qty) * 1000)} per 1,000 emails`
      : `${+(pk.price / pk.qty).toFixed(2)}¢ per text`);
    const draw = (ch) => {
      const a = C.ADDONS[ch];
      $$('[data-pack-ch]', toggle).forEach((b) => { const on = b.dataset.packCh === ch; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      $('[data-pack-cards]', el).innerHTML = a.packs.map((pk, k) => `<article class="plan pack-card${pk.popular ? ' popular' : ''}" style="--k:${k}">
        <div class="plan-top"><h3 class="plan-name">${C.fmt.num(pk.qty)} ${esc(a.unit)}</h3>${pk.popular ? '<span class="pill-plan">Most popular</span>' : ''}</div>
        <p class="plan-tag">${esc(pk.tagline)}</p>
        <div class="price"><span class="price-amt num">${money0(pk.price)}</span><span class="price-per">/month</span></div>
        <p class="price-note">${rate(ch, pk)}</p>
        <a class="btn btn-lg btn-block${pk.popular ? ' btn-primary' : ''}" href="${APP}#/settings/billing?addon=${ch}">Add to your plan</a>
      </article>`).join('');
      swipeRow($('[data-pack-cards]', el), a.packs.map((pk) => C.fmt.num(pk.qty)), Math.max(0, a.packs.findIndex((pk) => pk.popular)));
      $('[data-pack-includes]', el).innerHTML = `<div class="includes-head">Every ${ch === 'sms' ? 'SMS' : 'email'} pack includes</div>
        <ul class="rings-list">${a.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
      $('[data-pack-more]', el).innerHTML = `Go over your pack and you pay ${esc(a.overage.label)}. Sending far more? <a href="#custom">Custom plans</a> include volume pricing.`;
      // SMS only: the texting-number options (one toll-free number is included with every pack).
      const nb = $('[data-pack-numbers]', el);
      if (nb) {
        nb.hidden = ch !== 'sms';
        if (ch === 'sms' && C.SMS_NUMBERS) {
          nb.innerHTML = `<div class="numbers-head"><h3 class="h4">Your texting number</h3>
            <p>US carriers require every business to text from its own registered number. We register it with the carriers for you.</p></div>
            <div class="numbers-grid">${C.SMS_NUMBER_ORDER.map((k) => { const n = C.SMS_NUMBERS[k]; return `<div class="num-opt">
              <div class="num-name">${esc(n.name)}</div>
              <div class="num-price">${n.price ? `${money0(n.price)}<span>/month</span>` : 'Included'}</div>
              <p>${esc(n.blurb)}</p>
              <small>${n.setup ? `${money0(n.setup)} one-time setup` : 'No setup fee'} · ready ${esc(n.review.replace('usually ', 'in about '))}</small>
            </div>`; }).join('')}</div>
            <p class="numbers-foot">Setup fees are waived on annual billing. Extra numbers, for example one per location, are ${money0(C.EXTRA_NUMBER)}/month each.</p>`;
        }
      }
    };
    toggle.addEventListener('click', (e) => { const b = e.target.closest('[data-pack-ch]'); if (b && !b.classList.contains('on')) draw(b.dataset.packCh); });
    draw('email');
  }

  // Custom: by application from inside the app, never a self-serve checkout.
  function renderCustom() {
    const el = $('[data-custom-plan]'), c = C.CUSTOM_PLAN;
    if (!el || !c) return;
    // The logo's four blades, drawn separately so they can spread apart on hover.
    const blades = (C.BRAND_PATH || '').split('Z').filter(Boolean).map((d, k) => `<path class="pc-blade b${k}" d="${d}Z"/>`).join('');
    // A preview of the real application flow (assets/js/pages/custom-plan.js), mid-review.
    const STEPS = [
      ['done', 'Tell us what you need', '9 locations · 12,000 orders a month'],
      ['done', 'Confirm your business', 'LLC · EIN ••-•••4567 · Oregon filing'],
      ['now', 'Our team reviews it', 'Usually within two business days'],
      ['next', 'Your limits and price go live', 'Set to the volume you told us'],
    ];
    el.innerHTML = `<article class="plan-custom" id="custom">
      <svg class="pc-mark" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="pcBlade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A5CFF"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs>${blades}</svg>
      <div class="pc-main">
        <div class="pc-top">${C.brandMark(22)}<h3 class="plan-name">${esc(c.name)}</h3><span class="pc-tag">By application</span></div>
        <p class="pc-title">Sized to <span>your business.</span></p>
        <p class="pc-lead">${esc(c.tagline)} We'll size limits and pricing to your volume.</p>
        <ul class="pc-list">
          <li class="inherit">Everything in ${esc(C.PLANS[c.inherits].name)}, plus:</li>
          ${c.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
        </ul>
        <div class="pc-cta">
          <a class="btn btn-primary" href="${APP}#/custom-plan">Apply for Custom <span class="nudge" data-i="arrowRight"></span></a>
          <a class="btn" href="/contact">Talk to sales</a>
        </div>
      </div>
      <div class="pc-preview" aria-hidden="true">
        <div class="panel pc-app">
          <div class="panel-head"><div><h3>Custom plan application</h3><div class="xs muted mono">CX-7Q4K2</div></div><span class="badge warn">Under review</span></div>
          <ol class="pc-steps">${STEPS.map(([s, t, d], k) => `<li class="${s}" style="--k:${k}"><span class="pc-dot">${s === 'done' ? C.icon('check', 12) : ''}</span><div><b>${t}</b><small>${d}</small></div></li>`).join('')}</ol>
        </div>
      </div>
    </article>`;
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
    // Each group is its own tbody that opens and closes like the FAQ. Only the first starts open.
    el.innerHTML = `<table>
      <thead><tr><th scope="col"><span class="sr-only">Feature</span></th>${plans.map((p) => `<th scope="col" data-col="${p.id}">${esc(p.name)}<small data-th-price="${p.id}"></small></th>`).join('')}</tr></thead>
      ${C.PLAN_MATRIX.map((g, k) => `<tbody class="cgroup${k === 0 ? ' open' : ''}">
        <tr class="group"><td colspan="${plans.length + 1}"><button type="button" aria-expanded="${k === 0}">${esc(g.group)}<small>${g.rows.length} features</small>${I('plus')}</button></td></tr>
        ${g.rows.map(([label, fn]) => `<tr class="row"><td>${esc(label)}</td>${plans.map((p) => `<td data-col="${p.id}">${cell(fn(p))}</td>`).join('')}</tr>`).join('')}
      </tbody>`).join('')}
    </table>
    <button type="button" class="compare-all" data-compare-all>Show all features</button>`;
    const groups = $$('.cgroup', el), all = $('[data-compare-all]', el);
    const setGroup = (g, open) => { g.classList.toggle('open', open); $('button', g).setAttribute('aria-expanded', open); };
    const syncAll = () => { all.textContent = groups.every((g) => g.classList.contains('open')) ? 'Show fewer features' : 'Show all features'; };
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.group button');
      if (b) { const g = b.closest('.cgroup'); setGroup(g, !g.classList.contains('open')); syncAll(); }
    });
    all.addEventListener('click', () => {
      const openAll = !groups.every((g) => g.classList.contains('open'));
      groups.forEach((g, k) => setGroup(g, openAll || k === 0));
      syncAll();
      if (!openAll) el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    });
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
    renderCustom();
    renderPacks();
    renderCompare();
    setBilling(billing, false);
    $$('[data-overage]').forEach((el) => { el.textContent = C.ADDONS[el.dataset.overage].overage.label; });
    $$('[data-annual-list]').forEach((el) => {
      const parts = C.PLAN_ORDER.map((id) => `${C.PLANS[id].name} ${money0(annualTotal(C.PLANS[id]))}`);
      el.textContent = parts.slice(0, -1).join(', ') + ' or ' + parts[parts.length - 1];
    });
  }

  /* ---------- Help center (needs data/help.js) ---------- */
  if (C.HELP) {
    const guide = (a) => `<a class="help-link" href="${a.href}"><b>${esc(a.title)}</b><span>${esc(a.summary)}</span></a>`;

    // Hub: guides grouped by category, filtered live by the search box.
    const hub = $('[data-help-hub]'), search = $('[data-help-search]');
    if (hub) {
      const all = C.HELP_CATEGORIES.map((c) => `<section class="help-cat"><h2 class="h4">${esc(c.name)}</h2>
        <div class="help-list">${C.HELP.filter((a) => a.cat === c.id).map(guide).join('')}</div></section>`).join('');
      const draw = (q) => {
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);
        if (!words.length) { hub.innerHTML = all; return; }
        const hits = C.HELP.filter((a) => words.every((w) => `${a.title} ${a.summary} ${a.keywords}`.toLowerCase().includes(w)));
        hub.innerHTML = hits.length
          ? `<section class="help-cat wide"><h2 class="h4">${hits.length} ${hits.length === 1 ? 'guide' : 'guides'} found</h2><div class="help-list">${hits.map(guide).join('')}</div></section>`
          : `<section class="help-cat wide"><h2 class="h4">No guides match "${esc(q)}"</h2><p class="help-none">Try another word, or <a href="/contact">ask us directly</a>. We usually reply within one business day.</p></section>`;
      };
      draw('');
      if (search) search.addEventListener('input', () => draw(search.value.trim()));
    }

    // Guide pages: the other guides in the same category, then the rest.
    $$('[data-help-related]').forEach((el) => {
      const me = C.HELP.find((a) => a.id === el.dataset.helpRelated);
      const rest = C.HELP.filter((a) => a !== me).sort((a, b) => (b.cat === me?.cat) - (a.cat === me?.cat)).slice(0, 3);
      el.innerHTML = rest.map(guide).join('');
    });
  }

  // Prices and limits quoted in guides come from data/plans.js, so they never drift from the pricing page.
  if (hasPlans) {
    const N = C.SMS_NUMBERS || {}, A = C.ADDONS || {};
    const FACTS = {
      'num-local': N.local && `${money0(N.local.price)}/month`,
      'num-local-setup': N.local && money0(N.local.setup),
      'num-local-review': N.local && N.local.review,
      'num-existing': N.existing && `${money0(N.existing.price)}/month`,
      'num-existing-setup': N.existing && money0(N.existing.setup),
      'num-existing-review': N.existing && N.existing.review,
      'num-tollfree-review': N.tollfree && N.tollfree.review,
      'num-extra': C.EXTRA_NUMBER && `${money0(C.EXTRA_NUMBER)}/month`,
      'email-overage': A.email && A.email.overage.label,
      'sms-overage': A.sms && A.sms.overage.label,
      'annual-list': ((l) => `${l.slice(0, -1).join(', ')} or ${l[l.length - 1]}`)(C.PLAN_ORDER.map((id) => `${C.PLANS[id].name} ${money0(annualTotal(C.PLANS[id]))}`)),
    };
    $$('[data-fact]').forEach((el) => { if (FACTS[el.dataset.fact]) el.textContent = FACTS[el.dataset.fact]; });
    // Pack tables: one row per pack, straight from the pricing data.
    $$('[data-pack-table]').forEach((el) => {
      const a = A[el.dataset.packTable];
      if (a) el.innerHTML = a.packs.map((pk) => `<tr><td>${C.fmt.num(pk.qty)} ${esc(a.unit)}</td><td>${money0(pk.price)}/month</td></tr>`).join('');
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

  /* ---------- AI Assistant mocks: play the question → typing → answer once they're on screen ---------- */
  $$('[data-ai-chat]').forEach((el) => (RM ? el.classList.add('play') : once([el], () => el.classList.add('play'), { threshold: 0.4 })));

  /* ---------- Phone bubbles ---------- */
  $$('[data-phone]').forEach((phone) => {
    const bubbles = $$('.bubble', phone);
    once([phone], () => bubbles.forEach((b, i) => setTimeout(() => b.classList.add('in'), RM ? 0 : 350 + i * 700)));
  });

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
