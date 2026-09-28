/* Plans — single source of truth for pricing, limits, feature gates and add-ons.
   Email/SMS volume is NOT in plans: it's sold as monthly add-on packs (C.ADDONS).
   The panel (meters, gates, billing, signup) and the marketing site both read from here. */
(function () {
  const C = window.Centrx;
  const U = Infinity;

  C.PLAN_ORDER = ['starter', 'growth', 'business'];
  C.ANNUAL_MONTHS = 10; // yearly price = 10 × monthly (2 months free)

  C.PLANS = {
    starter: {
      id: 'starter', name: 'Starter', price: 4900, // cents / month
      tagline: 'For small shops getting organized.',
      highlights: ['2 employees · 1 location', '1,000 customers', '250 orders / mo', 'Stripe + PayPal'],
      bullets: [
        '2 employees', '1 location', 'Up to 1,000 customers', 'Up to 250 orders / month',
        'Up to 250 payment links / month', 'Unlimited shipping labels',
        'Customer management', 'Order management', 'Stripe + PayPal',
        'Basic analytics', 'Basic automations', 'Email support', 'Email sent through notify@centrx.co',
      ],
      analytics: 'Basic',
      limits: {
        orderPhotos: 10, orderVideos: 0, videoSeconds: 0,
        items: 500, categories: 5, customStatuses: 2,
        seats: 2, locations: 1, customers: 1000, orders: 250, links: 250, labels: U,
        paymentProviders: 2, shippingProviders: 1, customRoles: 0,
        auditDays: 7, apiKeys: 0, automations: 3, timelineMonths: 12,
      },
      features: {
        meetup: true, customDeposit: false, requireProof: false, esignature: false, proofVideo: false, signatureExport: false,
        segments: false, csv: false, customDomain: false, removeBranding: false,
        whiteLabel: false, webhooks: false, sso: false, enforceMfa: false,
        timelineExport: false, auditExport: false, granularPerms: false,
      },
      support: 'Email',
    },
    growth: {
      id: 'growth', name: 'Growth', price: 9900, inherits: 'starter',
      tagline: 'For growing teams with repeat customers.',
      highlights: ['10 employees · 2 locations', '10,000 customers', '1,000 orders / mo', 'API access & custom branding'],
      bullets: [
        '10 employees', '2 locations', 'Up to 10,000 customers', 'Up to 1,000 orders / month',
        'Up to 1,000 payment links / month',
        'Advanced analytics', 'Advanced automations', 'Employee permissions', 'API access',
        'Custom branding', 'Priority support', 'Email sent through notify@centrx.co',
      ],
      analytics: 'Advanced',
      limits: {
        orderPhotos: 25, orderVideos: 2, videoSeconds: 60,
        items: 10000, categories: U, customStatuses: U,
        seats: 10, locations: 2, customers: 10000, orders: 1000, links: 1000, labels: U,
        paymentProviders: 2, shippingProviders: 3, customRoles: 5,
        auditDays: 90, apiKeys: 2, automations: 25, timelineMonths: U,
      },
      features: {
        meetup: true, customDeposit: true, requireProof: true, esignature: true, proofVideo: true, signatureExport: false,
        segments: true, csv: true, customDomain: false, removeBranding: true,
        whiteLabel: false, webhooks: false, sso: false, enforceMfa: false,
        timelineExport: false, auditExport: false, granularPerms: false,
      },
      support: 'Priority',
      popular: true,
    },
    business: {
      id: 'business', name: 'Business', price: 19900, inherits: 'growth',
      tagline: 'For established businesses running several locations.',
      highlights: ['Unlimited employees · 5 locations', '50,000 customers', '5,000 orders / mo', 'Send from your own domain'],
      bullets: [
        'Unlimited employees', 'Up to 5 locations', 'Up to 50,000 customers', 'Up to 5,000 orders / month',
        'Up to 5,000 payment links / month',
        'Advanced reporting', 'Advanced permissions', 'Full API access', 'Unlimited automations',
        'White-label dashboard', 'Priority support', 'Connect your domain and send email from it',
      ],
      analytics: 'Advanced + reporting',
      limits: {
        orderPhotos: 50, orderVideos: 5, videoSeconds: 120,
        items: U, categories: U, customStatuses: U,
        seats: U, locations: 5, customers: 50000, orders: 5000, links: 5000, labels: U,
        paymentProviders: U, shippingProviders: U, customRoles: U,
        auditDays: 365, apiKeys: U, automations: U, timelineMonths: U,
      },
      features: {
        meetup: true, customDeposit: true, requireProof: true, esignature: true, proofVideo: true, signatureExport: true,
        segments: true, csv: true, customDomain: true, removeBranding: true,
        whiteLabel: true, webhooks: true, sso: true, enforceMfa: true,
        timelineExport: true, auditExport: true, granularPerms: true,
      },
      support: 'Priority',
    },
  };

  // Messaging add-on packs. Transactional email (receipts, payment links, order
  // updates) is included on every plan and never uses a pack.
  C.ADDONS = {
    email: {
      id: 'email', name: 'Email', label: 'Email pack', unit: 'emails', icon: 'mail',
      metric: 'promoEmails', meterLabel: 'Campaign emails this month',
      covers: 'Campaign and promotional email. Receipts and order updates are always included.',
      overage: { cents: 250, per: 1000, label: '$2.50 per 1,000 extra emails' },
      packs: [
        { id: 'email_5k', qty: 5000, price: 1000 },
        { id: 'email_15k', qty: 15000, price: 2000 },
        { id: 'email_50k', qty: 50000, price: 4000 },
      ],
    },
    sms: {
      id: 'sms', name: 'SMS', label: 'SMS pack', unit: 'texts', icon: 'phone',
      metric: 'sms', meterLabel: 'Texts this month',
      covers: 'Every text: campaigns, replies, texted payment links and order updates. Each segment counts as one.',
      overage: { cents: 4, per: 1, label: '$0.04 per extra text' },
      packs: [
        { id: 'sms_500', qty: 500, price: 1500 },
        { id: 'sms_1500', qty: 1500, price: 3000 },
        { id: 'sms_5000', qty: 5000, price: 6000 },
      ],
    },
  };
  C.ADDON_METRIC = { promoEmails: 'email', sms: 'sms' }; // usage metric → add-on channel
  C.addonPack = (id) => {
    for (const ch in C.ADDONS) { const p = C.ADDONS[ch].packs.find((x) => x.id === id); if (p) return { ...p, channel: ch }; }
    return null;
  };
  C.normAddons = (a) => {
    a = a || {};
    const ok = (ch) => ((C.addonPack(a[ch]) || {}).channel === ch ? a[ch] : null);
    return { email: ok('email'), sms: ok('sms') };
  };
  C.addonsMonthly = (a) => Object.keys(C.ADDONS).reduce((s, ch) => s + ((C.addonPack((a || {})[ch]) || {}).price || 0), 0);
  C.overageCents = (ch, over) => { const o = C.ADDONS[ch].overage; return Math.ceil(over / o.per) * o.cents; };
  C.OVERAGES = { promoEmails: C.ADDONS.email.overage.label, sms: C.ADDONS.sms.overage.label };

  // Comparison table (billing, signup, marketing site). v(plan) → display string, number or boolean.
  const L = (k) => (p) => p.limits[k];
  const F = (k) => (p) => p.features[k];
  C.PLAN_MATRIX = [
    { group: 'Core', rows: [
      ['Employees', L('seats')],
      ['Locations', L('locations')],
      ['Customers', L('customers')],
      ['Orders per month', L('orders')],
      ['Payment links per month', L('links')],
      ['Customer & order management', () => true],
      ['Customer timeline', (p) => (p.limits.timelineMonths === U ? (p.features.timelineExport ? 'Full history + export' : 'Full history') : '12 months')],
      ['Analytics', (p) => p.analytics],
      ['Automations', (p) => (p.limits.automations === U ? 'Unlimited' : `${p.limits.automations} active`)],
    ] },
    { group: 'Payments & shipping', rows: [
      ['Payment providers', (p) => (p.limits.paymentProviders === U ? 'Stripe, PayPal + Square' : 'Stripe + PayPal')],
      ['Shipping labels', () => 'Unlimited'],
      ['Shipping providers', L('shippingProviders')],
    ] },
    { group: 'Inventory', rows: [
      ['Inventory items', L('items')],
      ['Custom categories & fields', (p) => (p.limits.categories === U ? 'Unlimited' : `${p.limits.categories} categories`)],
      ['Custom statuses', (p) => (p.limits.customStatuses === U ? 'Unlimited' : `${p.limits.customStatuses} + defaults`)],
      ['Photos per item', () => 'Unlimited'],
    ] },
    { group: 'Meetup / Dropoff', rows: [
      ['Pay in full, % upfront or dropoff fee', F('meetup')],
      ['Customer payment page & timeline', F('meetup')],
      ['Custom deposit amount', F('customDeposit')],
      ['Proof photos per order', L('orderPhotos')],
      ['Require proof before completing', F('requireProof')],
      ['Customer e-signature', F('esignature')],
      ['Proof video', (p) => (p.limits.orderVideos ? `${p.limits.orderVideos} per order · up to ${p.limits.videoSeconds}s` : false)],
      ['Signature record export', F('signatureExport')],
    ] },
    { group: 'Messaging', rows: [
      ['Receipts, payment links & order emails', () => 'Included'],
      ['Emails sent from', (p) => (p.features.customDomain ? 'Your own domain' : 'notify@centrx.co')],
      ['Shared inbox (email + SMS)', () => true],
      ['Campaign audiences', (p) => (p.features.segments ? 'Segments & tags' : 'All subscribers')],
      ['Campaign email & SMS', () => 'Add-on packs'],
    ] },
    { group: 'Team & security', rows: [
      ['Employee permissions', (p) => (p.limits.customRoles === 0 ? 'Owner + Staff' : p.features.granularPerms ? 'Advanced · per action' : `Up to ${p.limits.customRoles} custom roles`)],
      ['Two-factor auth & sessions', () => true],
      ['Enforce MFA · SSO', F('sso')],
      ['Audit log retention', (p) => (p.limits.auditDays === 365 ? '1 year + export' : p.limits.auditDays + ' days')],
      ['API access', (p) => (p.limits.apiKeys === 0 ? false : p.limits.apiKeys === U ? 'Full · unlimited keys' : `${p.limits.apiKeys} keys`)],
      ['Webhooks', F('webhooks')],
    ] },
    { group: 'Brand & support', rows: [
      ['Segments & CSV import/export', F('segments')],
      ['Custom branding (no "Powered by Centrx")', F('removeBranding')],
      ['White-label dashboard', F('whiteLabel')],
      ['Support', (p) => p.support],
    ] },
  ];

  const tenant = () => (C.tenant && C.tenant()) || {};
  // Canonical id first; saved sessions may hold retired ids (Hobby → Starter, Pro → Growth). Unknown → Growth (trial default).
  const LEGACY = { hobby: 'starter', pro: 'growth' };
  C.planId = (id) => (C.PLAN_ORDER.includes(id) ? id : Object.prototype.hasOwnProperty.call(LEGACY, id) ? LEGACY[id] : 'growth');
  const plan = () => C.PLANS[C.planId(tenant().plan)];
  C.plan = plan;
  C.addon = (ch) => C.addonPack(C.normAddons(tenant().addons)[ch]); // current pack or null
  C.hasPack = (k) => !!C.addon(C.ADDON_METRIC[k] || k); // accepts 'email' | 'sms' | 'promoEmails'
  // promoEmails / sms come from the tenant's packs (0 when none); everything else from the plan.
  C.limit = (k) => (C.ADDON_METRIC[k] ? ((C.addon(C.ADDON_METRIC[k]) || {}).qty || 0) : plan().limits[k]);
  C.can = (feature) => !!plan().features[feature];
  // Lowest plan that unlocks a feature/limit — "Available on Growth". Email/SMS are add-ons, never a plan upgrade.
  C.planFor = (feature) => (C.ADDON_METRIC[feature] || C.ADDONS[feature] ? null
    : C.PLAN_ORDER.map((id) => C.PLANS[id]).find((p) => p.features[feature] || (p.limits[feature] && p.limits[feature] > 0)));
  C.planName = (feature) => (C.planFor(feature) || C.PLANS.business).name;
  C.planWhere = (fn) => C.PLAN_ORDER.map((id) => C.PLANS[id]).find(fn) || C.PLANS.business;
})();
