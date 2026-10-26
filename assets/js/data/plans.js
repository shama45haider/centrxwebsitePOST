/* Plans — single source of truth for pricing, limits, feature gates and add-ons.
   Email/SMS volume is NOT in plans: it's sold as monthly add-on packs (C.ADDONS).
   The panel (meters, gates, billing, signup) and the marketing site both read from here. */
(function () {
  const C = window.Centrx;
  const U = Infinity;

  // Free comes first: signup offers it and Plan & billing can move down to it. PAID_PLAN_ORDER is
  // the plans with a price: the pricing cards, annual billing and add-ons.
  C.PLAN_ORDER = ['free', 'starter', 'growth', 'business', 'enterprise'];
  C.PAID_PLAN_ORDER = C.PLAN_ORDER.slice(1);
  C.ANNUAL_MONTHS = 10; // yearly price = 10 × monthly (2 months free)

  C.PLANS = {
    free: {
      // $0, but Centrx keeps cardFeePct of each card payment, so a growing shop is better off upgrading.
      id: 'free', name: 'Free', price: 0, cardFeePct: 5,
      tagline: 'For trying Centrx on your own.',
      highlights: ['1 employee · 1 location', '1 GB cloud storage', 'Up to 50 customers', '5% fee on card payments'],
      bullets: [
        '1 employee', '1 location', '1 GB cloud storage', '25 inventory items', 'Up to 50 customers',
        'Unlimited orders and payment links', 'Stripe, PayPal and Square', 'Meetup and dropoff payment pages',
        'Help center support',
      ],
      analytics: 'Basic',
      limits: {
        orderPhotos: 3, orderVideos: 0, videoSeconds: 0,
        items: 25, categories: 2, customStatuses: 0,
        seats: 1, locations: 1, customers: 50, orders: U, links: U, labels: U, storageGB: 1,
        paymentProviders: 3, shippingProviders: 1, customRoles: 0,
        auditDays: 7, apiKeys: 0, automations: 0, timelineMonths: 12, cenbotReplies: 0, phoneMinutes: 0,
      },
      features: {
        meetup: true, customDeposit: false, requireProof: false, esignature: false, proofVideo: false, signatureExport: false,
        segments: false, csv: true, customDomain: false, removeBranding: false,
        whiteLabel: false, webhooks: false, sso: false, enforceMfa: false,
        timelineExport: false, auditExport: false, granularPerms: false, advancedAutomations: false, advancedAnalytics: false, reports: false,
        onlineStore: true, storeDesign: false, storeAI: false, storeCustomDomain: false, extraLocations: false, phoneLine: false,
        inboxTeam: false, inboxRules: false, connectMailbox: true, autoConnectDomain: false,
      },
      support: 'Help center',
    },
    starter: {
      // id stays 'starter' so saved accounts and signup links keep matching.
      id: 'starter', name: 'Hobby', price: 3900, // cents / month
      tagline: 'For small shops getting organized.',
      highlights: ['2 employees · 1 location', '25 GB cloud storage', 'Unlimited customers and orders', 'Stripe, PayPal + Square'],
      bullets: [
        '2 employees', '1 location', '25 GB cloud storage', 'Unlimited customers, orders and payment links',
        'Unlimited shipping labels',
        'Customer management', 'Order management', 'Cenbot AI, 500 replies / month', 'Stripe, PayPal and Square',
        'CSV import and export', 'Basic analytics', 'Basic automations', 'Email support',
        'Email sent through notify@centrx.co',
      ],
      analytics: 'Basic',
      limits: {
        orderPhotos: 10, orderVideos: 0, videoSeconds: 0,
        items: 500, categories: 5, customStatuses: 2,
        seats: 2, locations: 1, customers: U, orders: U, links: U, labels: U, storageGB: 25,
        paymentProviders: 3, shippingProviders: 1, customRoles: 0,
        auditDays: 30, apiKeys: 0, automations: 3, timelineMonths: 12, cenbotReplies: 500, phoneMinutes: 500,
      },
      features: {
        meetup: true, customDeposit: false, requireProof: false, esignature: false, proofVideo: false, signatureExport: false,
        segments: false, csv: true, customDomain: true, removeBranding: false,
        whiteLabel: false, webhooks: false, sso: false, enforceMfa: false,
        timelineExport: false, auditExport: false, granularPerms: false, advancedAutomations: false, advancedAnalytics: false, reports: false,
        onlineStore: true, storeDesign: false, storeAI: false, storeCustomDomain: false, extraLocations: false, phoneLine: false,
        inboxTeam: false, inboxRules: false, connectMailbox: true, autoConnectDomain: false,
      },
      support: 'Email',
    },
    growth: {
      // id stays 'growth' so saved accounts and signup links keep matching.
      id: 'growth', name: 'Pro', price: 9900, inherits: 'starter',
      tagline: 'For growing teams with repeat customers.',
      highlights: ['10 employees · 2 locations', '100 GB cloud storage', 'Online Store included', 'Custom branding'],
      bullets: [
        '10 employees', '2 locations', '100 GB cloud storage',
        'Advanced analytics', 'Advanced automations', 'Employee permissions',
        'Online Store with a drag-and-drop editor', 'Cenbot AI, 2,500 replies / month', 'Assign conversations and add internal notes', 'Campaign segments and tags', 'Custom branding', 'Webhooks and API keys',
        'Require two-factor sign-in for your team', 'Priority support',
      ],
      analytics: 'Advanced',
      limits: {
        orderPhotos: 25, orderVideos: 2, videoSeconds: 60,
        items: 10000, categories: U, customStatuses: U,
        seats: 10, locations: 2, customers: U, orders: U, links: U, labels: U, storageGB: 100,
        paymentProviders: 3, shippingProviders: 3, customRoles: 5,
        auditDays: 90, apiKeys: 2, automations: 25, timelineMonths: U, cenbotReplies: 2500, phoneMinutes: 500,
      },
      features: {
        meetup: true, customDeposit: true, requireProof: true, esignature: true, proofVideo: true, signatureExport: false,
        segments: true, csv: true, customDomain: true, removeBranding: true,
        whiteLabel: false, webhooks: true, sso: false, enforceMfa: true,
        timelineExport: false, auditExport: false, granularPerms: false, advancedAutomations: true, advancedAnalytics: true, reports: false,
        onlineStore: true, storeDesign: true, storeAI: true, storeCustomDomain: false, extraLocations: false, phoneLine: false,
        inboxTeam: true, inboxRules: false, connectMailbox: true, autoConnectDomain: false,
      },
      support: 'Priority',
      popular: true,
    },
    business: {
      id: 'business', name: 'Business', price: 19900, inherits: 'growth',
      tagline: 'For established businesses running several locations.',
      highlights: ['Unlimited employees · 5 locations', '500 GB cloud storage', 'Unlimited customers and orders', 'Your Online Store on your own domain'],
      bullets: [
        'Unlimited employees', 'Up to 5 locations', '500 GB cloud storage',
        'Cenbot AI, 10,000 replies / month', 'Advanced reporting', 'Advanced permissions', 'Unlimited automations',
        'Your Online Store on your own domain', 'One-click domain setup for Business Email (coming soon)', 'Inbox rules and auto-assign', 'Extra locations at $20/month each', '1-year audit log with export',
        'Timeline and signature record export', 'Priority support',
      ],
      analytics: 'Advanced + reporting',
      limits: {
        orderPhotos: 50, orderVideos: 5, videoSeconds: 120,
        items: U, categories: U, customStatuses: U,
        seats: U, locations: 5, customers: U, orders: U, links: U, labels: U, storageGB: 500,
        paymentProviders: U, shippingProviders: U, customRoles: U,
        auditDays: 365, apiKeys: U, automations: U, timelineMonths: U, cenbotReplies: 10000, phoneMinutes: 500,
      },
      features: {
        meetup: true, customDeposit: true, requireProof: true, esignature: true, proofVideo: true, signatureExport: true,
        segments: true, csv: true, customDomain: true, removeBranding: true,
        whiteLabel: false, webhooks: true, sso: false, enforceMfa: true,
        timelineExport: true, auditExport: true, granularPerms: true, advancedAutomations: true, advancedAnalytics: true, reports: true,
        onlineStore: true, storeDesign: true, storeAI: true, storeCustomDomain: true, extraLocations: true, phoneLine: false,
        inboxTeam: true, inboxRules: true, connectMailbox: true, autoConnectDomain: true,
      },
      support: 'Priority',
    },
    enterprise: {
      id: 'enterprise', name: 'Enterprise', price: 34900, inherits: 'business',
      tagline: 'For high-volume businesses that need more.',
      highlights: ['Unlimited employees · 15 locations', '2 TB cloud storage', 'Unlimited customers and orders', 'Business phone line'],
      bullets: [
        'Up to 15 locations', '2 TB cloud storage',
        'Business phone line included (2,000 minutes)', 'Cenbot AI, 50,000 replies / month',
        'Single sign-on (SSO)', 'Custom branded panel', '2-year audit log', 'Priority phone support',
      ],
      analytics: 'Advanced + reporting',
      limits: {
        orderPhotos: 100, orderVideos: 10, videoSeconds: 300,
        items: U, categories: U, customStatuses: U,
        seats: U, locations: 15, customers: U, orders: U, links: U, labels: U, storageGB: 2000,
        paymentProviders: U, shippingProviders: U, customRoles: U,
        auditDays: 730, apiKeys: U, automations: U, timelineMonths: U, cenbotReplies: 50000, phoneMinutes: 2000,
      },
      features: {
        meetup: true, customDeposit: true, requireProof: true, esignature: true, proofVideo: true, signatureExport: true,
        segments: true, csv: true, customDomain: true, removeBranding: true,
        whiteLabel: true, webhooks: true, sso: true, enforceMfa: true,
        timelineExport: true, auditExport: true, granularPerms: true, advancedAutomations: true, advancedAnalytics: true, reports: true,
        onlineStore: true, storeDesign: true, storeAI: true, storeCustomDomain: true, extraLocations: true, phoneLine: true,
        inboxTeam: true, inboxRules: true, connectMailbox: true, autoConnectDomain: true,
      },
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
      'More locations and more cloud storage than Enterprise',
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
        'Sent from notify@centrx.co, or your own domain with Business Email',
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
  // Business Email: send from a domain the business already owns, with its inbox addresses. A monthly
  // add-on per connected domain, open to every plan. Business and up connect with one click (coming soon);
  // other plans follow guided copy-and-paste steps. maxDomains is a safety cap, not a plan limit.
  C.BUSINESS_EMAIL = { price: 900, name: 'Business Email', maxDomains: 25 };
  // Extra locations beyond a plan's included count: Business and Enterprise only (below that, upgrade).
  C.EXTRA_LOCATION = { price: 2000, name: 'Extra location' };
  // Business phone line: a number customers can call and text, answered in Centrx.
  // Included on Enterprise (features.phoneLine); a monthly add-on on every other plan.
  // Minutes cover calls in and out; past the allowance each extra minute costs overage cents. Enterprise gets more minutes.
  C.PHONE_LINE = { price: 2500, name: 'Business phone line', overageCents: 4 };
  // Cloud storage: each plan includes an allowance for photos, IDs, videos, receipts and recordings.
  // Customers, orders and payment links are unlimited on every paid plan, so storage is the usage limit.
  // Extra storage is sold in blocks, billed monthly, and can be added or removed anytime.
  C.STORAGE_ADDON = { gb: 100, price: 500, name: 'Extra cloud storage' };
  C.fmtStorage = (gb) => (gb >= 1000 ? `${+(gb / 1000).toFixed(1)} TB` : `${gb} GB`);
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
  const paid = (p) => p.price > 0; // add-ons and messaging packs are for paid plans
  C.PLAN_MATRIX = [
    { group: 'Core', rows: [
      ['Employees', L('seats')],
      ['Locations', L('locations')],
      ['Extra locations', (p) => (p.features.extraLocations ? `${C.fmt.money0(C.EXTRA_LOCATION.price)}/mo each` : false)],
      ['Customers', L('customers')],
      ['Orders', L('orders')],
      ['Payment links', L('links')],
      ['Customer & order management', () => true],
      ['Customer timeline', (p) => (p.limits.timelineMonths === U ? (p.features.timelineExport ? 'Full history + export' : 'Full history') : '12 months')],
      ['Analytics', (p) => p.analytics],
      ['Cenbot AI assistant', (p) => (p.limits.cenbotReplies ? `${C.fmt.num(p.limits.cenbotReplies)} replies / month` : false)],
      ['Automations', (p) => (p.limits.automations ? `${p.limits.automations === U ? 'Unlimited' : `${p.limits.automations} active`} · ${p.features.advancedAutomations ? 'advanced' : 'basic'}` : false)],
    ] },
    { group: 'Cloud storage', rows: [
      ['Storage included', (p) => C.fmtStorage(p.limits.storageGB)],
      ['Inventory photos and Files', () => 'Counted in your storage'],
      ['Extra storage', (p) => (paid(p) ? `${C.fmtStorage(C.STORAGE_ADDON.gb)} for ${C.fmt.money0(C.STORAGE_ADDON.price)}/mo` : false)],
      ['Private by default and backed up', () => true],
    ] },
    { group: 'Payments & shipping', rows: [
      ['Payment providers', () => 'Stripe, PayPal + Square'],
      ['Centrx fee on card payments', (p) => (p.cardFeePct ? `${p.cardFeePct}%` : 'None')],
      ['Shipping labels', () => 'Unlimited'],
      ['Shipping providers', L('shippingProviders')],
    ] },
    { group: 'Inventory', rows: [
      ['Inventory items', L('items')],
      ['Custom categories & fields', (p) => (p.limits.categories === U ? 'Unlimited' : `${p.limits.categories} categories`)],
      ['Custom statuses', (p) => (p.limits.customStatuses === U ? 'Unlimited' : p.limits.customStatuses ? `${p.limits.customStatuses} + defaults` : 'Defaults only')],
      ['Photos per item', () => 'Within your storage'],
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
      ['Business Email on your own domain', () => `${C.fmt.money0(C.BUSINESS_EMAIL.price)}/mo per domain`],
      ['Domain setup', (p) => (p.features.autoConnectDomain ? 'One-click · coming soon' : 'Guided steps')],
      ['Shared inbox (email + SMS)', () => true],
      ['Saved replies', () => true],
      ['Assign conversations & internal notes', F('inboxTeam')],
      ['Inbox rules & auto-assign', F('inboxRules')],
      ['Connect your Gmail or Outlook', F('connectMailbox')],
      ['Campaign audiences', (p) => (!paid(p) ? false : p.features.segments ? 'Segments & tags' : 'All subscribers')],
      ['Campaign email & SMS', (p) => (paid(p) ? 'Add-on packs' : false)],
      ['Business phone line (calls + texts)', (p) => (!paid(p) ? false : p.features.phoneLine ? `Included · ${C.fmt.num(p.limits.phoneMinutes)} min` : `${C.fmt.money0(C.PHONE_LINE.price)}/mo · ${C.fmt.num(p.limits.phoneMinutes)} min`)],
    ] },
    { group: 'Online Store', rows: [
      ['Online Store with your inventory', F('onlineStore')],
      ['Drag-and-drop store editor', F('onlineStore')],
      ['Store templates', (p) => (p.features.storeDesign ? 'All 10' : '3 starter templates')],
      ['Advanced store design: colors, fonts, layouts, reviews, FAQ and more', F('storeDesign')],
      ['Design your store with Cenbot', F('storeAI')],
      ['Store address', (p) => (p.features.storeCustomDomain ? 'Your own domain' : p.features.onlineStore ? 'A Centrx address' : false)],
    ] },
    { group: 'Team & security', rows: [
      ['Employee permissions', (p) => (p.limits.seats === 1 ? 'Owner only' : p.limits.customRoles === 0 ? 'Owner + Staff' : p.features.granularPerms ? 'Advanced · per action' : `Up to ${p.limits.customRoles} custom roles`)],
      ['Two-factor auth & sessions', () => true],
      ['Require two-factor for your team', F('enforceMfa')],
      ['Single sign-on (SSO)', F('sso')],
      ['Audit log retention', (p) => (p.limits.auditDays >= 365 ? `${p.limits.auditDays / 365 === 1 ? '1 year' : `${p.limits.auditDays / 365} years`} + export` : p.limits.auditDays + ' days')],
      ['Webhooks', F('webhooks')],
      ['API keys', L('apiKeys')],
    ] },
    { group: 'Brand & support', rows: [
      ['CSV import & export', F('csv')],
      ['Custom branding (no "Powered by Centrx")', F('removeBranding')],
      ['Custom branded panel', F('whiteLabel')],
      ['Support', (p) => p.support],
    ] },
  ];

  const tenant = () => (C.tenant && C.tenant()) || {};
  // Canonical id first; saved sessions may hold retired ids (hobby → starter and pro → growth, the ids behind the Hobby and Pro plans). Unknown → Pro (the default plan).
  const LEGACY = { hobby: 'starter', pro: 'growth' };
  // 'custom' exists only where the platform store loads (panel and staff console), never on the public site.
  C.planId = (id) => (C.PLAN_ORDER.includes(id) || (id === 'custom' && C.PLANS.custom) ? id : Object.prototype.hasOwnProperty.call(LEGACY, id) ? LEGACY[id] : 'growth');
  const plan = () => { const t = tenant(), id = C.planId(t.plan); return id === 'custom' && C.customPlanFor ? C.customPlanFor(t) : C.PLANS[id]; };
  C.plan = plan;
  C.addon = (ch) => C.addonPack(C.normAddons(tenant().addons)[ch]); // current pack or null
  C.hasPack = (k) => !!C.addon(C.ADDON_METRIC[k] || k); // accepts 'email' | 'sms' | 'promoEmails'
  C.smsNumbers = () => tenant().smsNumbers || [];
  C.hasSmsNumber = () => C.smsNumbers().some((n) => n.status === 'active'); // texts need an active, carrier-approved number
  // promoEmails / sms come from the tenant's packs (0 when none); everything else from the plan.
  C.limit = (k) => (C.ADDON_METRIC[k] ? ((C.addon(C.ADDON_METRIC[k]) || {}).qty || 0) : plan().limits[k]);
  C.can = (feature) => !!plan().features[feature];
  // Lowest plan that unlocks a feature/limit — "Available on Pro". Email/SMS are add-ons, never a plan upgrade.
  C.planFor = (feature) => (C.ADDON_METRIC[feature] || C.ADDONS[feature] ? null
    : C.PLAN_ORDER.map((id) => C.PLANS[id]).find((p) => p.features[feature] || (p.limits[feature] && p.limits[feature] > 0)));
  C.planName = (feature) => (C.planFor(feature) || C.PLANS.business).name;
  C.planWhere = (fn) => C.PLAN_ORDER.map((id) => C.PLANS[id]).find(fn) || C.PLANS.business;
})();
