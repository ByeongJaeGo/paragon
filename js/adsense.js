(function initAdSense() {
  const config = window.PARAGON_ADSENSE || {};
  const publisherId = String(config.publisherId || '').trim();

  if (!publisherId || publisherId.includes('XXXX') || !publisherId.startsWith('ca-pub-')) {
    return;
  }

  document.documentElement.classList.add('adsense-enabled');

  const meta = document.createElement('meta');
  meta.name = 'google-adsense-account';
  meta.content = publisherId;
  document.head.appendChild(meta);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);

  script.addEventListener('load', () => {
    document.querySelectorAll('.adsbygoogle').forEach((slot) => {
      if (!slot.dataset.adClient) {
        slot.dataset.adClient = publisherId;
      }
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* ignore ad blockers */
      }
    });
  });
})();
