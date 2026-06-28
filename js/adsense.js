(function initAdSlots() {
  const publisherId = window.PARAGON_ADSENSE?.publisherId?.trim();
  if (!publisherId?.startsWith('ca-pub-')) return;

  document.documentElement.classList.add('adsense-enabled');

  function fillSlots() {
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
  }

  if (window.adsbygoogle) {
    fillSlots();
  } else {
    window.addEventListener('load', fillSlots);
  }
})();
