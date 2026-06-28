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
const profileSummary = document.getElementById('profileSummary');
const profileCard = document.getElementById('profileCard');
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

let pendingUpload = false;

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

function createRankingRow(work, rank) {
  const row = document.createElement('li');
  const isSold = work.status === 'sold';
  const bpmLabel = work.bpm ? `${work.bpm} BPM` : '—';
  const genreTag = work.genre
    ? `<span class="rank-genre">${escapeHtml(work.genre)}</span>`
    : '';

  row.className = `market-rank-item${isSold ? ' sold' : ''}`;
  row.innerHTML = `
    <span class="rank-num">${String(rank).padStart(2, '0')}</span>
    <span class="rank-title-wrap">
      <span class="rank-title" title="${escapeHtml(work.title)}">${escapeHtml(work.title)}</span>
      ${genreTag}
    </span>
    <span class="rank-bpm">${bpmLabel}</span>
  `;

  if (!isSold) {
    row.classList.add('rank-clickable');
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', `${work.title} 구매하기`);
    row.addEventListener('click', () => goToPayment(work.id));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToPayment(work.id);
      }
    });
  }

  return row;
}

function renderRankingColumn(label, works) {
  const col = document.createElement('div');
  col.className = 'market-ranking-col';

  const head = document.createElement('div');
  head.className = 'market-ranking-head';
  head.innerHTML = `
    <span class="market-ranking-label">${label}</span>
    <span class="market-ranking-meta">제목 · 장르 · BPM · 최신순</span>
  `;
  col.appendChild(head);

  const list = document.createElement('ol');
  list.className = 'market-rank-list';
  works.forEach((work, index) => {
    list.appendChild(createRankingRow(work, index + 1));
  });
  col.appendChild(list);

  return col;
}

function renderMarketExamples(query = '') {
  if (!marketExamples) return 0;

  marketExamples.innerHTML = '';
  const userWorks = getWorks().filter((w) => !w.isSample);
  const allWorks = [...getSampleWorks(), ...userWorks].filter((w) => matchesWorkSearch(w, query));
  const composerWorks = sortWorksByLatest(allWorks.filter((w) => w.category === 'composer'));
  const lyricistWorks = sortWorksByLatest(allWorks.filter((w) => isLyricWork(w)));
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
    marketExamples.appendChild(renderRankingColumn(label, works));
  });

  return allWorks.length;
}

function renderMarket(query = '') {
  const userWorks = getWorks().filter((w) => !w.isSample);
  const matchCount = renderMarketExamples(query);
  const sampleAvailable = getSampleWorks().filter((w) => w.status === 'available').length;
  const available = userWorks.filter((w) => w.status === 'available').length;
  const q = query.trim();

  if (q) {
    marketCount.textContent = `"${q}" 검색 결과 ${matchCount}개`;
  } else {
    const total = getSampleWorks().length + userWorks.length;
    marketCount.textContent = `등록 ${total}개 · 판매 중 ${available + sampleAvailable}개`;
  }
}

function renderUI() {
  const profile = getProfile();
  const works = getWorks();
  const query = marketSearch?.value || '';

  if (profile) {
    profileSummary.hidden = false;
    if (profileAlert) profileAlert.hidden = true;

    const hints = [];
    if (isSeller(profile.roles)) hints.push('작품을 올려 판매할 수 있습니다.');
    hints.push('마켓에서 누구나 작품을 구매할 수 있습니다.');

    profileCard.innerHTML = `
      <p><strong>${escapeHtml(profile.nickname)}</strong> · ${escapeHtml(profile.genre)}</p>
      <p class="profile-roles">${escapeHtml(getRolesLabel(profile.roles))}</p>
      ${hasSellerAccount(profile)
        ? `<p class="profile-account">정산 계좌 · ${escapeHtml(formatMaskedAccount(profile.bankAccount))}</p>`
        : isSeller(profile.roles)
          ? '<p class="profile-account">정산 계좌 · 작품 등록 시 입력</p>'
          : ''}
      <p class="profile-hint">${hints.join(' ')}</p>
    `;
    uploadBtn.classList.remove('hidden');

    mySection.classList.remove('hidden');
    mySectionTitle.textContent = '내 등록 · 구매';

    myGrid.innerHTML = '';
    const myWorks = works.filter(
      (w) => w.seller === profile.nickname || w.buyer === profile.nickname
    );

    if (myWorks.length === 0) {
      myGrid.innerHTML = '<p class="empty-state">아직 등록하거나 구매한 작품이 없습니다.</p>';
    } else {
      myWorks.slice().reverse().forEach((work) => {
        myGrid.appendChild(createWorkCard(work, 'mine'));
      });
    }
  } else {
    profileSummary.hidden = true;
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
  const price = Number(uploadForm.price.value);

  if (price < 1000) {
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
