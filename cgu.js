alert('Le script CGU est chargé');
(function() {
  const STORAGE_KEY = 'cguAccepted';

  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    return; // déjà accepté
  }

  // Création de la modal
  const modal = document.createElement('div');
  modal.id = 'cguModal';
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.95)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '2147483647', // max z-index
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    userSelect: 'none',
  });

  modal.innerHTML = `
    <div style="
      max-width: 500px; 
      background: #121212; 
      border-radius: 12px; 
      box-shadow: 0 0 20px #0f0;
      padding: 30px;
      text-align: center;
      color: #c8ffc8;
      line-height: 1.5;
      font-size: 15px;
      user-select: text;
    ">
      <h2 style="color: #0f0; margin-bottom: 15px; font-weight: 700;">Conditions d'Utilisation</h2>
      <div style="
        height: 220px; 
        overflow-y: auto; 
        background: #1e1e1e; 
        padding: 15px; 
        border-radius: 8px; 
        margin-bottom: 25px;
        text-align: left;
        box-shadow: inset 0 0 10px #0f0a;
      ">
        <p>1. Vous acceptez de ne pas modifier ou tenter de contourner cette page.</p>
        <p>2. Toute tentative non autorisée sera sanctionnée.</p>
        <p>3. L'accès est conditionné à l'acceptation des présentes conditions.</p>
        <p>4. En cliquant sur <strong>"J'accepte"</strong>, vous reconnaissez avoir lu et compris ces termes.</p>
      </div>
      <button id="acceptCGU" style="
        background-color: #0f0 !important;
        color: #000 !important;
        border: none !important;
        padding: 14px 35px !important;
        font-size: 17px !important;
        font-weight: 700 !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        transition: background-color 0.3s ease !important;
        width: 100% !important;
        user-select: auto !important;
      ">J'accepte</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Bloquer interactions page entière avec styles en important
  function blockPage() {
    const styleId = 'cgu-block-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        html, body {
          overflow: hidden !important;
          pointer-events: none !important;
          user-select: none !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #cguModal, #cguModal * {
          pointer-events: auto !important;
          user-select: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  function unblockPage() {
    const style = document.getElementById('cgu-block-style');
    if (style) style.remove();
  }

  blockPage();

  const acceptBtn = document.getElementById('acceptCGU');
  acceptBtn.focus();

  // Focus trap dans modal
  document.addEventListener('keydown', e => {
    if (!document.body.contains(modal)) return;
    if (e.key === 'Escape') e.preventDefault();

    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Empêche clics hors modal
  document.addEventListener('click', e => {
    if (document.body.contains(modal) && !modal.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Empêche touches clavier hors modal
  document.addEventListener('keydown', e => {
    if (document.body.contains(modal) && !modal.contains(document.activeElement)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // MutationObserver pour restaurer la modal si supprimée ou modifiée
  const observer = new MutationObserver(mutations => {
    const isInDOM = document.body.contains(modal);
    if (!isInDOM) {
      document.body.appendChild(modal);
      blockPage();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    unblockPage();
    modal.remove();
    observer.disconnect();
  });
})();
