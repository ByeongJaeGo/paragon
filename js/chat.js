const params = new URLSearchParams(window.location.search);
const workId = params.get('workId');
const chatHeader = document.getElementById('chatHeader');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');

const work = workId ? findWork(workId) : null;
const profile = getProfile();

if (!work) {
  chatHeader.innerHTML = `
    <h1>채팅을 열 수 없습니다</h1>
    <p class="page-desc">작품 정보를 찾을 수 없습니다.</p>
    <a href="index.html" class="btn btn-outline">마켓으로</a>
  `;
  chatForm.hidden = true;
} else {
  const me = profile?.nickname || '게스트';
  chatHeader.innerHTML = `
    <p class="page-tag">채팅</p>
    <h1>${escapeHtml(work.seller)}님과 대화</h1>
    <p class="page-desc">[${getCategoryLabel(work)}] ${escapeHtml(work.title)} · ${formatPrice(work.price)}</p>
  `;

  if (getChatMessages(workId).length === 0) {
    saveChatMessage(workId, {
      id: crypto.randomUUID(),
      sender: work.seller,
      text: `안녕하세요! "${work.title}" 작품 문의 주셔서 감사합니다. 궁금한 점을 남겨 주세요.`,
      time: new Date().toISOString(),
      system: true,
    });
  }

  renderMessages();

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatForm.message.value.trim();
    if (!text) return;

    saveChatMessage(workId, {
      id: crypto.randomUUID(),
      sender: me,
      text,
      time: new Date().toISOString(),
    });

    chatForm.reset();
    renderMessages();

    setTimeout(() => {
      saveChatMessage(workId, {
        id: crypto.randomUUID(),
        sender: work.seller,
        text: '메시지 확인했습니다. 잠시만 기다려 주세요! (데모 자동 답장)',
        time: new Date().toISOString(),
        system: true,
      });
      renderMessages();
    }, 900);
  });
}

function renderMessages() {
  const messages = getChatMessages(workId);
  const me = profile?.nickname || '게스트';

  chatMessages.innerHTML = messages.map((msg) => {
    const mine = msg.sender === me;
    return `
      <div class="chat-bubble${mine ? ' mine' : ''}${msg.system ? ' system' : ''}">
        <span class="chat-sender">${escapeHtml(msg.sender)}</span>
        <p>${escapeHtml(msg.text)}</p>
        <time>${new Date(msg.time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</time>
      </div>
    `;
  }).join('');

  chatMessages.scrollTop = chatMessages.scrollHeight;
}
