const UPLOAD_TYPES = {
  midi: { label: '미디작곡', title: 'midiTitle', file: 'midiFile', category: 'composer' },
  lyricist: { label: '작사', title: 'lyricistTitle', doc: 'lyricistDoc', category: 'lyricist' },
};

const profileBtn = document.getElementById('profileBtn');
const profileBtnHero = document.getElementById('profileBtnHero');
const uploadBtn = document.getElementById('uploadBtn');
const uploadBtnHero = document.getElementById('uploadBtnHero');
const profileModal = document.getElementById('profileModal');
const profileModalClose = document.getElementById('profileModalClose');
const profileForm = document.getElementById('profileForm');
const uploadModal = document.getElementById('uploadModal');
const uploadModalClose = document.getElementById('uploadModalClose');
const uploadForm = document.getElementById('uploadForm');
const marketExamples = document.getElementById('marketExamples');
const marketCount = document.getElementById('marketCount');
const marketSearch = document.getElementById('marketSearch');
const mySection = document.getElementById('mySection');
const mySectionTitle = document.getElementById('mySectionTitle');
const myGrid = document.getElementById('myGrid');
const profileAlert = document.getElementById('profileAlert');
const profileAlertBtn = document.getElementById('profileAlertBtn');
const workDetailModal = document.getElementById('workDetailModal');
const workDetailClose = document.getElementById('workDetailClose');
const workDetailContent = document.getElementById('workDetailContent');

let pendingUpload = false;
let activeDetailWork = null;

function showToast(message, type = 'default') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  if (type === 'profile') {
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">!</span>
      <div class="toast-body">
        <strong>${message}</strong>
        <p>아래 배너 또는 프로필 버튼을 눌러 시작하세요.</p>
      </div>
    `;
  } else {
    toast.textContent = message;
  }

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const duration = type === 'profile' ? 5500 : 3000;
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function showProfileNotice() {
  const alert = document.getElementById('profileAlert');
  if (!alert) return;

  alert.hidden = false;
  alert.classList.add('profile-alert-pulse');
  alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('먼저 프로필을 만들어 주세요.', 'profile');

  setTimeout(() => {
    alert.classList.remove('profile-alert-pulse');
  }, 2400);
}

function hasProfile() {
  const profile = getProfile();
  return Boolean(profile?.nickname && profile?.genre && profile?.roles?.length);
}

function isSeller(roles) {
  return isSellerRole(roles);
}

function getSelectedRoles() {
  return Array.from(profileForm.querySelectorAll('input[name="role"]:checked')).map((input) => input.value);
}

function getRolesLabel(roles) {
  return roles.map((r) => ROLE_LABELS[r]).join(', ');
}

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openProfileModal() {
  const profile = getProfile();
  profileForm.reset();
  if (profile) {
    profileForm.nickname.value = profile.nickname;
    profileForm.genre.value = profile.genre;
    profileForm.querySelectorAll('input[name="role"]').forEach((input) => {
      input.checked = profile.roles.includes(input.value);
    });
  }
  openModal(profileModal);
}

function closeProfileModal(clearPending = true) {
  closeModal(profileModal);
  if (clearPending) pendingUpload = false;
}

function switchUploadPanel(type) {
  uploadForm.querySelectorAll('.upload-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.panel !== type);
  });

  const midiActive = type === 'midi';
  const lyricActive = type === 'lyricist';

  uploadForm.midiTitle.required = midiActive;
  uploadForm.midiFile.required = midiActive;
  uploadForm.lyricistTitle.required = lyricActive;
  uploadForm.lyricistDoc.required = lyricActive;
}

function resetUploadForm() {
  uploadForm.reset();
  uploadForm.querySelectorAll('[data-file-name]').forEach((el) => {
    el.textContent = '';
  });

  uploadForm.querySelectorAll('input[name="uploadType"]').forEach((input) => {
    input.disabled = false;
    input.closest('.upload-type-option')?.classList.remove('hidden');
  });

  uploadForm.querySelector('input[name="uploadType"][value="midi"]').checked = true;
  switchUploadPanel('midi');
  fillUploadAccountFields(getProfile());
}

function fillUploadAccountFields(profile) {
  if (!uploadForm.uploadBankName) return;
  uploadForm.uploadBankName.value = profile?.bankAccount?.bankName || '';
  uploadForm.uploadAccountNumber.value = profile?.bankAccount?.accountNumber || '';
  uploadForm.uploadAccountHolder.value = profile?.bankAccount?.accountHolder || '';
}

function openUploadModal() {
  if (!hasProfile()) {
    pendingUpload = true;
    showProfileNotice();
    openProfileModal();
    return;
  }

  resetUploadForm();
  openModal(uploadModal);
}

function closeUploadModal() {
  closeModal(uploadModal);
  resetUploadForm();
}

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'UTF-8');
  });
}

function createWorkCard(work, mode) {
  const profile = getProfile();
  const card = document.createElement('article');
  const isSold = work.status === 'sold';
  const showActions = mode === 'market' && !isSold;

  card.className = `work-card${isSold ? ' sold' : ''}${work.isSample ? ' sample' : ''}`;

  let body = '<div class="card-body">';
  body += `
    <div class="card-top">
      <span class="type">${getCategoryLabel(work)}</span>
      ${work.isSample && mode !== 'market' ? '<span class="badge sample-badge">예시</span>' : ''}
      ${isSold ? '<span class="badge sold-badge">판매 완료</span>' : '<span class="badge on-sale">판매 중</span>'}
    </div>
    <h3>${escapeHtml(work.title)}</h3>
    <p class="price">${formatPrice(work.price)}</p>
    <div class="card-info">
    <p class="meta">판매자 · ${escapeHtml(work.seller)}</p>
    ${work.bpm ? `<p class="meta">BPM ${work.bpm}</p>` : ''}
    ${work.note ? `<p class="meta note">분위기 · ${escapeHtml(work.note)}</p>` : ''}
    </div>
  `;

  body += '<div class="card-preview-area">';

  if (work.audioUrl) {
    body += `
      <div class="audio-preview">
        <p class="meta">MR 미리듣기 · ${escapeHtml(work.fileName || 'sample-mr.wav')}</p>
        <audio controls preload="none" src="${escapeHtml(work.audioUrl)}"></audio>
      </div>
    `;
  } else if (work.fileName) {
    body += `<p class="meta">파일 · ${escapeHtml(work.fileName)}</p>`;
  }

  if (work.docFileName) {
    body += `<p class="meta">문서 · ${escapeHtml(work.docFileName)}</p>`;
  }

  if (work.lyrics) {
    body += renderLyricsBlock(work, profile);
  }

  body += '</div>';

  if (isSold && work.buyer) {
    body += `<p class="meta buyer-info">구매자 · ${escapeHtml(work.buyer)}</p>`;
  }

  if (isSold && work.settlement && profile?.nickname === work.seller) {
    body += `<p class="meta settlement-info">정산 · ${formatPrice(work.settlement.sellerPayout)} (수수료 ${formatPrice(work.settlement.platformFee)})</p>`;
  }

  body += `<p class="date">${formatDate(work.createdAt)}</p>`;

  if (showActions) {
    body += `
      <div class="card-actions">
        <button type="button" class="btn btn-primary buy-btn" data-id="${work.id}">구매하기</button>
        <button type="button" class="btn btn-outline inquiry-btn" data-id="${work.id}">문의하기</button>
      </div>
    `;
  }

  body += '</div>';

  if (isSold) {
    body += '<div class="sold-overlay" aria-hidden="true"><span>판매 완료</span></div>';
  }

  card.innerHTML = body;

  if (mode === 'mine') {
    card.classList.add('work-card-clickable');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${work.title} 상세 보기`);
    card.addEventListener('click', (e) => {
      if (e.target.closest('button, a, audio, input, textarea, select')) return;
      openWorkDetailModal(work);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openWorkDetailModal(work);
      }
    });
  }

  return card;
}

function bindCardActions(container) {
  container.querySelectorAll('.buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => goToPayment(btn.dataset.id));
  });
  container.querySelectorAll('.inquiry-btn').forEach((btn) => {
    btn.addEventListener('click', () => goToChat(btn.dataset.id));
  });
}

function goToPayment(workId) {
  const work = findWork(workId);
  if (!work || work.status === 'sold') return;

  const profile = getProfile();
  if (profile && work.seller === profile.nickname) {
    showToast('본인 작품은 구매할 수 없습니다.');
    return;
  }

  window.location.href = `payment.html?workId=${encodeURIComponent(workId)}`;
}

function goToChat(workId) {
  const work = findWork(workId);
  if (!work) return;

  if (!hasProfile()) {
    showProfileNotice();
    openProfileModal();
    return;
  }

  window.location.href = `chat.html?workId=${encodeURIComponent(workId)}`;
}

function sortWorksByLatest(works) {
  return works.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

const RANKING_PREVIEW_SECONDS = 30;
let rankingPreviewAudio = null;
let rankingPreviewTimer = null;
let activeRankingPreviewBtn = null;

function getWorkPreviewUrl(work) {
  if (work.audioUrl) return work.audioUrl;
  if (work.category === 'composer') return 'assets/sample-mr.wav';
  return null;
}

function stopRankingPreview() {
  if (rankingPreviewTimer) {
    clearTimeout(rankingPreviewTimer);
    rankingPreviewTimer = null;
  }
  if (rankingPreviewAudio) {
    rankingPreviewAudio.pause();
    rankingPreviewAudio.currentTime = 0;
    rankingPreviewAudio.onended = null;
  }
  if (activeRankingPreviewBtn) {
    activeRankingPreviewBtn.classList.remove('playing');
    activeRankingPreviewBtn.textContent = activeRankingPreviewBtn.dataset.previewLabel || '30초';
    activeRankingPreviewBtn.setAttribute('aria-label', '30초 미리듣기');
    activeRankingPreviewBtn = null;
  }
}

function playRankingPreview(work, btn) {
  const url = getWorkPreviewUrl(work);
  if (!url) {
    alert('미리듣기 파일이 없습니다.');
    return;
  }

  if (activeRankingPreviewBtn === btn) {
    stopRankingPreview();
    return;
  }

  stopRankingPreview();

  if (!btn.dataset.previewLabel) {
    btn.dataset.previewLabel = btn.textContent.trim();
  }

  rankingPreviewAudio = rankingPreviewAudio || new Audio();
  rankingPreviewAudio.src = url;
  rankingPreviewAudio.currentTime = 0;
  activeRankingPreviewBtn = btn;
  btn.classList.add('playing');
  btn.textContent = '■';
  btn.setAttribute('aria-label', '미리듣기 정지');

  rankingPreviewAudio.onended = () => stopRankingPreview();
  rankingPreviewAudio.play().catch(() => {
    alert('미리듣기를 재생할 수 없습니다.');
    stopRankingPreview();
  });

  rankingPreviewTimer = setTimeout(stopRankingPreview, RANKING_PREVIEW_SECONDS * 1000);
}

function buildWorkDetailHtml(work) {
  const profile = getProfile();
  const isSold = work.status === 'sold';
  const isOwn = profile?.nickname === work.seller;

  let html = `
    <p class="page-tag">${escapeHtml(getCategoryLabel(work))}</p>
    <h2 class="modal-title" id="workDetailTitle">${escapeHtml(work.title)}</h2>
    <div class="work-detail-meta">
      <span class="badge ${isSold ? 'sold-badge' : 'on-sale'}">${isSold ? '판매 완료' : '판매 중'}</span>
      ${work.isSample ? '<span class="badge sample-badge">예시</span>' : ''}
    </div>
    <dl class="work-detail-list">
      <div><dt>판매자</dt><dd>${escapeHtml(work.seller)}</dd></div>
      ${work.genre ? `<div><dt>장르</dt><dd>${escapeHtml(work.genre)}</dd></div>` : ''}
      <div><dt>가격</dt><dd>${formatPrice(work.price)}</dd></div>
      ${work.bpm ? `<div><dt>BPM</dt><dd>${work.bpm}</dd></div>` : ''}
      ${work.note ? `<div><dt>분위기</dt><dd>${escapeHtml(work.note)}</dd></div>` : ''}
      ${work.fileName ? `<div><dt>파일</dt><dd>${escapeHtml(work.fileName)}</dd></div>` : ''}
      ${work.docFileName ? `<div><dt>문서</dt><dd>${escapeHtml(work.docFileName)}</dd></div>` : ''}
      <div><dt>등록일</dt><dd>${formatDate(work.createdAt)}</dd></div>
      ${isSold && work.buyer ? `<div><dt>구매자</dt><dd>${escapeHtml(work.buyer)}</dd></div>` : ''}
      ${isSold && work.settlement && isOwn
        ? `<div><dt>정산</dt><dd>${formatPrice(work.settlement.sellerPayout)} (수수료 ${formatPrice(work.settlement.platformFee)})</dd></div>`
        : ''}
    </dl>
  `;

  if (work.category === 'composer' && getWorkPreviewUrl(work)) {
    html += '<button type="button" class="btn btn-outline btn-full" id="workDetailPreviewBtn">30초 미리듣기</button>';
  }

  if (work.lyrics) {
    html += `<div class="work-detail-lyrics">${renderLyricsBlock(work, profile)}</div>`;
  }

  if (work.isSample) {
    html += '<p class="form-hint work-detail-note">테스트용 예시 작품입니다. 실제 구매·다운로드는 되지 않습니다.</p>';
  } else if (!isSold && !isOwn) {
    html += `
      <div class="work-detail-actions">
        <button type="button" class="btn btn-primary btn-full" id="workDetailBuyBtn">구매하기</button>
        <button type="button" class="btn btn-outline btn-full" id="workDetailChatBtn">문의하기</button>
      </div>
    `;
  } else if (isOwn) {
    html += '<p class="form-hint work-detail-note">내가 등록한 작품입니다.</p>';
  }

  return html;
}

function bindWorkDetailActions(work) {
  workDetailContent.querySelector('#workDetailPreviewBtn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    playRankingPreview(work, btn);
  });

  workDetailContent.querySelector('#workDetailBuyBtn')?.addEventListener('click', () => {
    if (work.isSample) {
      alert('테스트용 예시 작품입니다.\n실제 구매·다운로드는 되지 않습니다.');
      return;
    }
    closeWorkDetailModal();
    goToPayment(work.id);
  });

  workDetailContent.querySelector('#workDetailChatBtn')?.addEventListener('click', () => {
    closeWorkDetailModal();
    goToChat(work.id);
  });
}

function openWorkDetailModal(work) {
  if (!workDetailModal || !workDetailContent) return;
  activeDetailWork = work;
  workDetailContent.innerHTML = buildWorkDetailHtml(work);
  bindWorkDetailActions(work);
  openModal(workDetailModal);
}

function closeWorkDetailModal() {
  if (!workDetailModal) return;
  stopRankingPreview();
  closeModal(workDetailModal);
  workDetailContent.innerHTML = '';
  activeDetailWork = null;
}

function handleRankingClick(work) {
  openWorkDetailModal(work);
}

function createRankingRow(work, rank, isComposer = false) {
  const row = document.createElement('li');
  const isSold = work.status === 'sold';
  const bpmLabel = work.bpm ? `${work.bpm} BPM` : '—';
  const genreTag = work.genre
    ? `<span class="rank-genre">${escapeHtml(work.genre)}</span>`
    : '';
  const previewBtn = isComposer && getWorkPreviewUrl(work)
    ? `<button type="button" class="rank-preview-btn" aria-label="30초 미리듣기">30초</button>`
    : '';

  row.className = `market-rank-item${isSold ? ' sold' : ''}`;
  row.innerHTML = `
    <span class="rank-num">${String(rank).padStart(2, '0')}</span>
    <span class="rank-title-wrap">
      ${previewBtn}
      <span class="rank-title" title="${escapeHtml(work.title)}">${escapeHtml(work.title)}</span>
      ${genreTag}
    </span>
    <span class="rank-price">${formatPrice(work.price)}</span>
    <span class="rank-bpm">${bpmLabel}</span>
  `;

  const previewButton = row.querySelector('.rank-preview-btn');
  previewButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    playRankingPreview(work, previewButton);
  });

  row.classList.add('rank-clickable');
  row.tabIndex = 0;
  row.setAttribute('role', 'button');
  row.setAttribute('aria-label', `${work.title} 상세 보기`);
  row.addEventListener('click', (e) => {
    if (e.target.closest('.rank-preview-btn')) return;
    handleRankingClick(work);
  });
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRankingClick(work);
    }
  });

  return row;
}

function renderRankingColumn(label, works, isComposer = false) {
  const col = document.createElement('div');
  col.className = 'market-ranking-col';

  const head = document.createElement('div');
  head.className = 'market-ranking-head';
  head.innerHTML = `
    <span class="market-ranking-label">${label}</span>
    <span class="market-ranking-meta">${isComposer ? '30초 · 제목 · 장르 · 가격 · BPM' : '제목 · 장르 · 가격 · BPM'} · 최신순</span>
  `;
  col.appendChild(head);

  const list = document.createElement('ol');
  list.className = 'market-rank-list';
  works.forEach((work, index) => {
    list.appendChild(createRankingRow(work, index + 1, isComposer));
  });
  col.appendChild(list);

  return col;
}

function renderMarketExamples(query = '') {
  if (!marketExamples) return 0;

  stopRankingPreview();
  marketExamples.innerHTML = '';
  const publicWorks = getSampleWorks().filter((w) => matchesWorkSearch(w, query));
  const composerWorks = sortWorksByLatest(publicWorks.filter((w) => w.category === 'composer'));
  const lyricistWorks = sortWorksByLatest(publicWorks.filter((w) => isLyricWork(w)));
  const groups = [
    { label: '작곡', works: composerWorks },
    { label: '작사', works: lyricistWorks },
  ].filter((group) => group.works.length > 0);

  if (groups.length === 0) {
    marketExamples.classList.add('market-rankings-empty');
    marketExamples.innerHTML = query.trim()
      ? `<p class="empty-state">"${escapeHtml(query.trim())}" 검색 결과가 없습니다.</p>`
      : '<p class="empty-state">등록된 작품이 없습니다.</p>';
    return 0;
  }

  marketExamples.classList.remove('market-rankings-empty');
  if (groups.length === 1) {
    marketExamples.classList.add('market-rankings-single');
  } else {
    marketExamples.classList.remove('market-rankings-single');
  }

  groups.forEach(({ label, works }) => {
    marketExamples.appendChild(renderRankingColumn(label, works, label === '작곡'));
  });

  return publicWorks.length;
}

function renderMarket(query = '') {
  const matchCount = renderMarketExamples(query);
  const sampleAvailable = getSampleWorks().filter((w) => w.status === 'available').length;
  const q = query.trim();

  if (q) {
    marketCount.textContent = `"${q}" 검색 결과 ${matchCount}개`;
  } else {
    marketCount.textContent = `마켓 ${getSampleWorks().length}개 · 판매 중 ${sampleAvailable}개`;
  }
}

function renderUI() {
  const profile = getProfile();
  const works = getWorks();
  const query = marketSearch?.value || '';

  if (profile) {
    if (profileAlert) profileAlert.hidden = true;

    uploadBtn.classList.remove('hidden');

    mySection.classList.remove('hidden');
    mySectionTitle.textContent = '내 등록';

    myGrid.innerHTML = '';
    const myWorks = works.filter((w) => w.seller === profile.nickname);

    if (myWorks.length === 0) {
      myGrid.innerHTML = '<p class="empty-state">아직 등록한 작품이 없습니다. 작품 올리기에서 추가해 보세요.</p>';
    } else {
      myWorks.slice().reverse().forEach((work) => {
        myGrid.appendChild(createWorkCard(work, 'mine'));
      });
    }
  } else {
    uploadBtn.classList.add('hidden');
    mySection.classList.add('hidden');
    if (profileAlert) profileAlert.hidden = false;
  }

  renderMarket(query);
}

marketSearch?.addEventListener('input', () => {
  renderMarket(marketSearch.value);
});

document.querySelectorAll('.search-tag').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!marketSearch) return;
    marketSearch.value = btn.dataset.query || '';
    renderMarket(marketSearch.value);
    marketSearch.focus();
  });
});

profileBtn.addEventListener('click', openProfileModal);
profileBtnHero.addEventListener('click', openProfileModal);
profileAlertBtn?.addEventListener('click', openProfileModal);
uploadBtn.addEventListener('click', openUploadModal);
uploadBtnHero.addEventListener('click', openUploadModal);
profileModalClose.addEventListener('click', closeProfileModal);
uploadModalClose.addEventListener('click', closeUploadModal);
workDetailClose?.addEventListener('click', closeWorkDetailModal);
workDetailModal?.addEventListener('click', (e) => {
  if (e.target === workDetailModal) closeWorkDetailModal();
});

uploadForm.uploadAccountNumber?.addEventListener('input', () => {
  uploadForm.uploadAccountNumber.value = uploadForm.uploadAccountNumber.value.replace(/\D/g, '');
});

uploadForm.querySelectorAll('input[name="uploadType"]').forEach((radio) => {
  radio.addEventListener('change', () => switchUploadPanel(radio.value));
});

uploadForm.querySelectorAll('input[type="file"]').forEach((input) => {
  input.addEventListener('change', () => {
    const nameEl = input.closest('.file-upload')?.querySelector('[data-file-name]');
    if (nameEl) nameEl.textContent = input.files[0]?.name || '';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (profileModal.classList.contains('open')) closeProfileModal();
  if (uploadModal.classList.contains('open')) closeUploadModal();
});

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nickname = profileForm.nickname.value.trim();
  const genre = profileForm.genre.value;
  const roles = getSelectedRoles();

  if (roles.length === 0) {
    alert('역할(작곡·작사·가수)을 하나 이상 선택해 주세요.');
    return;
  }

  const profile = {
    nickname,
    genre,
    roles,
    updatedAt: new Date().toISOString(),
  };

  const existing = getProfile();
  if (existing?.bankAccount) {
    profile.bankAccount = existing.bankAccount;
  }

  saveProfile(profile);
  showToast(`${nickname}님, 프로필이 저장되었습니다.`);
  renderUI();
  closeProfileModal(false);

  if (pendingUpload) {
    pendingUpload = false;
    openUploadModal();
  }
});

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const profile = getProfile();
  if (!profile) return;

  const bankAccount = normalizeBankAccount({
    bankName: uploadForm.uploadBankName.value,
    accountNumber: uploadForm.uploadAccountNumber.value,
    accountHolder: uploadForm.uploadAccountHolder.value,
  });
  const bankError = validateBankAccount(bankAccount);
  if (bankError) {
    alert(bankError);
    return;
  }

  saveProfile({ ...profile, bankAccount, updatedAt: new Date().toISOString() });

  const type = uploadForm.uploadType.value;
  const config = UPLOAD_TYPES[type];
  const price = Math.round(Number(uploadForm.price.value));

  if (!Number.isFinite(price) || price < 1000) {
    alert('판매 가격은 1,000원 이상 입력해 주세요.');
    return;
  }

  const work = {
    id: crypto.randomUUID(),
    uploadType: type,
    category: config.category,
    seller: profile.nickname,
    genre: profile.genre,
    price,
    status: 'available',
    buyer: null,
    createdAt: new Date().toISOString(),
  };

  if (type === 'midi') {
    const titleValue = uploadForm.midiTitle.value.trim();
    const fileValue = uploadForm.midiFile.files[0];
    const bpm = uploadForm.midiBpm.value.trim();
    const desc = uploadForm.midiDesc.value.trim();

    if (!titleValue) {
      alert('작품 제목을 입력해 주세요.');
      return;
    }
    if (!fileValue) {
      alert('WAV 파일을 선택해 주세요.');
      return;
    }
    if (bpm && (Number(bpm) < 1 || Number(bpm) > 999)) {
      alert('BPM은 1~999 사이로 입력해 주세요.');
      return;
    }

    work.title = titleValue;
    work.fileName = fileValue.name;
    work.bpm = bpm || null;
    work.note = desc || null;
  }

  if (type === 'lyricist') {
    const titleValue = uploadForm.lyricistTitle.value.trim();
    const desc = uploadForm.lyricistDesc.value.trim();
    const hook = uploadForm.lyricistHook.value.trim();
    const doc = uploadForm.lyricistDoc.files[0];

    if (!titleValue) {
      alert('작품 제목을 입력해 주세요.');
      return;
    }
    if (!doc) {
      alert('가사 문서 파일을 선택해 주세요.');
      return;
    }

    work.title = titleValue;
    work.note = desc || null;
    work.hookLine = hook || null;
    work.type = 'lyricist';
    work.docFileName = doc.name;

    if (doc.name.toLowerCase().endsWith('.txt')) {
      try {
        const lyrics = (await readTextFile(doc)).trim();
        if (lyrics) work.lyrics = lyrics;
      } catch {
        alert('가사 파일을 읽지 못했습니다. TXT 파일을 다시 선택해 주세요.');
        return;
      }
    }
  }

  const works = getWorks();
  works.push(work);
  saveWorks(works);

  showToast(`[${config.label}] "${work.title}" (${formatPrice(price)}) 업로드 완료`);
  renderUI();
  closeUploadModal();
});

const purchasedId = new URLSearchParams(window.location.search).get('purchased');
if (purchasedId) {
  const purchased = findWork(purchasedId);
  if (purchased) {
    const settlement = purchased.settlement || calculatePurchaseBreakdown(purchased.price);
    showToast(`"${purchased.title}" 구매 완료 · ${formatPrice(settlement.total)} (수수료 ${formatPrice(settlement.platformFee)})`);
  }
  window.history.replaceState({}, '', 'index.html');
}

if (!hasProfile()) {
  setTimeout(openProfileModal, 300);
}

renderUI();
