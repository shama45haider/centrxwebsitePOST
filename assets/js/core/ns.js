/* Centrx namespace + tiny helpers. Everything hangs off window.Centrx so the
   demo runs from file:// with classic scripts (no bundler, no ES modules). */
(function () {
  const C = (window.Centrx = window.Centrx || {});

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  C.esc = (v) => (v == null ? '' : String(v).replace(/[&<>"']/g, (c) => ESC[c]));

  // Template helper: joins arrays, drops null/false. Values are NOT auto-escaped —
  // wrap anything user-typed in C.esc().
  C.html = (strings, ...vals) =>
    strings.reduce((out, s, i) => {
      if (i >= vals.length) return out + s;
      const v = vals[i];
      return out + s + (Array.isArray(v) ? v.join('') : v == null || v === false ? '' : v);
    }, '');

  C.$ = (sel, root = document) => root.querySelector(sel);
  C.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Delegated events: C.on(el, 'click', '[data-act="x"]', (e, target) => {})
  C.on = (root, type, sel, fn) =>
    root.addEventListener(type, (e) => {
      const t = e.target.closest(sel);
      if (t && root.contains(t)) fn(e, t);
    });

  // Replace an element with an empty clone so delegated listeners from a previous
  // page never pile up on a reused container.
  C.fresh = (el) => { const n = el.cloneNode(false); el.replaceWith(n); return n; };

  C.uid = (p = 'id') => p + '_' + Math.random().toString(36).slice(2, 10);
  C.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  C.debounce = (fn, ms = 150) => {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };
  C.clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  // Session storage that never throws (private mode, blocked storage, etc.)
  C.storage = {
    get(k, d = null) {
      try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; }
    },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { sessionStorage.removeItem(k); } catch {} },
  };

  const DAY = 86400000;
  C.DAY = DAY;
  const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const moneyFmt0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const numFmt = new Intl.NumberFormat('en-US');
  const dFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dShort = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  const tFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
  const dLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  C.fmt = {
    money: (cents) => moneyFmt.format((cents || 0) / 100),
    money0: (cents) => moneyFmt0.format((cents || 0) / 100),
    num: (n) => (n === Infinity ? 'Unlimited' : numFmt.format(n || 0)),
    pct: (n, d = 1) => (n * 100).toFixed(d) + '%',
    date: (t) => dFmt.format(new Date(t)),
    dateShort: (t) => {
      const d = new Date(t);
      return d.getFullYear() === new Date().getFullYear() ? dShort.format(d) : dFmt.format(d);
    },
    time: (t) => tFmt.format(new Date(t)),
    dateTime: (t) => C.fmt.dateShort(t) + ', ' + tFmt.format(new Date(t)),
    longDate: (t) => dLong.format(new Date(t)),
    dayLabel: (t) => {
      const d = new Date(t), now = new Date();
      if (sameDay(d, now)) return 'Today';
      if (sameDay(d, new Date(now - DAY))) return 'Yesterday';
      return C.fmt.dateShort(t);
    },
    rel: (t) => {
      const diff = Date.now() - t;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
      if (diff < DAY) return Math.floor(diff / 3600000) + 'h ago';
      if (diff < 2 * DAY) return 'Yesterday';
      if (diff < 7 * DAY) return Math.floor(diff / DAY) + 'd ago';
      return C.fmt.dateShort(t);
    },
    initials: (name) =>
      String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
    plural: (n, one, many) => `${C.fmt.num(n)} ${n === 1 ? one : many || one + 's'}`,
    // US numbers in E.164 (+15035550199) → (503) 555-0199; anything else is shown as given.
    phone: (v) => { const d = String(v || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, ''); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : String(v || ''); },
  };

  // Stable soft color per string (used for avatars / tenant logos)
  const SOFT = [
    ['#EEF3FF', '#1D4ED8'], ['#ECFDF3', '#067647'], ['#FFF6ED', '#B93815'], ['#F4F3FF', '#5925DC'],
    ['#FDF2FA', '#C11574'], ['#F0F9FF', '#026AA2'], ['#FEFBE8', '#A15C07'], ['#F2F4F7', '#344054'],
  ];
  C.hash = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); };
  C.softColor = (s) => SOFT[C.hash(s) % SOFT.length];
})();
