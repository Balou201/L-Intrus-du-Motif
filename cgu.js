(function() {
  const STORAGE_KEY = 'cguAccepted';

  // Vérifie si déjà accepté
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    return; // ok, on ne bloque pas
  }

  // Bloque interactions
  function blockPage() {
    document.documentElement.style.overflow = 'hidden'; // bloque scroll
    document.body.style.pointerEvents = 'none'; // bloque clics
    document.body.style.userSelect = 'none'; // bloque sélection
  }

  // Débloque interactions
  function unblockPage() {
    document.documentElement.style.overflow = '';
    document.body.style.pointerEvents = '';
    document.body.style.userSelect = '';
  }

  // Création modal
  const modal = document.createElement('div');
  modal.id = 'cguModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
  modal.style.color = '#fff';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '999999';
  modal.style.padding = '20px';
  modal.style.boxSizing = 'border-box';
  modal.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  modal.innerHTML = `
    <div style="
      max-width: 500px; 
      background: #121212; 
      border-radius: 12px; 
      box-shadow: 0 0 15px rgba(0,255,0,0.7);
      padding: 30px;
      text-align: center;
      color: #c8ffc8;
      line-height: 1.5;
      font-size: 15px;
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
        background-color: #0f0;
        color: #000;
        border: none;
        padding: 14px 35px;
        font-size: 17px;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        width: 100%;
      ">J'accepte</button>
    </div>
  `;

  // Ajout modal
  document.body.appendChild(modal);
  blockPage();

  // Gestion focus et tabulation
  const acceptBtn = document.getElementById('acceptCGU');
  acceptBtn.focus();

  // Trap focus inside modal
  document.addEventListener('keydown', function(e) {
    if (!modal.parentElement) return; // modal supprimé, rien à faire
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
    if(e.key === 'Escape'){
      // Empêche fermeture via ESC
      e.preventDefault();
    }
  });

  // Clique sur "J'accepte"
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    unblockPage();
    modal.remove();
  });

  // Empêche clic hors modal et sélection
  modal.addEventListener('click', e => {
    e.stopPropagation();
  });
  document.addEventListener('click', e => {
    if (modal.parentElement) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
})();
