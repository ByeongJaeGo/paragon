(function applySeoConfig() {
  if (typeof NAVER_SITE_VERIFICATION === 'undefined' || !NAVER_SITE_VERIFICATION) return;
  if (document.querySelector('meta[name="naver-site-verification"]')) return;

  const meta = document.createElement('meta');
  meta.name = 'naver-site-verification';
  meta.content = NAVER_SITE_VERIFICATION;
  document.head.appendChild(meta);
})();
