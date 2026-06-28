const params = new URLSearchParams(window.location.search);
const workId = params.get('workId');
const paymentCard = document.getElementById('paymentCard');
const orderSummary = document.getElementById('orderSummary');
const paymentForm = document.getElementById('paymentForm');
const payBtn = document.getElementById('payBtn');

const work = workId ? findWork(workId) : null;
const profile = getProfile();

function switchPayPanel(method) {
  const isBank = method === 'bank';
  paymentForm.querySelectorAll('.payment-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.payPanel !== (isBank ? 'bank' : 'card'));
  });
  paymentForm.cardNumber.required = !isBank;
  paymentForm.depositorName.required = isBank;
}

function fillPaymentForm(existingProfile) {
  if (!paymentForm || !existingProfile) return;
  if (existingProfile.nickname) {
    paymentForm.buyerName.value = existingProfile.nickname;
  }
  const pay = existingProfile.buyerPayment;
  if (pay?.contact) paymentForm.buyerContact.value = pay.contact;
  if (pay?.payMethod) paymentForm.payMethod.value = pay.payMethod;
  if (pay?.cardNumber) paymentForm.cardNumber.value = pay.cardNumber;
  if (pay?.depositorName) paymentForm.depositorName.value = pay.depositorName;
  switchPayPanel(paymentForm.payMethod.value);
}

if (!work || work.status === 'sold') {
  paymentCard.innerHTML = `
    <p class="page-tag">결제</p>
    <h1>결제할 수 없습니다</h1>
    <p class="page-desc">작품을 찾을 수 없거나 이미 판매되었습니다.</p>
    <a href="index.html" class="btn btn-primary">마켓으로 돌아가기</a>
  `;
} else {
  orderSummary.innerHTML = buildPaymentSummaryHtml(work);

  fillPaymentForm(profile);
}

paymentForm?.payMethod.addEventListener('change', () => {
  switchPayPanel(paymentForm.payMethod.value);
});

paymentForm?.cardNumber.addEventListener('input', () => {
  paymentForm.cardNumber.value = paymentForm.cardNumber.value.replace(/\D/g, '');
});

paymentForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!work || work.status === 'sold') return;

  const buyerName = paymentForm.buyerName.value.trim();
  const payMethod = paymentForm.payMethod.value;
  const buyerPayment = normalizeBuyerPayment({
    payMethod,
    contact: paymentForm.buyerContact.value,
    cardNumber: paymentForm.cardNumber.value,
    depositorName: paymentForm.depositorName.value,
  });

  if (!buyerName) {
    alert('구매자 이름을 입력해 주세요.');
    return;
  }

  const payError = validateBuyerPayment(buyerPayment, payMethod);
  if (payError) {
    alert(payError);
    return;
  }

  if (work.seller === buyerName) {
    alert('본인 작품은 구매할 수 없습니다.');
    return;
  }

  if (profile) {
    saveProfile({
      ...profile,
      buyerPayment,
      updatedAt: new Date().toISOString(),
    });
  }

  payBtn.disabled = true;
  payBtn.textContent = '결제 처리 중...';

  setTimeout(() => {
    const settlement = completePurchase(workId, buyerName);
    if (!settlement) {
      alert('결제 처리에 실패했습니다. 다시 시도해 주세요.');
      payBtn.disabled = false;
      payBtn.textContent = '결제하기';
      return;
    }
    window.location.href = `index.html?purchased=${encodeURIComponent(workId)}`;
  }, 1200);
});
