/* Centrx people: simple line characters for the marketing site.
   <span data-person="courier"></span> becomes an inline SVG; colours come from .pp in site.css. */
(function () {
  const limb = (d, w, fill = 'f') =>
    `<path class="lo" stroke-width="${w + 4}" d="${d}"/>` +
    (fill ? `<path class="li${fill === 'f' ? '' : ' ' + fill}" stroke-width="${w}" d="${d}"/>` : '');
  const solid = (d) => limb(d, 12, null);
  const eyes = (x1, x2, y) => `<circle class="k" cx="${x1}" cy="${y}" r="1.7"/><circle class="k" cx="${x2}" cy="${y}" r="1.7"/>`;
  const smile = (x, y, w = 8) => `<path stroke-width="1.7" d="M${x - w / 2} ${y} Q${x} ${y + 3.2} ${x + w / 2} ${y}"/>`;
  const ground = (x1, x2, y) => `<path class="gl" d="M${x1} ${y} H${x2}"/>`;
  const wave = (x, y) => `<path d="M${x} ${y} c3 3 4 7 3 11"/><path d="M${x + 5} ${y - 7} c4 5 6 11 5 18"/>`;

  const P = {
    // Leaning on a ledge; the bottom edge of the drawing is the ledge.
    peeker: { w: 120, h: 90, svg: [
      limb('M60 50 L60 60', 8),
      '<path class="t" stroke="none" d="M30 92 V77 C30 65 42 58 60 58 C78 58 90 65 90 77 V92 Z"/>',
      '<path d="M30 90 V77 C30 65 42 58 60 58 C78 58 90 65 90 77 V90"/>',
      '<path d="M53 59 Q60 65 67 59"/>',
      limb('M36 70 C31 80 33 85 41 85 H60', 9),
      limb('M84 70 C89 80 87 85 79 85 H62', 9),
      '<circle class="k" cx="60" cy="12" r="8"/>',
      '<circle class="f" cx="60" cy="34" r="17"/>',
      '<path class="k" d="M43 34 C43 22 50 16 60 16 C70 16 77 22 77 34 C73 29 67 26 60 26 C53 26 47 29 43 34 Z"/>',
      eyes(54, 66, 37), smile(60, 43),
    ] },
    peekerWave: { w: 124, h: 90, svg: [
      limb('M60 50 L60 60', 8),
      '<path class="f" stroke="none" d="M30 92 V77 C30 65 42 58 60 58 C78 58 90 65 90 77 V92 Z"/>',
      '<path d="M30 90 V77 C30 65 42 58 60 58 C78 58 90 65 90 77 V90"/>',
      '<path d="M53 59 Q60 65 67 59"/>',
      limb('M36 70 C31 80 33 85 41 85 H62', 9),
      limb('M84 69 C95 63 100 53 101 40', 9),
      '<circle class="f" cx="60" cy="34" r="17"/>',
      '<path class="k" d="M43 35 C42 23 50 17 60 17 C70 17 78 23 77 34 C71 29 63 27 55 29 C50 30 46 32 43 35 Z"/>',
      '<g stroke-width="1.6"><circle cx="54" cy="37" r="4.6"/><circle cx="66" cy="37" r="4.6"/><path d="M58.6 37 H61.4"/></g>',
      eyes(54, 66, 37), smile(60, 45, 7),
      wave(109, 30),
    ] },
    waver: { w: 130, h: 197, svg: [
      ground(24, 104, 197),
      solid('M51 124 L50 187'), solid('M69 124 L70 187'),
      '<path class="k" d="M39 197 C39 191 44 187 50 187 C55 187 58 191 58 197 Z"/>',
      '<path class="k" d="M62 197 C62 191 65 187 70 187 C76 187 81 191 81 197 Z"/>',
      limb('M60 50 L60 62', 8),
      '<path class="t" d="M38 77 C38 66 46 60 60 60 C74 60 82 66 82 77 L81 124 Q81 129 76 129 L44 129 Q39 129 39 124 Z"/>',
      '<path d="M53 61 Q60 67 67 61"/>',
      limb('M44 69 C39 87 38 104 41 121', 9),
      limb('M76 69 C86 64 92 57 95 46 C97 40 98 34 99 29', 9),
      '<circle class="f" cx="60" cy="36" r="17"/>',
      '<path class="k" d="M43 37 C42 24 50 17 61 17 C72 17 79 25 77 37 C74 31 70 28 64 28 C58 28 54 31 50 30 C47 30 45 33 43 37 Z"/>',
      eyes(54, 66, 39), smile(60, 45),
      wave(108, 22),
    ] },
    courier: { w: 130, h: 194, svg: [
      ground(22, 112, 194),
      solid('M59 124 C57 146 52 166 46 185'), solid('M65 124 C70 144 76 164 82 183'),
      '<path class="k" d="M37 194 C37 188 42 185 47 185 C53 186 57 189 57 194 Z"/>',
      '<path class="k" d="M76 192 C76 186 81 183 86 183 C92 184 97 187 97 192 Z"/>',
      limb('M63 51 L62 62', 8),
      '<path class="f" d="M46 77 C46 66 52 60 62 60 C72 60 78 66 78 77 L78 124 Q78 129 73 129 L51 129 Q46 129 46 124 Z"/>',
      '<path d="M56 61 Q62 66 68 61"/>',
      '<rect class="f" x="72" y="78" width="42" height="34" rx="2"/>',
      '<rect class="a" x="89" y="78" width="8" height="34"/>',
      '<path d="M72 88 H114"/>',
      limb('M70 69 C73 85 74 98 80 104 C85 108 92 108 99 105', 9),
      '<circle class="f" cx="64" cy="36" r="17"/>',
      '<path class="k" d="M47 36 C47 25 54 18 64 18 C74 18 81 25 81 35 Z"/>',
      '<path stroke-width="4" d="M79 34 L96 35"/>',
      eyes(66, 75, 41), smile(71, 47, 7),
    ] },
    phone: { w: 120, h: 197, svg: [
      ground(26, 96, 197),
      solid('M50 124 L49 187'), solid('M66 124 L68 187'),
      '<path class="k" d="M40 197 C40 191 44 187 50 187 C56 187 60 191 61 197 Z"/>',
      '<path class="k" d="M58 197 C58 191 62 187 68 187 C74 187 79 191 80 197 Z"/>',
      limb('M45 69 C41 87 40 104 43 120', 9),
      limb('M58 50 L58 62', 8),
      '<path class="t" d="M40 77 C40 66 47 60 58 60 C69 60 76 66 76 77 L76 124 Q76 129 71 129 L45 129 Q40 129 40 124 Z"/>',
      '<path d="M52 61 Q58 66 64 61"/>',
      limb('M70 69 C75 85 76 97 74 105 C80 101 84 95 87 89', 9),
      '<rect class="a" x="82" y="72" width="13" height="21" rx="3" transform="rotate(-14 88.5 82.5)"/>',
      '<circle class="f" cx="58" cy="36" r="17"/>',
      '<path class="k" d="M41 40 C39 26 47 18 58 18 C69 18 76 25 75 35 C70 31 64 30 59 31 C55 33 53 37 53 43 C53 48 54 51 56 53 L43 53 C41 49 40 45 41 40 Z"/>',
      eyes(62, 70, 41), '<path stroke-width="1.7" d="M64 47 Q66.5 48.6 69 47"/>',
    ] },
    sitter: { w: 130, h: 198, svg: [
      ground(18, 120, 198),
      '<path d="M41 136 L35 197"/><path d="M71 136 L77 197"/><path d="M38 170 H74"/>',
      '<rect class="f" x="32" y="127" width="48" height="9" rx="4.5"/>',
      solid('M56 122 L89 121 L92 189'), solid('M58 127 L95 127 L98 190'),
      '<path class="k" d="M84 198 C84 192 88 189 93 189 C99 189 103 192 104 198 Z"/>',
      '<path class="k" d="M90 198 C90 192 94 190 99 190 C105 190 110 193 111 198 Z"/>',
      limb('M57 54 L57 64', 8),
      '<path class="t" d="M40 80 C40 69 47 62 57 62 C67 62 73 69 73 80 L72 122 Q72 127 67 127 L45 127 Q40 127 40 122 Z"/>',
      '<path d="M51 63 Q57 68 63 63"/>',
      '<rect class="f" x="62" y="112" width="42" height="5" rx="2.5"/>',
      limb('M102 113 L108 84', 3, 'a'),
      limb('M63 71 C65 89 71 103 84 110', 9),
      '<circle class="f" cx="58" cy="40" r="17"/>',
      '<path class="k" d="M41 43 C39 28 47 21 58 21 C69 21 76 28 75 38 C71 34 65 33 60 34 C56 36 54 40 54 46 C54 54 50 61 43 64 C41 58 40 50 41 43 Z"/>',
      eyes(63, 71, 45), smile(67, 51, 6),
    ] },
  };

  document.querySelectorAll('[data-person]').forEach((el) => {
    const p = P[el.dataset.person];
    if (p) el.innerHTML = `<svg class="pp" viewBox="0 0 ${p.w} ${p.h}" focusable="false">${p.svg.join('')}</svg>`;
  });
})();
