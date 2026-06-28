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
    id: 'sample-composer',
    category: 'composer',
    uploadType: 'midi',
    isSample: true,
    title: '밤하늘 MR',
    seller: '민수작곡',
    price: 10000,
    bpm: 72,
    note: '잔잔한, 감성적인',
    fileName: 'sample-mr.wav',
    audioUrl: 'assets/sample-mr.wav',
    status: 'available',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'sample-lyricist',
    category: 'lyricist',
    uploadType: 'lyricist',
    type: 'lyricist',
    isSample: true,
    title: '별빛 아래 (가제)',
    seller: '하늘작사',
    price: 10000,
    note: '몽환적인, 따뜻한',
    lyrics: '별빛 아래 걸어가\n네 이름을 불러봐\n\n우리만의 멜로디\n영원히 끝나지 않게\n\n창가에 기대 앉아\n하얀 달을 바라보며\n너에게 전할 이 노래\n조용히 번지는 이 밤',
    hookLine: '우리만의 멜로디',
    docFileName: '별빛아래_가사.txt',
    status: 'available',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
];

function normalizeProfile(raw) {
  if (!raw) return null;
  if (raw.roles?.length) return raw;
  if (raw.role === 'buyer') return { ...raw, roles: ['vocalist'] };
  if (raw.role) return { ...raw, roles: [raw.role] };
  return raw;
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
  const hookLine = pickHookLine(work, structure);
  const hookInTaste = tasteLines.includes(hookLine);
  const hiddenCount = Math.max(totalLines - tasteLines.length - (hookInTaste ? 0 : 1), 0);
  const statsText = sectionLabels.length > 1
    ? sectionLabels.join(' · ')
    : `총 ${totalLines}줄`;

  let html = `
    <div class="lyrics-teaser">
      <div class="lyrics-teaser-head">
        <span class="lyrics-label">맛보기</span>
        <span class="lyrics-stats">${escapeHtml(statsText)}</span>
      </div>
      <p class="lyrics-notice">도입부만 공개됩니다. 핵심과 후렴은 구매 후 확인할 수 있어요.</p>
      <div class="lyrics-taste">${escapeHtml(tasteLines.join('\n'))}</div>
  `;

  if (hookLine && !hookInTaste) {
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
        <p class="lyrics-vault-text">🔒 ${hiddenCount}줄 더 · 후렴·전개 포함</p>
      </div>
      <p class="lyrics-cta">구매하면 전체 가사${work.docFileName ? ' · 문서 파일' : ''}을 열람할 수 있습니다.</p>
    </div>
  `;

  return html;
}

function formatPrice(price) {
  return `${Number(price).toLocaleString('ko-KR')}원`;
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

  if (work.isSample) {
    const statusMap = getSampleStatus();
    statusMap[work.id] = { status: 'sold', buyer: buyerName };
    saveSampleStatus(statusMap);
    return true;
  }

  const works = getWorks();
  const target = works.find((w) => w.id === workId);
  if (!target) return false;
  target.status = 'sold';
  target.buyer = buyerName;
  target.soldAt = new Date().toISOString();
  saveWorks(works);
  return true;
}

function matchesWorkSearch(work, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    work.title.toLowerCase().includes(q)
    || work.seller.toLowerCase().includes(q)
  );
}
