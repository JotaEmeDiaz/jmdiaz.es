// modal.js
// Modal personalizado (no-module). Inclúyelo con <script src="modal.js"></script> antes de tu script principal.

(function () {
  let _customModalInjected = false;
  function _injectModalStyles() {
    if (_customModalInjected) return;
    _customModalInjected = true;
    const style = document.createElement('style');
    style.textContent = `
    .custom-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    .custom-modal {
        background: #111;
        color: #eee;
        padding: 18px;
        border: 1px solid rgb(212, 102, 102, 0.3);
        border-radius: 8px;
        max-width: 90%;
        width: 380px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    .custom-modal .title {
        font-weight: 700;
        margin-bottom: 8px;
        font-size: 16px;
    }
    .custom-modal .message {
        margin-bottom: 12px;
        font-size: 14px;
    }
    .custom-modal .actions {
        text-align: right;
    }
    .custom-modal .btn {
        background: #2b2b2b;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
    }
    .custom-modal .btn:active { transform: translateY(1px); }
    `;
    document.head.appendChild(style);
  }

  function showCustomAlert(message, title = '', onClose = null) {
    _injectModalStyles();

    // Deshabilitar input de shell si existe
    if (window.currentInputField) {
      window.currentInputField.disabled = true;
      setTimeout(() => window.currentInputField.blur(), 0); // Quitar foco inmediatamente
    }

    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'custom-modal';

    if (title) {
      const t = document.createElement('div');
      t.className = 'title';
      t.textContent = title;
      modal.appendChild(t);
    }

    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = message;
    modal.appendChild(msg);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const ok = document.createElement('button');
    ok.className = 'btn';
    ok.textContent = 'OK';
    ok.addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (onClose) onClose();
      // Habilitar y enfocar input de shell
      if (window.currentInputField) {
        window.currentInputField.disabled = false;
        setTimeout(() => window.currentInputField.focus(), 0);
      }
    });

    actions.appendChild(ok);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus on button for accesibilidad
    // ok.focus(); // Quitado para evitar cursor parpadeante feo
  }

  // Exponer la función globalmente para que script.js la pueda usar tal cual
  window.showCustomAlert = showCustomAlert;
})();
