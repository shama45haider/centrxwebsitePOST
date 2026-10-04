/* Plans — single source of truth for pricing, limits, feature gates and add-ons.
   Email/SMS volume is NOT in plans: it's sold as monthly add-on packs (C.ADDONS).
   The panel (meters, gates, billing, signup) and the marketing site both read from here. */
(function () {
  const C = window.Centrx;
  const U = Infinity;

  C.PLAN_ORDER = ['starter', 'growth', 'business', 'enterprise'];
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
        auditDays: 30, apiKeys: 0, automations: 3, timelineMonths: 12,
      },
      features: {
        meetup: true, customDeposit: false, requireProof: false, esignature: false, proofVideo: false, signatureExport: false,
        segments: false, csv: false, customDomain: false, removeBranding: false,
        whiteLabel: false, webhooks: false, sso: false, enforceMfa: false,
        timelineExport: false, auditExport: false, granularPerms: false,
        onlineStore: false, phoneLine: false,
      },
      support: 'Email',
    },
    growth: {
      id: 'growth', name: 'Growth', price: 9900, inherits: 'starter',
      tagline: 'For growing teams with repeat customers.',
      highlights: ['10 employees · 2 locations', '10,000 customers', '1,000 orders / mo', 'Custom branding'],
      bullets: [
        '10 employees', '2 locations', 'Up to 10,000 customers', 'Up to 1,000 orders / month',
        'Up to 1,000 payment links / month',
        'Advanced analytics', 'Advanced automations', 'Employee permissions',
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
        onlineStore: false, phoneLine: false,
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
        'Advanced reporting', 'Advanced permissions', 'Unlimited automations',
        'White-label dashboard', 'Online Store with a drag-and-drop editor', 'Priority support',
        'Connect your domain and send email from it',
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
        onlineStore: true, phoneLine: false,
      },
      support: 'Priority',
    },
    enterprise: {
      id: 'enterprise', name: 'Enterprise', price: 32999, inherits: 'business',
      tagline: 'For high-volume businesses that need more.',
      highlights: ['Unlimited employees · 15 locations', '250,000 customers', '25,000 orders / mo', 'Business phone line'],
      bullets: [
        'Up to 15 locations', 'Up to 250,000 customers', 'Up to 25,000 orders / month',
        'Up to 25,000 payment links / month',
        'Business phone line for calls and texts', 'Cenbot AI with higher usage limits',
        'Online Store on your own domain', '2-year audit log', 'Priority phone support',
      ],
      analytics: 'Advanced + reporting',
      limits: {
        orderPhotos: 100, orderVideos: 10, videoSeconds: 300,
        items: U, categories: U, customStatuses: U,
        seats: U, locations: 15, customers: 250000, orders: 25000, links: 25000, labels: U,
        paymentProviders: U, shippingProviders: U, customRoles: U,
        auditDays: 730, apiKeys: U, automations: U, timelineMonths: U,
      },
      features: {
        meetup: true, customDeposit: true, requireProof: true, esignature: true, proofVideo: true, signatureExport: true,
        segments: true, csv: true, customDomain: true, removeBranding: true,
        whiteLabel: true, webhooks: true, sso: true, enforceMfa: true,
        timelineExport: true, auditExport: true, granularPerms: true,
        onlineStore: true, phoneLine: true,
      },
      cenbot: 'Higher usage limits',
      support: 'Priority + phone',
    },
  };

  // Custom is by application only: a business applies from Plan & billing, then a Centrx admin
  // verifies it and sets its limits and price. Not in PLAN_ORDER, so it never appears as a
  // self-serve upgrade. Review happens in the admin dashboard (planned, see docs/roadmap.md).
  C.CUSTOM_PLAN = {
    id: 'custom', name: 'Custom', inherits: 'enterprise',
    tagline: 'For businesses that have outgrown Enterprise.',
    bullets: [
      'Higher limits on locations, customers, orders and links',
      'Volume pricing on email and SMS',
      'A dedicated onboarding and support contact',
      'Monthly or annual billing, priced to fit',
    ],
    review: 'Every application is reviewed by our team, usually within two business days.',
  };

  // Messaging add-on packs. Transactional email (receipts, payment links, order
  // updates) is included on every plan and never uses a pack.
  // Pricing rationale lives in docs/plans.md → "Pack economics". Overage is priced well above the
  // biggest pack's rate.
  C.ADDONS = {
    email: {
      id: 'email', name: 'Email', label: 'Email pack', unit: 'emails', icon: 'mail',
      metric: 'promoEmails', meterLabel: 'Campaign emails this month',
      covers: 'Campaign and promotional email. Receipts and order updates are always included.',
      overage: { cents: 150, per: 1000, label: '$1.50 per 1,000 extra emails' },
      includes: [
        'Campaigns and promotional email',
        'Open, click and bounce tracking',
        'Unsubscribes handled automatically',
        'Sent from notify@centrx.co, or your own domain on Business and Enterprise',
        'Change or cancel anytime',
      ],
      packs: [
        { id: 'email_10k', qty: 10000, price: 900, tagline: 'For a monthly newsletter and the occasional promotion.' },
        { id: 'email_50k', qty: 50000, price: 2900, tagline: 'For weekly campaigns to a growing list.', popular: true },
        { id: 'email_150k', qty: 150000, price: 6900, tagline: 'For frequent campaigns to a large list.' },
      ],
    },
    sms: {
      id: 'sms', name: 'SMS', label: 'SMS pack', unit: 'texts', icon: 'phone',
      metric: 'sms', meterLabel: 'Texts this month',
      covers: 'Every text: campaigns, replies, texted payment links and order updates. Each segment counts as one.',
      overage: { cents: 5, per: 1, label: '$0.05 per extra text' },
      includes: [
        'A dedicated toll-free number, registered for you',
        'Texts only to customers who opted in',
        'STOP and HELP replies handled for you',
        'No marketing texts late at night',
        'Messages over 160 characters count as more than one text',
        'Change or cancel anytime',
      ],
      packs: [
        { id: 'sms_500', qty: 500, price: 1900, tagline: 'For pickup alerts, reminders and the odd promotion.' },
        { id: 'sms_2000', qty: 2000, price: 6500, tagline: 'For regular promotions to opted-in customers.', popular: true },
        { id: 'sms_5000', qty: 5000, price: 14900, tagline: 'For busy shops texting customers every week.' },
      ],
    },
  };
  // Texting numbers. Carriers require every business to text from its own registered number.
  // One toll-free number comes with any SMS pack; local and existing numbers are upsells
  // (docs/plans.md → "Texting numbers"). Review times are carrier estimates.
  C.SMS_NUMBERS = {
    tollfree: { id: 'tollfree', name: 'Toll-free number', short: 'Toll-free', price: 0, setup: 0, review: 'usually 3–7 business days',
      blurb: 'A dedicated 1-833 number, verified for business texting.' },
    local: { id: 'local', name: 'Local number', short: 'Local', price: 1000, setup: 2900, review: 'usually 1–2 weeks',
      blurb: 'A number in your area code that customers recognize.' },
    existing: { id: 'existing', name: 'Your current business number', short: 'Your number', price: 1500, setup: 2900, review: 'usually 2–3 weeks',
      blurb: 'Text from the number your customers already have saved.' },
  };
  C.SMS_NUMBER_ORDER = ['tollfree', 'local', 'existing'];
  C.EXTRA_NUMBER = 1000; // each number after the first, e.g. one per location
  // First number is priced by its type; every extra number costs at least C.EXTRA_NUMBER.
  C.numberPrice = (type, index) => (index === 0 ? C.SMS_NUMBERS[type].price : Math.max(C.EXTRA_NUMBER, C.SMS_NUMBERS[type].price));
  C.numbersMonthly = (nums) => (nums || []).reduce((s, n, i) => s + C.numberPrice(n.type, i), 0);

  // Pack ids retired in the October 2026 repricing → the pack that replaced them.
  const LEGACY_PACK = { email_5k: 'email_10k', email_15k: 'email_50k', sms_1500: 'sms_2000' };
  C.ADDON_METRIC = { promoEmails: 'email', sms: 'sms' }; // usage metric → add-on channel
  C.addonPack = (id) => {
    for (const ch in C.ADDONS) { const p = C.ADDONS[ch].packs.find((x) => x.id === id); if (p) return { ...p, channel: ch }; }
    return null;
  };
  C.normAddons = (a) => {
    a = a || {};
    const ok = (ch) => {
      const id = Object.prototype.hasOwnProperty.call(LEGACY_PACK, a[ch]) ? LEGACY_PACK[a[ch]] : a[ch];
      return (C.addonPack(id) || {}).channel === ch ? id : null;
    };
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
      ['Cenbot AI assistant', (p) => p.cenbot || 'Included'],
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
      ['Business phone line (calls + texts)', F('phoneLine')],
    ] },
    { group: 'Online Store', rows: [
      ['Online Store with your inventory', F('onlineStore')],
      ['Drag-and-drop store editor', F('onlineStore')],
      ['Store on your own domain', F('onlineStore')],
    ] },
    { group: 'Team & security', rows: [
      ['Employee permissions', (p) => (p.limits.customRoles === 0 ? 'Owner + Staff' : p.features.granularPerms ? 'Advanced · per action' : `Up to ${p.limits.customRoles} custom roles`)],
      ['Two-factor auth & sessions', () => true],
      ['Enforce MFA · SSO', F('sso')],
      ['Audit log retention', (p) => (p.limits.auditDays >= 365 ? `${p.limits.auditDays / 365 === 1 ? '1 year' : `${p.limits.auditDays / 365} years`} + export` : p.limits.auditDays + ' days')],
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
  C.smsNumbers = () => tenant().smsNumbers || [];
  C.hasSmsNumber = () => C.smsNumbers().some((n) => n.status === 'active'); // texts need an active, carrier-approved number
  // promoEmails / sms come from the tenant's packs (0 when none); everything else from the plan.
  C.limit = (k) => (C.ADDON_METRIC[k] ? ((C.addon(C.ADDON_METRIC[k]) || {}).qty || 0) : plan().limits[k]);
  C.can = (feature) => !!plan().features[feature];
  // Lowest plan that unlocks a feature/limit — "Available on Growth". Email/SMS are add-ons, never a plan upgrade.
  C.planFor = (feature) => (C.ADDON_METRIC[feature] || C.ADDONS[feature] ? null
    : C.PLAN_ORDER.map((id) => C.PLANS[id]).find((p) => p.features[feature] || (p.limits[feature] && p.limits[feature] > 0)));
  C.planName = (feature) => (C.planFor(feature) || C.PLANS.business).name;
  C.planWhere = (fn) => C.PLAN_ORDER.map((id) => C.PLANS[id]).find(fn) || C.PLANS.business;
})();
