(function loadAdSenseWhenApproved() {
  const config = window.PARAGON_ADSENSE || {};
  if (!config.showAds) return;
  if (!document.body.classList.contains('adsense-page')) return;

  const publisherId = String(config.publisherId || '').trim();
  if (!publisherId.startsWith('ca-pub-')) return;

  document.documentElement.classList.add('adsense-enabled');

  function fillSlots() {
    document.querySelectorAll('.adsbygoogle').forEach((slot) => {
      if (!slot.dataset.adClient) slot.dataset.adClient = publisherId;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* ignore */
      }
    });
  }

  if (window.adsbygoogle) {
    fillSlots();
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
  script.crossOrigin = 'anonymous';
  script.onload = fillSlots;
  document.head.appendChild(script);
})();
