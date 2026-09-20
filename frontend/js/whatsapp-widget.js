// KrishiSanjivani WhatsApp QR contact widget.
(function () {
  const unavailableMessage = 'KrishiSanjivani WhatsApp service is currently unavailable. Please check back soon.';

  function injectStylesheet() {
    if (document.getElementById('ks-wa-stylesheet')) return;
    const link = document.createElement('link');
    link.id = 'ks-wa-stylesheet';
    link.rel = 'stylesheet';
    link.href = 'css/whatsapp-widget.css';
    document.head.appendChild(link);
  }

  function renderWidget() {
    if (document.getElementById('ks-wa-modal')) return;

    const fab = document.createElement('button');
    fab.id = 'ks-wa-fab';
    fab.type = 'button';
    fab.title = 'View WhatsApp service status';
    fab.setAttribute('aria-label', 'View WhatsApp service status');
    fab.innerHTML = '<span class="ks-wa-fab-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 21h2M21 14h-2"/></svg></span>';

    const modal = document.createElement('section');
    modal.id = 'ks-wa-modal';
    modal.setAttribute('aria-label', 'WhatsApp contact');
    modal.innerHTML = `
      <div class="ks-wa-header">
        <div><strong>WhatsApp Service</strong><span>Current service status</span></div>
        <button class="ks-wa-close-btn" id="ks-wa-close" type="button" aria-label="Close WhatsApp QR code">×</button>
      </div>
      <div class="ks-wa-body" id="ks-wa-body">
        <div class="ks-wa-qr-wrap"><img class="ks-wa-qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(unavailableMessage)}" alt="Service unavailable notice QR code"></div>
        <h3>Service currently unavailable</h3>
        <p>${unavailableMessage}</p>
        <button class="ks-wa-open-btn" id="ks-wa-open" type="button">View message</button>
      </div>`;

    document.body.append(fab, modal);

    const close = () => modal.classList.remove('open');
    const showUnavailable = () => {
      const body = document.getElementById('ks-wa-body');
      body.classList.add('ks-wa-state');
      body.innerHTML = `<div class="ks-wa-state-icon" aria-hidden="true">!</div><h3>Service unavailable</h3><p>${unavailableMessage}</p><button class="ks-wa-open-btn" id="ks-wa-back" type="button">Back to status</button>`;
      document.getElementById('ks-wa-back').addEventListener('click', event => { event.stopPropagation(); renderQrState(); });
    };
    const renderQrState = () => {
      const body = document.getElementById('ks-wa-body');
      body.classList.remove('ks-wa-state');
      body.innerHTML = `<div class="ks-wa-qr-wrap"><img class="ks-wa-qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(unavailableMessage)}" alt="Service unavailable notice QR code"></div><h3>Service currently unavailable</h3><p>${unavailableMessage}</p><button class="ks-wa-open-btn" id="ks-wa-open" type="button">View message</button>`;
      document.getElementById('ks-wa-open').addEventListener('click', event => { event.stopPropagation(); showUnavailable(); });
    };

    fab.addEventListener('click', event => { event.stopPropagation(); modal.classList.toggle('open'); });
    document.getElementById('ks-wa-close').addEventListener('click', event => { event.stopPropagation(); close(); });
    document.getElementById('ks-wa-open').addEventListener('click', event => { event.stopPropagation(); showUnavailable(); });
    document.addEventListener('click', event => {
      if (modal.classList.contains('open') && !modal.contains(event.target) && !fab.contains(event.target)) close();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectStylesheet();
    renderWidget();
  });
})();
