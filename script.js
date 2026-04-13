/* ============================================================
   TypeForge — script.js
   Sections:
   1.  Keyboard Layout Data
   2.  Finger → Key Mapping
   3.  Finger → Hand SVG Parts Mapping
   4.  Word Banks & Lessons
   5.  Sound Engine  (Web Audio API, no files needed)
   6.  Build On-Screen Keyboards
   7.  Hand Animation
   8.  Keyboard Key Animation
   9.  Game State
   10. Text Generation
   11. Render Text
   12. Mode / Timer Controls
   13. Typing Input Handler
   14. Live Stats Update
   15. Show Results
   16. Heatmap
   17. Lessons
   18. Tab Switcher
   19. Notification Toast
   20. Init
============================================================ */


/* ── 1. Keyboard Layout Data ──────────────────────────────── */

const KB_LAYOUT = [
  [
    { k: '`',  f: 'L4' }, { k: '1',    f: 'L4' }, { k: '2', f: 'L3' },
    { k: '3',  f: 'L2' }, { k: '4',    f: 'L1' }, { k: '5', f: 'L1' },
    { k: '6',  f: 'R1' }, { k: '7',    f: 'R1' }, { k: '8', f: 'R2' },
    { k: '9',  f: 'R3' }, { k: '0',    f: 'R4' }, { k: '-', f: 'R4' },
    { k: '=',  f: 'R4' }, { k: '⌫',   f: 'R4', cls: 'wide' }
  ],
  [
    { k: 'Tab', f: 'L4', cls: 'wide' },
    { k: 'Q',  f: 'L4' }, { k: 'W', f: 'L3' }, { k: 'E', f: 'L2' },
    { k: 'R',  f: 'L1' }, { k: 'T', f: 'L1' }, { k: 'Y', f: 'R1' },
    { k: 'U',  f: 'R1' }, { k: 'I', f: 'R2' }, { k: 'O', f: 'R3' },
    { k: 'P',  f: 'R4' }, { k: '[', f: 'R4' }, { k: ']', f: 'R4' },
    { k: '\\', f: 'R4' }
  ],
  [
    { k: 'Caps', f: 'L4', cls: 'xwide' },
    { k: 'A', f: 'L4', h: 1 }, { k: 'S', f: 'L3', h: 1 },
    { k: 'D', f: 'L2', h: 1 }, { k: 'F', f: 'L1', h: 1 },
    { k: 'G', f: 'L1', h: 1 }, { k: 'H', f: 'R1', h: 1 },
    { k: 'J', f: 'R1', h: 1 }, { k: 'K', f: 'R2', h: 1 },
    { k: 'L', f: 'R3', h: 1 }, { k: ';', f: 'R4', h: 1 },
    { k: "'", f: 'R4' },
    { k: 'Enter', f: 'R4', cls: 'xwide' }
  ],
  [
    { k: 'Shift', f: 'L4', cls: 'xwide' },
    { k: 'Z', f: 'L4' }, { k: 'X', f: 'L3' }, { k: 'C', f: 'L2' },
    { k: 'V', f: 'L1' }, { k: 'B', f: 'L1' }, { k: 'N', f: 'R1' },
    { k: 'M', f: 'R1' }, { k: ',', f: 'R2' }, { k: '.', f: 'R3' },
    { k: '/', f: 'R4' },
    { k: 'Shift', f: 'R4', cls: 'xwide' }
  ]
];


/* ── 2. Finger → Key Mapping ──────────────────────────────── */

const KEY_FINGER = {};
KB_LAYOUT.forEach(row => {
  row.forEach(kd => {
    KEY_FINGER[kd.k.toLowerCase()] = kd.f;
    if (kd.k.length === 1) KEY_FINGER[kd.k] = kd.f;
  });
});
KEY_FINGER[' '] = 'TH';


/* ── 3. Finger → Hand SVG Parts Mapping ───────────────────── */

const FINGER_PARTS = {
  L4: { ids: ['lf-pinky-rect',  'lf-pinky-tip'],                            color: '#a855f7', name: 'Left Pinky'  },
  L3: { ids: ['lf-ring-rect',   'lf-ring-tip'],                             color: '#06b6d4', name: 'Left Ring'   },
  L2: { ids: ['lf-middle-rect', 'lf-middle-tip'],                           color: '#f59e0b', name: 'Left Middle' },
  L1: { ids: ['lf-index-rect',  'lf-index-tip'],                            color: '#22c55e', name: 'Left Index'  },
  TH: { ids: ['lf-thumb-rect',  'lf-thumb-tip', 'rf-thumb-rect', 'rf-thumb-tip'], color: '#f87171', name: 'Either Thumb' },
  R1: { ids: ['rf-index-rect',  'rf-index-tip'],                            color: '#22c55e', name: 'Right Index' },
  R2: { ids: ['rf-middle-rect', 'rf-middle-tip'],                           color: '#f59e0b', name: 'Right Middle'},
  R3: { ids: ['rf-ring-rect',   'rf-ring-tip'],                             color: '#06b6d4', name: 'Right Ring'  },
  R4: { ids: ['rf-pinky-rect',  'rf-pinky-tip'],                            color: '#a855f7', name: 'Right Pinky' }
};

const FINGER_TO_GROUP = {
  L4: ['lf-pinky'],  L3: ['lf-ring'],  L2: ['lf-middle'], L1: ['lf-index'],
  TH: ['lf-thumb', 'rf-thumb'],
  R1: ['rf-index'],  R2: ['rf-middle'], R3: ['rf-ring'],   R4: ['rf-pinky']
};

const ALL_FINGER_IDS = [
  'lf-pinky-rect', 'lf-pinky-tip',
  'lf-ring-rect',  'lf-ring-tip',
  'lf-middle-rect','lf-middle-tip',
  'lf-index-rect', 'lf-index-tip',
  'lf-thumb-rect', 'lf-thumb-tip',
  'rf-thumb-rect', 'rf-thumb-tip',
  'rf-index-rect', 'rf-index-tip',
  'rf-middle-rect','rf-middle-tip',
  'rf-ring-rect',  'rf-ring-tip',
  'rf-pinky-rect', 'rf-pinky-tip'
];


/* ── 4. Word Banks & Lessons ──────────────────────────────── */

const WORDS = {
  words: ('the be to of and a in that have it for not on with he as you do at this but his by from they we ' +
    'say her she or an will my one all would there their what so up out if about who get which go me when make ' +
    'can like time no just him know take people into year your good some could them see other than then now look ' +
    'only come its over think also back after use two how our work first well way even new want because any these ' +
    'give day most us great between need large often hand high place hold real life few north open seem together ' +
    'next white children begin got walk example ease paper group always music those both mark book letter until ' +
    'mile river car feet care second enough plain girl usual young ready above ever red list though feel talk ' +
    'bird soon body dog family direct pose leave song measure door product black short numeral class wind ' +
    'question happen complete ship area half rock order fire south problem piece told knew pass since top whole ' +
    'king space heard best hour better during hundred five remember step early hold west ground interest reach ' +
    'fast verb sing listen six table travel less morning ten simple several vowel toward war lay against pattern ' +
    'slow center love person money serve appear road map rain rule govern pull cold notice voice unit power town ' +
    'fine drive certain fly fall lead cry dark machine note wait plan figure star box noun field rest correct ' +
    'able pound done beauty stood contain front teach week final gave green quick develop ocean warm free minute ' +
    'strong special mind behind clear tail produce fact street inch multiply nothing course stay wheel full force ' +
    'blue object decide surface deep moon island foot system busy test record boat common gold possible plane dry ' +
    'wonder laugh thousand ago ran check game shape equate hot miss brought heat snow tire bring yes distant ' +
    'fill east paint language among').split(' '),

  sentences: [
    'The quick brown fox jumps over the lazy dog.',
    'Pack my box with five dozen liquor jugs.',
    'How vexingly quick daft zebras jump.',
    'The five boxing wizards jump quickly.',
    'Sphinx of black quartz, judge my vow.',
    'We promptly judged antique ivory buckles for the next prize.',
    'Six big juicy steaks sizzled in a pan as five workmen left the quarry.',
    'I quickly explained that many big jobs involve extensive work.',
    'Five or six big jet planes zoomed quickly by the tower.',
    'The public was amazed to view the quickness and dexterity of the juggler.',
    'Jaded zombies acted quaintly but kept driving their oxen forward.',
    'All questions asked by five watched experts amaze the judge.',
    'The job requires extra pluck and zeal from every young wage earner.',
    'Just keep examining every low bid quoted for zinc etchings.'
  ],

  numbers: [
    '123 456 789 ', '3.14 2.72 1.41 ', '100 200 300 400 ',
    '12 34 56 78 90 ', '2024 2025 1999 ', '99 88 77 66 55 ',
    '42 137 256 512 ', '7 14 21 28 35 42 ', '360 180 90 45 ',
    '10 20 30 40 50 60 '
  ]
};

const LESSONS = [
  { id: 'home1',  title: 'Home Row Basics',      desc: 'ASDF JKL; — the foundation',    badge: 'easy',   text: 'asdf jkl; asdf jkl; fff jjj ddd kkk sss lll aaa ;;; asdf jkl; dad all fall flask ask flak dads falls add flask salad ask lads lass all' },
  { id: 'home2',  title: 'Home Row Words',        desc: 'Real words, home keys only',    badge: 'easy',   text: 'all ask dad fall flask hall jade lass fall glad hall asks jell fall hall lass jell glad ask falls lads salad flash flask all hall jade flag' },
  { id: 'ef',     title: 'Add E and T',           desc: 'Extend from home row',          badge: 'easy',   text: 'fed def led elf felt self shelf help desk feel seed flee else self seek feel self desk elf felt shelf help edge felt seed feel' },
  { id: 'reach',  title: 'Top Row Q W E R T',    desc: 'Reach up to top row',           badge: 'medium', text: 'quit were type your pour trip wire prior quite tower upper power type your wire quite tower upper power type pour' },
  { id: 'bottom', title: 'Bottom Row Z X C V',   desc: 'Reach down to bottom row',      badge: 'medium', text: 'zap can vim box cab min zinc calm cabin zing bang name vim box cab zinc calm cabin zing bang can vim box' },
  { id: 'caps',   title: 'Capital Letters',       desc: 'Practice the Shift key',        badge: 'medium', text: 'The Quick Brown Fox The Fast Car Jump High The Big Red Apple Now The Long Day Ends The Sun Sets The Quick Brown Fox' },
  { id: 'punct',  title: 'Punctuation',           desc: 'Commas, periods, apostrophes',  badge: 'hard',   text: "Hello, world. How are you? Fine, thanks! Wait; is that right? Yes, it is. Good morning, everyone. See you soon. Goodbye, friend." },
  { id: 'nums',   title: 'Number Row',            desc: '1 2 3 4 5 6 7 8 9 0',          badge: 'hard',   text: '123 456 789 012 345 678 901 234 567 890 12 34 56 78 90 11 22 33 44 55 66 77 88 99' },
  { id: 'speed1', title: 'Speed Builder I',       desc: 'Fast common short words',       badge: 'easy',   text: 'the and for are but not you all can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use' },
  { id: 'speed2', title: 'Speed Builder II',      desc: 'Medium length words',           badge: 'medium', text: 'about after again against along among asked being below bring built close could doing every given going house large light local might other place point right small sound still taken their those three until where which while would young' },
  { id: 'adv1',   title: 'Advanced Vocabulary',   desc: 'Long complex words',            badge: 'hard',   text: 'information environment development management communication technology organization relationship responsibility opportunity comfortable understanding' },
  { id: 'prog1',  title: 'Programming Keys',      desc: 'Brackets, braces and symbols',  badge: 'hard',   text: 'if (x > 0) { return true; } else { return false; } function main() { let x = 10; } for (let i = 0; i < 10; i++) { console.log(i); }' }
];


/* ── 5. Sound Engine ──────────────────────────────────────── */

let audioCtx     = null;
let soundEnabled = true;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/** Soft click for correct keypress */
function playCorrect() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

/** Harsh buzz for wrong keypress */
function playError() {
  if (!soundEnabled) return;
  try {
    const ctx  = getAudio();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const dist = ctx.createWaveShaper();
    // Build distortion curve
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = x * (Math.abs(x) > 0.5 ? 3 : 1);
    }
    dist.curve = curve;
    osc.connect(dist);
    dist.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {}
}

/** Ascending chime for test completion */
function playFinish() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudio();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch (e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-btn');
  btn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Sound';
  btn.classList.toggle('on', soundEnabled);
}


/* ── 6. Build On-Screen Keyboards ─────────────────────────── */

function buildKeyboard(prefix) {
  KB_LAYOUT.forEach((row, ri) => {
    const rowEl = document.getElementById(`${prefix}-row-${ri + 1}`);
    rowEl.innerHTML = '';

    row.forEach(kd => {
      const div = document.createElement('div');
      let cls = 'key';
      if (kd.cls) cls += ' ' + kd.cls;
      if (kd.h)   cls += ' home-row';
      div.className    = cls;
      div.dataset.key  = kd.k.toLowerCase();
      div.dataset.f    = kd.f;
      div.textContent  = kd.k;
      rowEl.appendChild(div);
    });

    // Space bar on last row
    if (ri === 3) {
      const sp = document.createElement('div');
      sp.className   = 'key space-key';
      sp.dataset.key = ' ';
      sp.dataset.f   = 'TH';
      sp.textContent = 'Space';
      rowEl.appendChild(sp);
    }
  });
}

buildKeyboard('kb');
buildKeyboard('hm');


/* ── 7. Hand Animation ────────────────────────────────────── */

/** Remove all finger highlights and press transforms */
function resetAllFingers() {
  ALL_FINGER_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.fill   = '';
    el.style.filter = '';
    el.style.transition = 'fill 0.2s, filter 0.2s';
  });

  Object.keys(FINGER_TO_GROUP).forEach(code => {
    FINGER_TO_GROUP[code].forEach(gid => {
      const g = document.getElementById(gid);
      if (g) { g.style.transform = ''; g.style.transition = 'transform 0.15s'; }
    });
  });
}

/**
 * Highlight the correct finger on the SVG hands.
 * @param {string} fingerCode - e.g. 'L4', 'R1', 'TH'
 * @param {boolean} isPress   - true = also animate a press-down
 */
function highlightFinger(fingerCode, isPress) {
  if (!fingerCode) { resetAllFingers(); return; }

  const info = FINGER_PARTS[fingerCode];
  if (!info) return;

  resetAllFingers();

  // Colour the relevant SVG rects
  info.ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.fill   = info.color;
    el.style.filter = `drop-shadow(0 0 6px ${info.color})`;
  });

  // Press-down animation on the finger group
  if (isPress) {
    (FINGER_TO_GROUP[fingerCode] || []).forEach(gid => {
      const g = document.getElementById(gid);
      if (!g) return;
      g.style.transition = 'transform 0.07s';
      g.style.transform  = 'scaleY(0.84)';
      setTimeout(() => {
        if (g) { g.style.transition = 'transform 0.12s'; g.style.transform = ''; }
      }, 100);
    });
  }

  // Update the hint text below the hands
  const nextChar = currentText[currentIndex] || '';
  const display  = nextChar === ' ' ? 'Space' : nextChar ? `"${nextChar}"` : '';
  const hintEl   = document.getElementById('key-hint');
  if (hintEl) {
    hintEl.innerHTML = display
      ? `Press <strong>${display}</strong> using your <strong style="color:${info.color}">${info.name}</strong>`
      : '';
  }
}

/** Show finger preview for the *next* character to type */
function previewNextFinger() {
  if (!currentText || currentIndex >= currentText.length) {
    resetAllFingers();
    return;
  }
  const ch    = currentText[currentIndex];
  const fcode = KEY_FINGER[ch] || KEY_FINGER[ch.toLowerCase()];
  if (fcode) highlightFinger(fcode, false);
}


/* ── 8. Keyboard Key Animation ────────────────────────────── */

function activateKey(ch, isError) {
  deactivateAllKeys();
  const lookup = ch === ' ' ? ' ' : ch.toLowerCase();
  const keyEl  = document.querySelector(
    `#kb-row-1 .key[data-key="${lookup}"],` +
    `#kb-row-2 .key[data-key="${lookup}"],` +
    `#kb-row-3 .key[data-key="${lookup}"],` +
    `#kb-row-4 .key[data-key="${lookup}"]`
  );
  if (!keyEl) return;
  keyEl.classList.add('active');
  if (isError) {
    keyEl.classList.add('err-flash');
    setTimeout(() => keyEl.classList.remove('err-flash'), 280);
  }
}

function deactivateAllKeys() {
  document.querySelectorAll('.kb-row .key').forEach(k => k.classList.remove('active'));
}


/* ── 9. Game State ────────────────────────────────────────── */

let mode          = 'words';
let timerDuration = 30;
let timeLeft      = 30;
let timerInterval = null;
let started       = false;
let finished      = false;
let currentText   = '';
let currentIndex  = 0;
let errors        = 0;
let totalErrors   = 0;
let correctChars  = 0;
let startTime     = null;
let streak        = 0;
let bestStreak    = 0;
let keyPresses    = {};
let keyErrors     = {};
let selectedLesson = null;
let prevText       = '';


/* ── 10. Text Generation ──────────────────────────────────── */

function getWords(m) {
  // Lesson mode
  if (m === 'lesson' && selectedLesson) return selectedLesson.text;

  // Sentence mode — concatenate random sentences until >= 220 chars
  if (m === 'sentences') {
    const pool = WORDS.sentences;
    let result = '';
    while (result.length < 220) {
      result += pool[Math.floor(Math.random() * pool.length)] + ' ';
    }
    return result.trim();
  }

  // Number mode
  if (m === 'numbers') {
    const pool = WORDS.numbers;
    let result = '';
    for (let i = 0; i < 10; i++) result += pool[Math.floor(Math.random() * pool.length)];
    return result.trim();
  }

  // Default: random word pool
  const pool = WORDS.words;
  const out  = [];
  for (let i = 0; i < 70; i++) out.push(pool[Math.floor(Math.random() * pool.length)]);
  return out.join(' ');
}


/* ── 11. Render Text ──────────────────────────────────────── */

function renderText() {
  const display = document.getElementById('text-display');
  display.innerHTML = '';
  [...currentText].forEach((ch, i) => {
    const span       = document.createElement('span');
    span.className   = 'char pending' + (i === 0 ? ' cursor' : '');
    span.dataset.i   = i;
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    display.appendChild(span);
  });
}


/* ── 12. Mode / Timer Controls ────────────────────────────── */

function setMode(m, btn) {
  mode = m;
  document.querySelectorAll('#btn-words, #btn-sentences, #btn-numbers')
    .forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  restartTest();
}

function setTimer(t, btn) {
  timerDuration = t;
  document.querySelectorAll('#btn-t30, #btn-t60, #btn-t120, #btn-tinf')
    .forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  restartTest();
}

function focusInput() {
  document.getElementById('typing-input').focus();
}

/** Shared reset logic */
function _resetState(text) {
  clearInterval(timerInterval);
  started      = false;
  finished     = false;
  currentIndex = 0;
  errors       = 0;
  totalErrors  = 0;
  correctChars = 0;
  startTime    = null;
  streak       = 0;
  bestStreak   = 0;
  timeLeft     = timerDuration || 30;
  currentText  = text;

  renderText();

  document.getElementById('s-wpm').textContent    = '0';
  document.getElementById('s-acc').textContent    = '100%';
  document.getElementById('s-streak').textContent = '0';
  document.getElementById('s-raw').textContent    = '0';
  document.getElementById('timer-val').textContent = timerDuration === 0 ? '∞' : timerDuration;
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('results-panel').classList.remove('show');
  document.getElementById('typing-input').value = '';
  document.getElementById('status-msg').textContent = 'Click the text area or press any key to start';

  deactivateAllKeys();
  resetAllFingers();
  previewNextFinger();
  focusInput();
}

function restartTest() {
  const text = getWords(mode);
  prevText   = text;
  _resetState(text);
}

function restartSame() {
  _resetState(prevText);
}


/* ── 13. Typing Input Handler ─────────────────────────────── */

document.getElementById('typing-input').addEventListener('keydown', function (e) {
  if (finished) return;

  // Global shortcuts
  if (e.key === 'Escape') { restartTest(); return; }
  if (e.key === 'Tab')    { e.preventDefault(); restartTest(); return; }

  // Ignore modifier-only keys
  if (e.key.length !== 1 && e.key !== 'Backspace') return;
  e.preventDefault();

  // Warm up AudioContext on first interaction (browser requirement)
  try { getAudio(); } catch (err) {}

  const expected = currentText[currentIndex];

  /* ── Backspace ── */
  if (e.key === 'Backspace') {
    if (currentIndex === 0) return;
    currentIndex--;
    const chars = document.querySelectorAll('.char');
    chars[currentIndex].className = 'char cursor';
    if (chars[currentIndex + 1]) chars[currentIndex + 1].classList.remove('cursor');
    streak = 0;
    previewNextFinger();
    return;
  }

  if (!expected) return;

  /* ── Start timer on first real key ── */
  if (!started) {
    started   = true;
    startTime = Date.now();
    document.getElementById('status-msg').textContent = 'Typing in progress...';

    if (timerDuration > 0) {
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-val').textContent = timeLeft;
        updateLiveStats();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          finished = true;
          showResults();
        }
      }, 1000);
    }
  }

  /* ── Score the keypress ── */
  const lk        = e.key.toLowerCase();
  const isCorrect = (e.key === expected) || (e.key === ' ' && expected === ' ');
  const chars     = document.querySelectorAll('.char');

  keyPresses[lk] = (keyPresses[lk] || 0) + 1;

  if (isCorrect) {
    chars[currentIndex].className = 'char correct';
    correctChars++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    activateKey(e.key, false);
    highlightFinger(KEY_FINGER[e.key] || KEY_FINGER[lk], true);
    playCorrect();
  } else {
    chars[currentIndex].className = 'char wrong';
    errors++;
    totalErrors++;
    streak = 0;
    keyErrors[lk] = (keyErrors[lk] || 0) + 1;
    activateKey(expected, true);
    highlightFinger(KEY_FINGER[expected] || KEY_FINGER[expected.toLowerCase()], true);
    playError();
  }

  /* ── Advance cursor ── */
  currentIndex++;
  if (currentIndex < chars.length) {
    chars[currentIndex].classList.add('cursor');
    setTimeout(previewNextFinger, 80);
  }

  /* ── Progress bar ── */
  const pct = Math.min((currentIndex / currentText.length) * 100, 100);
  document.getElementById('progress-fill').style.width = pct + '%';

  updateLiveStats();

  /* ── End of text ── */
  if (currentIndex >= currentText.length) {
    clearInterval(timerInterval);
    finished = true;
    playFinish();
    showResults();
  }
});


/* ── 14. Live Stats Update ────────────────────────────────── */

function updateLiveStats() {
  if (!startTime) return;
  const elMin  = (Date.now() - startTime) / 1000 / 60;
  const wpm    = elMin > 0 ? Math.round(correctChars / 5 / elMin) : 0;
  const rawWpm = elMin > 0 ? Math.round((correctChars + errors) / 5 / elMin) : 0;
  const total  = correctChars + totalErrors;
  const acc    = total > 0 ? Math.round((correctChars / total) * 100) : 100;

  document.getElementById('s-wpm').textContent    = wpm;
  document.getElementById('s-acc').textContent    = acc + '%';
  document.getElementById('s-streak').textContent = bestStreak;
  document.getElementById('s-raw').textContent    = rawWpm;
}


/* ── 15. Show Results ─────────────────────────────────────── */

function showResults() {
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 1;
  const elMin   = elapsed / 60;
  const wpm     = elMin > 0 ? Math.round(correctChars / 5 / elMin) : 0;
  const rawWpm  = elMin > 0 ? Math.round((correctChars + totalErrors) / 5 / elMin) : 0;
  const total   = correctChars + totalErrors;
  const acc     = total > 0 ? Math.round((correctChars / total) * 100) : 100;

  document.getElementById('r-wpm').textContent   = wpm;
  document.getElementById('r-acc').textContent   = acc + '%';
  document.getElementById('r-raw').textContent   = rawWpm;
  document.getElementById('r-errs').textContent  = totalErrors;
  document.getElementById('r-time').textContent  = Math.round(elapsed) + 's';
  document.getElementById('r-chars').textContent = correctChars + totalErrors;
  document.getElementById('r-streak').textContent = bestStreak;

  document.getElementById('results-panel').classList.add('show');
  document.getElementById('typing-input').blur();

  resetAllFingers();
  deactivateAllKeys();
  updateHeatmap();
}


/* ── 16. Heatmap ──────────────────────────────────────────── */

function updateHeatmap() {
  const totalPresses = Math.max(Object.values(keyPresses).reduce((a, b) => a + b, 0), 1);

  ['hm-row-1','hm-row-2','hm-row-3','hm-row-4'].forEach(rowId => {
    document.querySelectorAll(`#${rowId} .key`).forEach(k => {
      const key     = k.dataset.key;
      const presses = keyPresses[key] || 0;
      const errs    = keyErrors[key]  || 0;
      const errRate = presses > 0 ? errs / presses : 0;

      k.classList.remove('heat1', 'heat2', 'heat3', 'heat-err');
      k.style.background   = '';
      k.style.borderColor  = '';

      if (errRate > 0.25 && presses > 2) {
        k.classList.add('heat-err');
      } else {
        const pct = presses / totalPresses;
        if      (pct > 0.08) k.classList.add('heat3');
        else if (pct > 0.03) k.classList.add('heat2');
        else if (pct > 0)    k.classList.add('heat1');
      }
    });
  });

  // Error chips
  const errList = document.getElementById('error-keys-list');
  errList.innerHTML = '';
  Object.keys(keyErrors)
    .sort((a, b) => keyErrors[b] - keyErrors[a])
    .slice(0, 10)
    .forEach(k => {
      const chip = document.createElement('div');
      chip.className   = 'error-key-chip';
      chip.textContent = `${k === ' ' ? 'Space' : k.toUpperCase()} — ${keyErrors[k]} errors`;
      errList.appendChild(chip);
    });
}


/* ── 17. Lessons ──────────────────────────────────────────── */

function buildLessons() {
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML = '';

  LESSONS.forEach(lesson => {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.innerHTML = `
      <div class="lesson-badge badge-${lesson.badge}">${lesson.badge}</div>
      <h3>${lesson.title}</h3>
      <p>${lesson.desc}</p>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.lesson-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedLesson = lesson;
    });
    grid.appendChild(card);
  });
}

function startLesson() {
  if (!selectedLesson) { showNotif('Select a lesson first!'); return; }
  mode = 'lesson';
  switchTab('practice');
  restartTest();
}


/* ── 18. Tab Switcher ─────────────────────────────────────── */

function switchTab(tab) {
  const tabs = ['practice', 'lessons', 'heatmap'];

  tabs.forEach(t => {
    document.getElementById(`tab-${t}`).style.display = t === tab ? 'block' : 'none';
  });

  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', tabs[i] === tab);
  });

  if (tab === 'heatmap') updateHeatmap();
}


/* ── 19. Notification Toast ───────────────────────────────── */

function showNotif(msg) {
  const notif = document.getElementById('notif');
  notif.textContent = msg;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2400);
}


/* ── 20. Init ─────────────────────────────────────────────── */

buildLessons();
restartTest();
