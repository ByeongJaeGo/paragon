/**
 * PARAGON 플랫폼 설정
 * 아래 account에 본인(운영자) 정산 계좌를 입력하세요.
 * 구매 시 작품 가격의 5%가 이 계좌로 수수료 정산됩니다.
 */
const PARAGON_PLATFORM = {
  name: 'PARAGON',
  feeRate: 0.05,
  account: {
    bankName: '우체국',
    accountNumber: '310003-02-081525',
    accountHolder: '고병재',
  },
};
