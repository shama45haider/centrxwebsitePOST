/* Centrx marketing site: chrome, icons, motion, pricing renderers, contact form.
   Classic script on top of core/ns.js + core/icons.js (+ data/plans.js on pricing pages). */
(function () {
  const C = window.Centrx;
  const $ = C.$, $$ = C.$$, esc = C.esc;
  const APP = 'https://app.centrx.co/';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const I = (name) => `<span data-i="${name}"></span>`;
  const page = document.body.dataset.page || '';
  // Launch day. Until then "Get started" buttons join the waitlist instead (see "Launch waitlist" below).
  const LAUNCH = new Date('2026-11-18T00:00:00-05:00');
  const PRELAUNCH = Date.now() < LAUNCH;

  /* ---------- Chrome ---------- */
  const NAV = [
    ['/features', 'Features', 'features'],
    ['/pricing', 'Pricing', 'pricing'],
    ['/help', 'Help', 'help'],
    ['/contact', 'Contact', 'contact'],
  ];
  const brand = `<a class="site-brand" href="/" aria-label="Centrx home">${C.brandLogo(34)}</a>`;
  // The mark drawn large and faint behind a card, as on the brand board. Its two ribbons drift apart on hover.
  const ghostMark = (cls) => `<svg class="ghost-mark ${cls}" viewBox="${C.BRAND_VIEWBOX}" aria-hidden="true">${C.BRAND_PATHS.map((d, k) => `<path class="gm-${k}" d="${d}"/>`).join('')}</svg>`;
  const navLinks = NAV.map(([href, label, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  const header = $('[data-site-header]');
  if (header) {
    header.innerHTML = `<div class="container">
      ${brand}
      <nav class="site-nav" aria-label="Main">${navLinks}</nav>
      <div class="site-actions">
        <a class="btn btn-ghost" href="${APP}#/login">Sign in</a>
        <a class="btn btn-primary" href="${APP}#/signup" data-waitlist="${page || 'site'}" data-wl-label="Join the waitlist">Get started free</a>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-sheet" aria-label="Open menu">${I('menu')}</button>
      <div class="nav-sheet" id="nav-sheet">
        ${navLinks}
        <a href="${APP}?demo#/">Live demo</a>
        <div class="sheet-cta">
          <a class="btn btn-lg" href="${APP}#/login">Sign in</a>
          <a class="btn btn-lg btn-primary" href="${APP}#/signup" data-waitlist="${page || 'site'}" data-wl-label="Join the waitlist">Get started free</a>
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
      <div class="foot-base"><span>© ${new Date().getFullYear()} Centrx. All rights reserved.</span><span>Payments processed by Stripe, PayPal and Square.</span></div>
    </div>`;
  }

  /* ---------- Pricing renderers (need data/plans.js) ---------- */
  const hasPlans = !!C.PLANS;
  const KEY = 'centrx.site.billing';
  let billing = 'monthly';
  try { if (localStorage.getItem(KEY) === 'annual') billing = 'annual'; } catch {}

  // Whole-dollar prices drop the cents ($49); prices like $12.50 keep them.
  const money0 = (c) => (c % 100 ? C.fmt.money(c) : C.fmt.money0(c));
  const annualTotal = (p) => p.price * C.ANNUAL_MONTHS;
  // Free has no yearly price: it stays "$0/month" whichever billing is picked.
  const priceFor = (p, b) => (b === 'annual' ? annualTotal(p) : p.price);
  const perFor = (p, b) => (b === 'annual' && p.price ? '/year' : '/month');
  const noteFor = (p, b) => (!p.price ? 'Free for as long as you like'
    : b === 'annual' ? `${C.fmt.money(annualTotal(p) / 12)}/mo billed yearly · 2 months free`
      : `or ${money0(annualTotal(p))}/yr, 2 months free`);
  const signupUrl = (id, b) => `${APP}#/signup?plan=${id}&billing=${b}`;
  const fmtBullet = (s) => esc(s).replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<code>$1</code>');
  const onBilling = []; // redrawn when the billing toggle changes (the estimator)

  // Home page cards: the plan's full feature list.
  function planCard(p) {
    const parent = p.inherits && C.PLANS[p.inherits];
    const second = (p.id === 'business' || p.id === 'enterprise')
      ? `<a class="btn btn-lg btn-block btn-ghost sub-btn" href="/contact">Talk to sales</a>`
      : `<a class="btn btn-lg btn-block btn-ghost sub-btn" href="${APP}?demo#/">Try the live demo</a>`;
    return `<article class="plan${p.popular ? ' popular' : ''}" data-plan="${p.id}">
      ${cardTop(p)}
      ${second}
      <ul class="plan-list">
        ${parent ? `<li class="inherit">Everything in ${esc(parent.name)}, plus:</li>` : ''}
        ${p.bullets.map((b) => `<li>${fmtBullet(b)}</li>`).join('')}
      </ul>
    </article>`;
  }

  // Pricing page cards: name, price, one button, then only what sets the plan apart.
  // The comparison table further down has everything else.
  function priceCard(p) {
    const lines = [...p.highlights, p.limits.cenbotReplies && `Cenbot AI, ${C.fmt.num(p.limits.cenbotReplies)} replies a month`].filter(Boolean);
    return `<article class="plan price-card${p.popular ? ' popular' : ''}" data-plan="${p.id}">
      ${cardTop(p)}
      <ul class="plan-list">${lines.map((b) => `<li>${fmtBullet(b)}</li>`).join('')}</ul>
    </article>`;
  }

  // Name, price and button: the part setBilling() updates.
  function cardTop(p) {
    return `<div class="plan-top"><h3 class="plan-name">${esc(p.name)}</h3>${p.popular ? '<span class="pill-plan">Most popular</span>' : ''}</div>
      <p class="plan-tag">${esc(p.tagline)}</p>
      <div class="price"><span class="price-amt num" data-amt>${money0(priceFor(p, billing))}</span><span class="price-per" data-per>${perFor(p, billing)}</span></div>
      <p class="price-note" data-note>${noteFor(p, billing)}</p>
      <a class="btn btn-lg btn-block${p.popular ? ' btn-primary' : ''}" data-cta href="${signupUrl(p.id, billing)}" data-waitlist="${page || 'site'}" data-wl-label="Join the waitlist">Choose ${esc(p.name)}</a>`;
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
        $('[data-per]', card).textContent = perFor(p, next);
        $('[data-note]', card).textContent = noteFor(p, next);
        $('[data-cta]', card).href = signupUrl(p.id, next);
        amt.classList.remove('swap');
      };
      if (!p.price || !animate || RM) return apply();
      amt.classList.add('swap');
      setTimeout(apply, 170);
    });
    $$('[data-th-price]').forEach((el) => {
      const p = C.PLANS[el.dataset.thPrice];
      el.textContent = p.price ? `${money0(priceFor(p, next))}${next === 'annual' ? '/yr' : '/mo'}` : money0(0);
    });
    onBilling.forEach((fn) => fn());
  }

  function renderPlans() {
    $$('[data-plans]').forEach((el) => { el.innerHTML = C.PAID_PLAN_ORDER.map((id) => planCard(C.PLANS[id])).join(''); });
    $$('[data-price-cards]').forEach((el) => { el.innerHTML = C.PAID_PLAN_ORDER.map((id) => priceCard(C.PLANS[id])).join(''); });
    $$('[data-billing]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-value]');
        if (b && b.dataset.value !== billing) setBilling(b.dataset.value);
      });
    });
    setBilling(billing, false);
  }

  // Free and Custom sit under the paid plans as two slim cards: the way in, and the way past Enterprise.
  function renderPlanSides() {
    const el = $('[data-plan-sides]'), f = C.PLANS.free, c = C.CUSTOM_PLAN;
    if (!el || !f || !c) return;
    el.innerHTML = `<article class="side-card" id="free">
        <div class="side-head"><h3 class="plan-name">${esc(f.name)}</h3><span class="side-price num">${money0(0)}<small>/month</small></span></div>
        <p class="side-text">For one person at one location, with ${C.fmtStorage(f.limits.storageGB)} of storage, up to ${C.fmt.num(f.limits.customers)} customers and ${C.fmt.num(f.limits.items)} inventory items.</p>
        <p class="side-fee">On Free, Centrx keeps <b>${f.cardFeePct}%</b> of each card payment. Paid plans have no Centrx fee.</p>
        <div class="side-cta"><a class="btn" href="${APP}#/signup?plan=${f.id}" data-waitlist="${page || 'site'}" data-wl-label="Join the waitlist">Start for free</a></div>
      </article>
      <article class="side-card custom" id="custom">
        ${ghostMark('pc-mark')}
        <div class="side-head"><h3 class="plan-name">${esc(c.name)}</h3><span class="pc-tag">By application</span></div>
        <p class="side-text">${esc(c.tagline)} More locations and storage, volume pricing on email and SMS, and a dedicated support contact, priced to your volume.</p>
        <p class="side-fee">${esc(c.review)}</p>
        <div class="side-cta"><a class="btn btn-primary" href="${APP}#/custom-plan">Apply for Custom</a><a class="btn btn-ghost" href="/contact">Talk to sales</a></div>
      </article>`;
  }

  // Add-ons in three groups: an icon, title and one line beside the cards (above them on phones).
  // Every price and limit comes from data/plans.js.
  function renderAddons() {
    const el = $('[data-addons]');
    if (!el || !C.ADDONS) return;
    const ent = C.PLANS.enterprise, biz = C.PLANS.business, pro = C.PLANS.growth;
    const badge = (icon) => `<span class="ao-icon" aria-hidden="true">${C.icon(icon, 18)}</span>`;
    const note = (text) => `<p class="ao-note">${C.icon('info', 15)}<span>${text}</span></p>`;
    const per = (cents, unit) => `<span class="num">${money0(cents)}</span><small>${unit}</small>`;
    const table = (rows) => `<table class="ao-table"><tbody>${rows.join('')}</tbody></table>`;
    const row = (name, sub, price, rate, popular) => `<tr${popular ? ' class="popular"' : ''}><th scope="row">${name}${popular ? '<span class="pill-plan">Most popular</span>' : ''}<small>${sub}</small></th><td>${price}<small class="ao-rate">${rate}</small></td></tr>`;
    const pack = (ch) => {
      const a = C.ADDONS[ch];
      const rate = (pk) => (ch === 'email' ? `${C.fmt.money((pk.price / pk.qty) * 1000)} per 1,000` : `${+(pk.price / pk.qty).toFixed(2)}¢ a text`);
      return `<article class="ao-card">
        <div class="ao-head"><div class="ao-title">${badge(ch === 'email' ? 'mail' : 'message')}<h4 class="h4">${ch === 'email' ? 'Email packs' : 'SMS packs'}</h4></div><p>${esc(a.covers)}</p></div>
        ${table(a.packs.map((pk) => row(`${C.fmt.num(pk.qty)} ${esc(a.unit)}`, esc(pk.tagline), per(pk.price, '/mo'), rate(pk), pk.popular)))}
        ${note(`Go over and your messages keep sending at ${esc(a.overage.label)}.`)}
      </article>`;
    };
    const numbers = `<article class="ao-card wide">
      <div class="ao-head"><div class="ao-title">${badge('hash')}<h4 class="h4">Your texting number</h4></div><p>US carriers require every business to text from its own registered number. Every SMS pack comes with one, and we register it for you.</p></div>
      ${table(C.SMS_NUMBER_ORDER.map((k) => { const n = C.SMS_NUMBERS[k]; return row(esc(n.name), `${esc(n.blurb)} Ready ${esc(n.review.replace('usually ', 'in about '))}.`,
        n.price ? per(n.price, '/mo') : '<span class="ao-incl">Included</span>', n.setup ? `+ ${money0(n.setup)} setup` : 'with any SMS pack'); }))}
      ${note(`Setup fees are waived on annual billing. Extra numbers, for example one per location, are ${money0(C.EXTRA_NUMBER)}/month each.`)}
    </article>`;
    const single = (icon, name, cents, unit, text, facts) => `<article class="ao-card">
      <div class="ao-top"><div class="ao-title">${badge(icon)}<h4 class="h4">${name}</h4></div><span class="ao-price">${per(cents, unit)}</span></div>
      <p class="ao-text">${text}</p>
      <dl class="ao-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </article>`;
    const GROUPS = [
      ['send', 'Email and texting', Math.min(C.ADDONS.email.packs[0].price, C.ADDONS.sms.packs[0].price), 'Campaign email and every text you send, in monthly packs. Receipts, payment links and order emails are always included at no cost.',
        [pack('email'), pack('sms'), numbers]],
      ['globe', 'Your own email and phone', Math.min(C.BUSINESS_EMAIL.price, C.PHONE_LINE.price), 'Email from your own domain and a business number customers can call, both answered in Centrx.', [
        single('at', C.BUSINESS_EMAIL.name, C.BUSINESS_EMAIL.price, '/mo per domain',
          'Send from you@yourbusiness.com instead of notify@centrx.co. Replies come into your shared inbox.',
          [['Available on', 'Every plan, Free too'], ['Setup', `Guided steps, or one click on ${esc(biz.name)} and ${esc(ent.name)} (coming soon)`], ['Guide', '<a href="/help/custom-domain">Connect your domain</a>']]),
        single('phoneCall', C.PHONE_LINE.name, C.PHONE_LINE.price, '/mo',
          'A number customers can call and text. Get a new local or toll-free number, or bring the one you have.',
          [['Minutes', `${C.fmt.num(biz.limits.phoneMinutes)} a month, then ${C.PHONE_LINE.overageCents}¢ a minute`], ['Available on', 'Every paid plan'], ['Included on', `${esc(ent.name)}, with ${C.fmt.num(ent.limits.phoneMinutes)} minutes`]]),
      ]],
      ['layers', 'Room to grow', Math.min(C.STORAGE_ADDON.price, C.EXTRA_LOCATION.price), 'More space and more locations, without moving up a plan.', [
        single('cloud', C.STORAGE_ADDON.name, C.STORAGE_ADDON.price, `/mo per ${C.fmtStorage(C.STORAGE_ADDON.gb)}`,
          'More room for inventory photos, proof videos, ID scans and call recordings.',
          [['Available on', 'Every paid plan'], ['Change it', 'Add or remove blocks anytime']]),
        single('pin', C.EXTRA_LOCATION.name, C.EXTRA_LOCATION.price, '/mo each',
          'Each location beyond the ones your plan includes.',
          [['Available on', `${esc(biz.name)} and ${esc(ent.name)}`], ['On smaller plans', `Move up instead: ${esc(pro.name)} includes ${pro.limits.locations} locations, ${esc(biz.name)} ${biz.limits.locations}`]]),
      ]],
    ];
    el.innerHTML = GROUPS.map(([icon, title, from, lead, cards]) => `<section class="addon-group" data-reveal>
      <div class="ag-side"><span class="ag-icon" aria-hidden="true">${C.icon(icon, 22)}</span><h3 class="h3">${title}</h3><p>${lead}</p><span class="ag-from">From <b>${money0(from)}</b>/month</span></div>
      <div class="ag-cards">${cards.join('')}</div>
    </section>`).join('');
  }

  // The cheapest pack for a month's volume, counting overage: going a little over a pack can beat the next one up.
  function cheapestPack(ch, n) {
    if (!n) return null;
    return C.ADDONS[ch].packs
      .map((pk) => { const over = Math.max(0, n - pk.qty); return { pk, over, cents: pk.price + C.overageCents(ch, over) }; })
      .reduce((a, b) => (b.cents < a.cents ? b : a));
  }

  // Estimator: a plan plus the packs and add-ons a business would use, totalled like the panel's bill.
  function renderEstimate() {
    const el = $('[data-estimate]');
    if (!el || !C.ADDONS) return;
    const pick = C.PLAN_ORDER.find((id) => C.PLANS[id].popular) || C.PAID_PLAN_ORDER[0];
    const range = (name, label, max, step, value) => `<div class="field"><label class="label" for="est-${name}">${label}<output class="num" data-out="${name}"></output></label>
      <input class="est-range" type="range" id="est-${name}" name="${name}" min="0" max="${max}" step="${step}" value="${value}"></div>`;
    const toggle = (name, label) => `<label class="est-toggle"><span><b>${label}</b><small data-hint="${name}"></small></span><span class="switch"><input type="checkbox" name="${name}"></span></label>`;
    el.innerHTML = `<div class="panel-head"><div><h3>Estimate your monthly bill</h3><p class="xs muted">Pick a plan and what you'd send. Packs are chosen for the lowest price.</p></div></div>
      <div class="est">
        <form class="est-form" novalidate>
          <div class="field"><label class="label" for="est-plan">Plan</label>
            <select class="select" id="est-plan" name="plan">${C.PLAN_ORDER.map((id) => `<option value="${id}"${id === pick ? ' selected' : ''}>${esc(C.PLANS[id].name)}</option>`).join('')}</select></div>
          <div class="field"><label class="label" for="est-sales">Card payments a month</label>
            <div class="input-prefix-wrap"><span class="input-prefix">$</span><input class="input num" id="est-sales" name="sales" inputmode="numeric" autocomplete="off" value="3,000"></div></div>
          ${range('email', 'Campaign emails a month', 200000, 1000, 10000)}
          ${range('sms', 'Texts a month', 10000, 100, 500)}
          ${toggle('domain', C.BUSINESS_EMAIL.name)}
          ${toggle('phone', C.PHONE_LINE.name)}
        </form>
        <div class="est-bill">
          <div class="est-lines" data-est-lines aria-live="polite"></div>
          <div class="est-total"><span>Estimated total</span><b class="num" data-est-total></b><small>/month</small></div>
          <p class="est-tip" data-est-tip></p>
          <a class="btn btn-lg btn-block btn-primary" data-est-cta data-waitlist="${page || 'site'}"></a>
          <p class="est-foot">${PRELAUNCH ? 'Join the waitlist before November 18 and your first 2 months on any paid plan are free. ' : ''}Stripe, PayPal and Square charge their own card fees.</p>
        </div>
      </div>`;
    const form = $('form', el), f = form.elements;
    let autoPhone = false; // switched on because the plan includes the line, so it switches off again with a plan that doesn't
    const line =(name, sub, cents) => `<div class="est-line"><span>${name}<small>${sub}</small></span><span class="num">${cents == null ? 'Included' : money0(cents)}</span></div>`;
    const draw = () => {
      const p = C.PLANS[f.plan.value], paid = p.price > 0, annual = billing === 'annual' && paid;
      const sales = (parseInt(f.sales.value.replace(/\D/g, ''), 10) || 0) * 100;
      const email = +f.email.value, sms = +f.sms.value, phoneIncluded = p.features.phoneLine;
      $('[data-out="email"]', el).textContent = C.fmt.num(email);
      $('[data-out="sms"]', el).textContent = C.fmt.num(sms);
      [f.email, f.sms].forEach((x) => { x.disabled = !paid; });
      f.phone.disabled = !paid || phoneIncluded;
      if (phoneIncluded && !f.phone.checked) { f.phone.checked = true; autoPhone = true; }
      else if (!phoneIncluded && autoPhone) { f.phone.checked = false; autoPhone = false; }
      $('[data-hint="domain"]', el).textContent = `${money0(C.BUSINESS_EMAIL.price)}/month for one domain`;
      $('[data-hint="phone"]', el).textContent = !paid ? 'Needs a paid plan' : phoneIncluded ? `Included on ${p.name}` : `${money0(C.PHONE_LINE.price)}/month with ${C.fmt.num(p.limits.phoneMinutes)} minutes`;

      const planCents = annual ? Math.round(annualTotal(p) / 12) : p.price;
      const rows = [[`${p.name} plan`, !paid ? 'Free for as long as you like' : annual ? `Billed yearly at ${money0(annualTotal(p))}` : 'Billed monthly', planCents]];
      let tip;
      if (!paid) {
        const fee = Math.round((sales * p.cardFeePct) / 100), up = C.PLANS[C.PAID_PLAN_ORDER[0]];
        const upCents = billing === 'annual' ? Math.round(annualTotal(up) / 12) : up.price;
        rows.push(['Centrx card fee', `${p.cardFeePct}% of ${money0(sales)} in card payments`, fee]);
        tip = fee > upCents
          ? `${up.name} would cost ${money0(fee - upCents)} less: ${money0(upCents)} a month and no Centrx fee.`
          : 'Packs and the phone line need a paid plan.';
        if (f.domain.checked) rows.push([C.BUSINESS_EMAIL.name, 'One domain', C.BUSINESS_EMAIL.price]);
      } else {
        const e = cheapestPack('email', email), s = cheapestPack('sms', sms);
        if (e) rows.push(['Email pack', `${C.fmt.num(e.pk.qty)} emails${e.over ? `, plus ${C.fmt.num(e.over)} extra` : ''}`, e.cents]);
        if (s) rows.push(['SMS pack', `${C.fmt.num(s.pk.qty)} texts${s.over ? `, plus ${C.fmt.num(s.over)} extra` : ''}, toll-free number included`, s.cents]);
        if (f.domain.checked) rows.push([C.BUSINESS_EMAIL.name, 'One domain', C.BUSINESS_EMAIL.price]);
        if (phoneIncluded) rows.push([C.PHONE_LINE.name, `${C.fmt.num(p.limits.phoneMinutes)} minutes a month`, null]);
        else if (f.phone.checked) rows.push([C.PHONE_LINE.name, `${C.fmt.num(p.limits.phoneMinutes)} minutes, then ${C.PHONE_LINE.overageCents}¢ a minute`, C.PHONE_LINE.price]);
        tip = `No Centrx fee on your ${money0(sales)} in card payments.`;
      }
      $('[data-est-lines]', el).innerHTML = rows.map(([n, s, c]) => line(n, s, c)).join('');
      $('[data-est-total]', el).textContent = money0(rows.reduce((t, r) => t + (r[2] || 0), 0));
      $('[data-est-tip]', el).textContent = tip;
      const cta = $('[data-est-cta]', el);
      cta.href = signupUrl(p.id, billing);
      cta.textContent = PRELAUNCH ? 'Join the waitlist' : paid ? `Choose ${p.name}` : 'Start for free';
    };
    form.addEventListener('input', draw);
    form.addEventListener('submit', (e) => e.preventDefault());
    f.sales.addEventListener('blur', () => { const n = parseInt(f.sales.value.replace(/\D/g, ''), 10) || 0; f.sales.value = C.fmt.num(n); });
    onBilling.push(draw);
    draw();
  }

  // Free: $0, with Centrx keeping a share of card payments. One wide card under the paid plans, so
  // the four-up row stays intact. It isn't a .plan[data-plan], so the billing toggle leaves it alone.
  function renderFree() {
    const p = C.PLANS.free;
    if (!p) return;
    $$('[data-free-plan]').forEach((el) => {
      el.innerHTML = `<article class="plan-free" id="free">
        <div class="pf-head">
          <h3 class="plan-name">${esc(p.name)}</h3>
          <div class="price"><span class="price-amt num">${money0(p.price)}</span><span class="price-per">/month</span></div>
          <p class="plan-tag">${esc(p.tagline)}</p>
        </div>
        <ul class="pf-list">${p.bullets.map((b) => `<li>${fmtBullet(b)}</li>`).join('')}</ul>
        <div class="pf-side">
          <p class="pf-fee"><span class="pf-pct num">${p.cardFeePct}%</span><span>On Free, Centrx keeps ${p.cardFeePct}% of each card payment. Paid plans have no Centrx fee.</span></p>
          <a class="btn btn-lg btn-block" href="${APP}#/signup?plan=${p.id}" data-waitlist="${page || 'site'}" data-wl-label="Join the waitlist">Start for free</a>
        </div>
      </article>`;
    });
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
    renderFree();
    renderPlanSides();
    renderAddons();
    renderEstimate();
    renderCompare();
    setBilling(billing, false);
    $$('[data-overage]').forEach((el) => { el.textContent = C.ADDONS[el.dataset.overage].overage.label; });
    $$('[data-annual-list]').forEach((el) => {
      const parts = C.PAID_PLAN_ORDER.map((id) => `${C.PLANS[id].name} ${money0(annualTotal(C.PLANS[id]))}`);
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
      'phone-line': C.PHONE_LINE && `${money0(C.PHONE_LINE.price)}/month`,
      'business-email': C.BUSINESS_EMAIL && `${money0(C.BUSINESS_EMAIL.price)}/month`,
      'phone-minutes': C.PLANS.business && C.fmt.num(C.PLANS.business.limits.phoneMinutes),
      'phone-overage': C.PHONE_LINE && `${C.PHONE_LINE.overageCents}¢ a minute`,
      'extra-location': C.EXTRA_LOCATION && `${money0(C.EXTRA_LOCATION.price)}/month`,
      'storage-addon': C.STORAGE_ADDON && `${C.fmtStorage(C.STORAGE_ADDON.gb)} for ${money0(C.STORAGE_ADDON.price)}/month`,
      'email-overage': A.email && A.email.overage.label,
      'sms-overage': A.sms && A.sms.overage.label,
      'annual-list': ((l) => `${l.slice(0, -1).join(', ')} or ${l[l.length - 1]}`)(C.PAID_PLAN_ORDER.map((id) => `${C.PLANS[id].name} ${money0(annualTotal(C.PLANS[id]))}`)),
      'free-fee': C.PLANS.free && `${C.PLANS.free.cardFeePct}%`,
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
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2064DB" stop-opacity=".12"/><stop offset="1" stop-color="#2064DB" stop-opacity="0"/></linearGradient>
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

  /* ---------- Launch waitlist ----------
     Until launch, a first visit opens a popup asking for an email; anything marked [data-waitlist]
     opens it too. Emails go to the Centrx server (server/src/waitlist.mjs), which answers the same
     for a new email and one already on the list. Closing it keeps it shut for a week; joining, for good.
     Cenbot (assets/brand/cenbot-wave.svg) waves from the left and counts down the days to launch. */
  const WL_KEY = 'centrx.waitlist';
  const wlSeen = () => { try { const v = localStorage.getItem(WL_KEY); return v === 'joined' || (v && Date.now() - Number(v) < 7 * 864e5); } catch { return false; } };
  const wlSave = (v) => { try { localStorage.setItem(WL_KEY, v); } catch { /* private mode: it just shows again */ } };
  function openWaitlist(source) {
    if ($('.wl')) return;
    const back = document.activeElement;
    const box = document.createElement('div');
    box.className = 'overlay wl';
    // Whole days left until launch, counted the way people say it: "Tomorrow" on the last day.
    const days = Math.max(1, Math.ceil((LAUNCH - Date.now()) / 864e5));
    const countdown = days === 1 ? 'Tomorrow’s the day!' : `${days} days to go!`;
    box.innerHTML = `<div class="overlay-scrim" data-wl-close></div>
      <div class="modal wl-modal" role="dialog" aria-modal="true" aria-labelledby="wl-title" aria-describedby="wl-sub">
        <button class="btn btn-ghost btn-icon wl-x" type="button" data-wl-close aria-label="Close">${C.icon('x', 18)}</button>
        <div class="wl-art">
          ${ghostMark('wl-mark')}
          <p class="wl-say wl-pop" data-wl-say>${countdown} Leave your email and I’ll keep you posted.</p>
          <img class="wl-bot" src="/assets/brand/cenbot-wave.svg" width="150" height="211" alt="">
        </div>
        <div class="wl-body">
          <h2 class="h3" id="wl-title">Centrx opens November 18</h2>
          <p class="body-muted" id="wl-sub">Join the waitlist for updates as we get ready, and your first 2 months on any paid plan are free.</p>
          <form novalidate data-wl-form>
            <div class="field"><label class="label" for="wl-email">Email</label>
              <div class="wl-row"><input class="input" id="wl-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@yourbusiness.com" maxlength="254"><button class="btn btn-primary" type="submit">Join the waitlist</button></div>
              <div class="error-text" aria-live="polite"></div></div>
            <input class="wl-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
            <p class="form-legal">We’ll email you updates before launch and on the day we open. Unsubscribe anytime. See our <a href="/privacy">privacy policy</a>.</p>
          </form>
        </div>
      </div>`;
    document.body.appendChild(box);
    document.documentElement.classList.add('wl-open');
    const f = $('[data-wl-form]', box), input = f.elements.email, msg = $('.error-text', box);
    const close = () => {
      if (!box.isConnected) return;
      if (!box.dataset.joined) wlSave(String(Date.now()));
      box.remove();
      document.documentElement.classList.remove('wl-open');
      document.removeEventListener('keydown', onKey);
      if (back && back.focus) back.focus();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const els = $$('button, input:not(.wl-hp), a[href]', box).filter((x) => x.offsetParent);
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    box.addEventListener('click', (e) => { if (e.target.closest('[data-wl-close]')) close(); });
    const err = (text) => { msg.textContent = text; input.classList.toggle('invalid', !!text); input.setAttribute('aria-invalid', !!text); };
    input.addEventListener('input', () => { if (msg.textContent) err(''); });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err('Enter a valid email address.'); return input.focus(); }
      const btn = $('button[type="submit"]', f);
      btn.classList.add('busy');
      let ok = false, text = '';
      try {
        const r = await fetch(`${APP}api/waitlist`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source, company: f.elements.company.value }) });
        ok = r.ok;
        if (!ok) text = ((await r.json().catch(() => ({}))).error || {}).message || '';
      } catch { /* offline, or the server isn't reachable */ }
      btn.classList.remove('busy');
      if (!ok) { err(text || 'We couldn’t add you just now. Try again in a moment, or email sales@centrx.co.'); return; }
      box.dataset.joined = '1';
      wlSave('joined');
      // Cenbot says so too: the bubble pops in again with the new line.
      const say = $('[data-wl-say]', box);
      say.textContent = 'You’re on my list. Talk soon!';
      say.classList.remove('wl-pop'); void say.offsetWidth; say.classList.add('wl-pop');
      $('.wl-body', box).innerHTML = `<div class="form-done" role="status">
          <span class="done-ring">${C.icon('check', 24)}</span>
          <h2 class="h3" id="wl-title" tabindex="-1">You’re on the list</h2>
          <p class="body-muted" style="margin-top:8px">We’ll send updates to ${esc(email)} as launch gets closer, and let you know the day we open. Your first 2 months on any paid plan are free when you sign up with that address.</p>
          <div class="hero-cta" style="margin-top:24px;justify-content:center"><button class="btn btn-lg" type="button" data-wl-close>Done</button></div>
        </div>`;
      $('#wl-title', box).focus();
    });
    setTimeout(() => input.focus(), 30);
  }
  if (PRELAUNCH) {
    // Before launch: [data-prelaunch] shows, and [data-wl-label] swaps its words (icons stay) for the waitlist's.
    $$('[data-prelaunch]').forEach((el) => { el.hidden = false; });
    const days = Math.max(1, Math.ceil((LAUNCH - Date.now()) / 864e5));
    $$('[data-launch-days]').forEach((el) => { el.textContent = days === 1 ? 'Opens tomorrow' : `${days} days to go`; });
    $$('[data-wl-label]').forEach((el) => {
      const t = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (t) t.textContent = el.dataset.wlLabel + (t.nextSibling ? ' ' : '');
      else el.textContent = el.dataset.wlLabel;
    });
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-waitlist]');
      if (t) { e.preventDefault(); openWaitlist(t.dataset.waitlist || 'site'); }
    });
    if (header && page !== '404' && !wlSeen()) setTimeout(() => openWaitlist(`${page || 'site'}-popup`), RM ? 400 : 1200);
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
