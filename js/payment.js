const params = new URLSearchParams(window.location.search);
const workId = params.get('workId');
const paymentCard = document.getElementById('paymentCard');
const orderSummary = document.getElementById('orderSummary');
const paymentForm = document.getElementById('paymentForm');
const payBtn = document.getElementById('payBtn');

const work = workId ? findWork(workId) : null;
const profile = getProfile();

if (!work || work.status === 'sold') {
  paymentCard.innerHTML = `
    <p class="page-tag">결제</p>
    <h1>결제할 수 없습니다</h1>
    <p class="page-desc">작품을 찾을 수 없거나 이미 판매되었습니다.</p>
    <a href="index.html" class="btn btn-primary">마켓으로 돌아가기</a>
  `;
} else {
  orderSummary.innerHTML = `
    <div class="order-row"><span>작품</span><strong>${escapeHtml(work.title)}</strong></div>
    <div class="order-row"><span>유형</span><strong>${getCategoryLabel(work)}</strong></div>
    <div class="order-row"><span>판매자</span><strong>${escapeHtml(work.seller)}</strong></div>
    <div class="order-row order-total"><span>결제 금액</span><strong>${formatPrice(work.price)}</strong></div>
  `;

  if (profile?.nickname) {
    paymentForm.buyerName.value = profile.nickname;
  }
}

paymentForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!work || work.status === 'sold') return;

  const buyerName = paymentForm.buyerName.value.trim();
  if (!buyerName) {
    alert('구매자 이름을 입력해 주세요.');
    return;
  }

  if (work.seller === buyerName) {
    alert('본인 작품은 구매할 수 없습니다.');
    return;
  }

  payBtn.disabled = true;
  payBtn.textContent = '결제 처리 중...';

  setTimeout(() => {
    completePurchase(workId, buyerName);
    window.location.href = `index.html?purchased=${encodeURIComponent(workId)}`;
  }, 1200);
});
