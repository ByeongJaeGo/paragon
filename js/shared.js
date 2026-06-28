const PROFILE_KEY = 'paragon_profile';
const WORKS_KEY = 'paragon_works';
const SAMPLE_STATUS_KEY = 'paragon_sample_status';
const CHAT_KEY = 'paragon_chats';

const ROLE_LABELS = {
  composer: '작곡',
  lyricist: '작사',
  vocalist: '가수',
};

const TYPE_LABELS = {
  midi: '미디작곡',
  lyricist: '작사',
  composer: '작곡',
};

const SAMPLE_WORKS = [
  {
    id: 'sample-composer-1',
    category: 'composer',
    uploadType: 'midi',
    isSample: true,
    title: '밤하늘 MR',
    seller: '민수작곡',
    genre: '발라드',
    price: 10000,
    bpm: 72,
    note: '잔잔한, 감성적인',
    fileName: '밤하늘_MR.wav',
    audioUrl: 'assets/sample-mr.wav',
    status: 'available',
    createdAt: '2026-05-28T09:00:00.000Z',
  },
  {
    id: 'sample-composer-2',
    category: 'composer',
    uploadType: 'midi',
    isSample: true,
    title: '새벽 라운지 MR',
    seller: '소라비트',
    genre: '재즈',
    price: 12000,
    bpm: 88,
    note: '재즈, 몽환적인',
    fileName: 'dawn_lounge_mr.wav',
    audioUrl: 'assets/sample-mr.wav',
    status: 'available',
    createdAt: '2026-05-30T14:20:00.000Z',
  },
  {
    id: 'sample-composer-3',
    category: 'composer',
    uploadType: 'midi',
    isSample: true,
    title: 'Rainy Mood MR',
    seller: '재즈키',
    genre: 'R&B',
    price: 15000,
    bpm: 64,
    note: '비 오는 날, 피아노',
    fileName: 'rainy_mood_mr.wav',
    audioUrl: 'assets/sample-mr.wav',
    status: 'available',
    createdAt: '2026-06-02T11:10:00.000Z',
  },
  {
    id: 'sample-composer-4',
    category: 'composer',
    uploadType: 'midi',
    isSample: true,
    title: 'Urban Groove MR',
    seller: '윤프로듀서',
    genre: '힙합',
    price: 10000,
    bpm: 96,
    note: '힙합, 그루브',
    fileName: 'urban_groove_mr.wav',
    audioUrl: 'assets/sample-mr.wav',
    status: 'available',
    createdAt: '2026-06-05T16:45:00.000Z',
  },
  {
    id: 'sample-composer-5',
    category: 'composer',
    uploadType: 'midi',
    isSample: true,
    title: 'Sunset Coffee MR',
    seller: '카페비트',
    genre: '인디',
    price: 8000,
    bpm: 78,
    note: '어쿠스틱, 따뜻한',
    fileName: 'sunset_coffee_mr.wav',
    audioUrl: 'assets/sample-mr.wav',
    status: 'available',
    createdAt: '2026-06-08T10:30:00.000Z',
  },
  {
    id: 'sample-lyricist-1',
    category: 'lyricist',
    uploadType: 'lyricist',
    type: 'lyricist',
    isSample: true,
    title: '별빛 아래 (가제)',
    seller: '하늘작사',
    genre: 'K-POP',
    price: 10000,
    note: '몽환적인, 따뜻한',
    lyrics: '별빛 아래 걸어가\n네 이름을 불러봐\n\n우리만의 멜로디\n영원히 끝나지 않게\n\n창가에 기대 앉아\n하얀 달을 바라보며\n너에게 전할 이 노래\n조용히 번지는 이 밤',
    hookLine: '우리만의 멜로디',
    docFileName: '별빛아래_가사.txt',
    status: 'available',
    createdAt: '2026-05-29T08:15:00.000Z',
  },
  {
    id: 'sample-lyricist-2',
    category: 'lyricist',
    uploadType: 'lyricist',
    type: 'lyricist',
    isSample: true,
    title: '첫눈 내리던 날',
    seller: '이은작사',
    genre: '발라드',
    price: 12000,
    note: '겨울, 서정적인',
    lyrics: '하얀 거리 위를 걸어\n발자국만 남긴 채\n\n첫눈이 내리던 날\n네 손을 잡았던 기억\n\n바람에 흩날리던 말\n아직도 귓가에 남아\n그날의 온기처럼\n내 마음을 데워',
    hookLine: '첫눈이 내리던 날',
    docFileName: '첫눈_가사.txt',
    status: 'available',
    createdAt: '2026-06-01T13:00:00.000Z',
  },
  {
    id: 'sample-lyricist-3',
    category: 'lyricist',
    uploadType: 'lyricist',
    type: 'lyricist',
    isSample: true,
    title: '너의 이름',
    seller: '수연가사',
    genre: '발라드',
    price: 10000,
    note: '발라드, 그리움',
    lyrics: '조용히 불러본 이름\n하루 종일 입안에 맴돌아\n\n너의 이름 한 글자마다\n내 하루가 채워져\n\n멀어진 그 자리에\n아직 네 향기가 남아\n돌아올 수 없다는 걸\n알면서도 기다려',
    hookLine: '너의 이름 한 글자마다',
    docFileName: '너의이름_가사.txt',
    status: 'available',
    createdAt: '2026-06-03T17:30:00.000Z',
  },
  {
    id: 'sample-lyricist-4',
    category: 'lyricist',
    uploadType: 'lyricist',
    type: 'lyricist',
    isSample: true,
    title: '창문 너머',
    seller: '김시인',
    genre: '인디',
    price: 15000,
    note: '인디, 잔잔한',
    lyrics: '창문 너머로 스며든 빛\n먼지처럼 춤을 춰\n\n창문 너머 세상은\n늘 나와 다른 속도로\n\n커피잔 위에 맺힌\n작은 원 하나처럼\n오늘도 나는 여기\n너를 떠올려',
    hookLine: '창문 너머 세상은',
    docFileName: '창문너머_가사.txt',
    status: 'available',
    createdAt: '2026-06-06T09:45:00.000Z',
  },
  {
    id: 'sample-lyricist-5',
    category: 'lyricist',
    uploadType: 'lyricist',
    type: 'lyricist',
    isSample: true,
    title: 'goodbye letter',
    seller: '달빛펜',
    genre: 'R&B',
    price: 8000,
    note: '영어 가사, 감성',
    lyrics: 'I wrote a letter I won\'t send\nFolded tears between the lines\n\nGoodbye letter in the drawer\nEvery word still calls your name\n\nMaybe one day you\'ll read\nWhat I never said aloud\nUntil then this quiet song\nWill be my goodbye now',
    hookLine: 'Goodbye letter in the drawer',
    docFileName: 'goodbye_letter.txt',
    status: 'available',
    createdAt: '2026-06-09T19:00:00.000Z',
  },
];

function isSellerRole(roles = []) {
  return roles.some((r) => r === 'composer' || r === 'lyricist');
}

function normalizeBankAccount(raw) {
  if (!raw?.bankName && !raw?.accountNumber && !raw?.accountHolder) return null;
  return {
    bankName: raw.bankName?.trim() || '',
    accountNumber: String(raw.accountNumber || '').replace(/\D/g, ''),
    accountHolder: raw.accountHolder?.trim() || '',
  };
}

function hasSellerAccount(profile) {
  const account = profile?.bankAccount;
  return Boolean(account?.bankName && account?.accountNumber && account?.accountHolder);
}

function formatMaskedAccount(account) {
  if (!account?.accountNumber) return '';
  const digits = account.accountNumber;
  const tail = digits.slice(-4);
  return `${account.bankName} · ${'*'.repeat(Math.max(digits.length - 4, 4))}${tail} · ${account.accountHolder}`;
}

function validateBankAccount(raw) {
  const account = normalizeBankAccount(raw);
  if (!account?.bankName) return '은행을 선택해 주세요.';
  if (!account.accountNumber || account.accountNumber.length < 10) {
    return '계좌번호를 10자리 이상 입력해 주세요.';
  }
  if (!account.accountHolder) return '예금주 이름을 입력해 주세요.';
  return null;
}

function normalizeBuyerPayment(raw) {
  if (!raw?.contact && !raw?.cardNumber && !raw?.depositorName) return null;
  return {
    payMethod: raw.payMethod || 'card',
    contact: raw.contact?.trim() || '',
    cardNumber: String(raw.cardNumber || '').replace(/\D/g, ''),
    depositorName: raw.depositorName?.trim() || '',
  };
}

function validateBuyerPayment(payment, payMethod) {
  if (!payment?.contact) return '연락처를 입력해 주세요.';
  if (payMethod === 'bank') {
    if (!payment.depositorName) return '입금자명을 입력해 주세요.';
  } else if (!payment.cardNumber || payment.cardNumber.length < 12) {
    return '카드번호를 입력해 주세요. (데모 12자리 이상)';
  }
  return null;
}

function normalizeProfile(raw) {
  if (!raw) return null;

  let profile = raw;
  if (!raw.roles?.length) {
    if (raw.role === 'buyer') profile = { ...raw, roles: ['vocalist'] };
    else if (raw.role) profile = { ...raw, roles: [raw.role] };
  }

  if (profile.bankAccount) {
    profile = { ...profile, bankAccount: normalizeBankAccount(profile.bankAccount) };
  }
  if (profile.buyerPayment) {
    profile = { ...profile, buyerPayment: normalizeBuyerPayment(profile.buyerPayment) };
  }

  return profile;
}

function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return normalizeProfile(raw ? JSON.parse(raw) : null);
  } catch {
    return null;
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function getWorks() {
  try {
    const raw = localStorage.getItem(WORKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWorks(works) {
  localStorage.setItem(WORKS_KEY, JSON.stringify(works));
}

function getSampleStatus() {
  try {
    const raw = sessionStorage.getItem(SAMPLE_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSampleStatus(status) {
  sessionStorage.setItem(SAMPLE_STATUS_KEY, JSON.stringify(status));
}

function getSampleWorks() {
  const statusMap = getSampleStatus();
  return SAMPLE_WORKS.map((work) => ({
    ...work,
    status: statusMap[work.id]?.status || work.status,
    buyer: statusMap[work.id]?.buyer || null,
    soldAt: statusMap[work.id]?.soldAt || null,
    settlement: statusMap[work.id]?.settlement || null,
  }));
}

function findWork(workId) {
  const sample = getSampleWorks().find((w) => w.id === workId);
  if (sample) return sample;
  return getWorks().find((w) => w.id === workId);
}

function getCategoryLabel(work) {
  if (work.category === 'composer' || work.uploadType === 'midi') return '작곡';
  if (work.category === 'lyricist' || work.uploadType === 'lyricist' || work.type === 'lyricist') return '작사';
  return TYPE_LABELS[work.uploadType || work.type] || work.type;
}

function isLyricWork(work) {
  return work.category === 'lyricist' || work.uploadType === 'lyricist' || work.type === 'lyricist';
}

function parseLyricsStructure(lyrics) {
  const sections = lyrics
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0);

  const flatLines = sections.flat();
  const sectionLabels = sections.map((lines, i) => {
    if (sections.length >= 3 && i === 1) return `후렴 ${lines.length}줄`;
    return `${i + 1}절 ${lines.length}줄`;
  });

  return {
    lines: flatLines,
    sections,
    totalLines: flatLines.length,
    sectionCount: sections.length,
    sectionLabels,
  };
}

function pickHookLine(work, structure) {
  if (work.hookLine?.trim()) return work.hookLine.trim();

  const { sections, lines } = structure;
  if (sections.length >= 2) return sections[1][0];
  if (lines.length >= 4) return lines[Math.floor(lines.length / 2)];
  return lines[lines.length - 1] || '';
}

function pickChorusLines(structure, maxLines = 2) {
  const { sections } = structure;
  if (sections.length >= 2) return sections[1].slice(0, maxLines);
  if (sections.length === 1 && sections[0].length > 3) {
    return sections[0].slice(Math.floor(sections[0].length / 2), Math.floor(sections[0].length / 2) + maxLines);
  }
  return [];
}

function hasFullLyricsAccess(work, profile) {
  if (!work.lyrics) return false;
  if (!profile) return false;
  if (work.seller === profile.nickname) return true;
  return work.status === 'sold' && work.buyer === profile.nickname;
}

function renderLyricsBlock(work, profile) {
  if (!work.lyrics) return '';

  if (hasFullLyricsAccess(work, profile)) {
    return `
      <div class="lyrics-full">
        <p class="lyrics-label">전체 가사</p>
        <div class="lyrics-preview">${escapeHtml(work.lyrics)}</div>
      </div>
    `;
  }

  const structure = parseLyricsStructure(work.lyrics);
  const { lines, totalLines, sectionLabels } = structure;
  const tasteLines = lines.slice(0, 2);
  const chorusLines = pickChorusLines(structure).filter((line) => !tasteLines.includes(line));
  const hookLine = pickHookLine(work, structure);
  const hookInTaste = tasteLines.includes(hookLine);
  const hookInChorus = chorusLines.includes(hookLine);
  const revealed = new Set([...tasteLines, ...chorusLines]);
  if (hookLine && !hookInTaste && !hookInChorus) revealed.add(hookLine);
  const hiddenCount = Math.max(totalLines - revealed.size, 0);
  const statsText = sectionLabels.length > 1
    ? sectionLabels.join(' · ')
    : `총 ${totalLines}줄`;

  let html = `
    <div class="lyrics-teaser">
      <div class="lyrics-teaser-head">
        <span class="lyrics-label">맛보기</span>
        <span class="lyrics-stats">${escapeHtml(statsText)}</span>
      </div>
      <p class="lyrics-notice">도입부와 후렴 일부만 공개됩니다. 전체는 구매 후 확인할 수 있어요.</p>
      <div class="lyrics-taste">${escapeHtml(tasteLines.join('\n'))}</div>
  `;

  if (chorusLines.length > 0) {
    html += `
      <div class="lyrics-chorus-tease">
        <span class="lyrics-hook-tag">후렴 미리보기</span>
        <div class="lyrics-taste">${escapeHtml(chorusLines.join('\n'))}</div>
      </div>
    `;
  }

  if (hookLine && !hookInTaste && !hookInChorus) {
    html += `
      <div class="lyrics-hook">
        <span class="lyrics-hook-tag">핵심 한 줄</span>
        <p>${escapeHtml(hookLine)}</p>
      </div>
    `;
  }

  html += `
      <div class="lyrics-vault" aria-hidden="true">
        ${Array.from({ length: Math.min(hiddenCount, 4) }, () => '<span class="lyrics-vault-bar"></span>').join('')}
        <p class="lyrics-vault-text">🔒 ${hiddenCount}줄 더 · 나머지 전개 포함</p>
      </div>
      <p class="lyrics-cta">구매하면 전체 가사${work.docFileName ? ' · 문서 파일' : ''}을 열람할 수 있습니다.</p>
    </div>
  `;

  return html;
}

function formatPrice(price) {
  return `${Number(price).toLocaleString('ko-KR')}원`;
}

function getPlatformFeeRate() {
  return typeof PARAGON_PLATFORM !== 'undefined' && PARAGON_PLATFORM.feeRate != null
    ? PARAGON_PLATFORM.feeRate
    : 0.05;
}

function getPlatformFeeLabel() {
  return `${Math.round(getPlatformFeeRate() * 100)}%`;
}

function getPlatformAccount() {
  if (typeof PARAGON_PLATFORM === 'undefined') return null;
  return normalizeBankAccount(PARAGON_PLATFORM.account);
}

function hasPlatformAccount() {
  const account = getPlatformAccount();
  return Boolean(account?.bankName && account?.accountNumber && account?.accountHolder);
}

function formatPlatformAccountDisplay() {
  const account = getPlatformAccount();
  if (!hasPlatformAccount()) return '운영 계좌 미설정 (js/platform-config.js)';
  return `${account.bankName} ${account.accountNumber} · ${account.accountHolder}`;
}

function calculatePurchaseBreakdown(price) {
  const total = Math.round(Number(price) || 0);
  const platformFee = Math.round(total * getPlatformFeeRate());
  const sellerPayout = total - platformFee;
  return {
    total,
    platformFee,
    sellerPayout,
    feeRate: getPlatformFeeRate(),
  };
}

function buildPaymentSummaryHtml(work) {
  const breakdown = calculatePurchaseBreakdown(work.price);
  const feeLabel = getPlatformFeeLabel();

  let html = `
    <div class="order-row"><span>작품</span><strong>${escapeHtml(work.title)}</strong></div>
    <div class="order-row"><span>유형</span><strong>${getCategoryLabel(work)}</strong></div>
    <div class="order-row"><span>판매자</span><strong>${escapeHtml(work.seller)}</strong></div>
    <div class="order-row"><span>작품 가격</span><strong>${formatPrice(breakdown.total)}</strong></div>
    <div class="order-row order-fee"><span>플랫폼 수수료 (${feeLabel})</span><strong>${formatPrice(breakdown.platformFee)}</strong></div>
    <div class="order-row"><span>판매자 정산</span><strong>${formatPrice(breakdown.sellerPayout)}</strong></div>
    <div class="order-row order-total"><span>결제 금액</span><strong>${formatPrice(breakdown.total)}</strong></div>
  `;

  html += `
    <p class="form-hint order-fee-note">플랫폼 수수료 ${feeLabel}(${formatPrice(breakdown.platformFee)})가 판매 대금에서 차감됩니다.</p>
  `;

  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR');
}

function getChatRoomId(workId) {
  return `chat_${workId}`;
}

function getChatMessages(workId) {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[getChatRoomId(workId)] || [];
  } catch {
    return [];
  }
}

function saveChatMessage(workId, message) {
  const raw = localStorage.getItem(CHAT_KEY);
  const all = raw ? JSON.parse(raw) : {};
  const roomId = getChatRoomId(workId);
  if (!all[roomId]) all[roomId] = [];
  all[roomId].push(message);
  localStorage.setItem(CHAT_KEY, JSON.stringify(all));
}

function completePurchase(workId, buyerName) {
  const work = findWork(workId);
  if (!work || work.status === 'sold') return false;

  const settlement = calculatePurchaseBreakdown(work.price);

  if (work.isSample) {
    const statusMap = getSampleStatus();
    statusMap[work.id] = {
      status: 'sold',
      buyer: buyerName,
      soldAt: new Date().toISOString(),
      settlement,
    };
    saveSampleStatus(statusMap);
    return settlement;
  }

  const works = getWorks();
  const target = works.find((w) => w.id === workId);
  if (!target) return false;
  target.status = 'sold';
  target.buyer = buyerName;
  target.soldAt = new Date().toISOString();
  target.settlement = settlement;
  saveWorks(works);
  return settlement;
}

function matchesWorkSearch(work, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    work.title.toLowerCase().includes(q)
    || work.seller.toLowerCase().includes(q)
  );
}
