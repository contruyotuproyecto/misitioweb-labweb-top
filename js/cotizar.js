/* Asistente en HTML/CSS/JS, sin Astro ni frameworks.
   Prepara un mensaje para WhatsApp: NO envía nada automáticamente. */
(() => {
  'use strict';

  const WHATSAPP_NUMBER = '50660072890'; // Número del componente original.
  const QUESTIONS = [
    {
      title: '¿Qué tipo de página necesitás?',
      hint: 'Elegí la opción que mejor describa tu idea.',
      options: ['Página para mi negocio', 'Tienda en línea', 'Landing page / promoción', 'Rediseñar mi sitio actual', 'Todavía no lo tengo claro']
    },
    {
      title: '¿Qué querés lograr principalmente?',
      hint: 'Nos ayuda a orientar mejor tu proyecto.',
      options: ['Conseguir nuevos clientes', 'Vender productos por internet', 'Mostrar servicios o portafolio', 'Recibir consultas o reservas', 'Otro objetivo']
    },
    {
      title: '¿Cuándo te gustaría empezar?',
      hint: 'Es una referencia, no un compromiso.',
      options: ['Lo antes posible', 'Durante este mes', 'En los próximos 1 a 3 meses', 'Solo estoy explorando opciones']
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const assistant = document.querySelector('[data-quote-assistant]');
    const backdrop = document.querySelector('[data-assistant-backdrop]');
    if (!assistant || !backdrop) return;

    const el = (selector) => assistant.querySelector(selector);
    const panel = el('[data-assistant-panel]');
    const content = el('.quote-assistant-content');
    const closeButton = el('[data-assistant-close]');
    const form = el('[data-assistant-form]');
    const fieldset = el('[data-assistant-fieldset]');
    const question = el('[data-assistant-question]');
    const hint = el('[data-assistant-hint]');
    const options = el('[data-assistant-options]');
    const status = el('[data-assistant-status]');
    const context = el('[data-assistant-progress-context]');
    const progress = el('[data-assistant-progress]');
    const progressFill = el('[data-assistant-progress-fill]');
    const back = el('[data-assistant-back]');
    const next = el('[data-assistant-next]');
    const review = el('[data-assistant-review]');
    const reviewHeading = el('[data-assistant-review-heading]');
    const summary = el('[data-assistant-summary]');
    const stepActions = el('[data-assistant-step-actions]');
    const reviewActions = el('[data-assistant-review-actions]');
    const details = el('[data-assistant-details]');
    const count = el('[data-assistant-count]');
    const whatsapp = el('[data-assistant-whatsapp]');
    const edit = el('[data-assistant-edit]');
    const reset = el('[data-assistant-reset]');

    let step = 0;
    let answers = Array(QUESTIONS.length).fill(null);
    let previouslyFocused = null;

    const displayStep = () => {
      const isReview = step >= QUESTIONS.length;
      fieldset.hidden = isReview;
      stepActions.hidden = isReview;
      review.hidden = !isReview;
      reviewActions.hidden = !isReview;
      progress.setAttribute('aria-valuenow', String(Math.min(step + 1, QUESTIONS.length)));
      progressFill.style.width = `${Math.min(step + 1, QUESTIONS.length) / QUESTIONS.length * 100}%`;
      status.textContent = isReview ? 'Consulta lista' : `Pregunta ${step + 1} de ${QUESTIONS.length}`;
      context.textContent = isReview ? 'Revisá antes de abrir WhatsApp' : 'Elegí una opción para continuar';

      if (isReview) {
        renderReview();
        content.scrollTop = 0;
        reviewHeading.focus();
        return;
      }

      const current = QUESTIONS[step];
      question.textContent = current.title;
      hint.textContent = current.hint;
      options.replaceChildren();

      current.options.forEach((value) => {
        const label = document.createElement('label');
        label.className = 'quote-assistant-option';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `quote-answer-${step}`;
        input.value = value;
        input.checked = answers[step] === value;
        input.addEventListener('change', () => {
          answers[step] = value;
          next.disabled = false;
        });
        const text = document.createElement('span');
        text.textContent = value;
        label.append(input, text);
        options.append(label);
      });

      back.hidden = step === 0;
      next.disabled = !answers[step];
      next.textContent = step === QUESTIONS.length - 1 ? 'Revisar consulta →' : 'Continuar →';
      content.scrollTop = 0;
      question.focus();
    };

    const buildWhatsAppMessage = () => {
      const lines = [
        'Hola, quiero solicitar una cotización de diseño web.',
        '',
        ...QUESTIONS.map((q, i) => `${q.title}\n${answers[i] || 'Sin respuesta'}`)
      ];
      const extra = details.value.trim();
      if (extra) lines.push('', `Detalle adicional: ${extra}`);
      lines.push('', '¿Podemos conversar sobre mi proyecto?');
      return lines.join('\n');
    };

    const updateWhatsAppLink = () => {
      whatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    };

    const renderReview = () => {
      summary.replaceChildren();
      QUESTIONS.forEach((q, i) => {
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = q.title;
        dd.textContent = answers[i] || 'Sin respuesta';
        row.append(dt, dd);
        summary.append(row);
      });
      count.textContent = String(details.value.length);
      updateWhatsAppLink();
    };

    const openPanel = (trigger) => {
      previouslyFocused = trigger || document.activeElement;
      backdrop.hidden = false;
      panel.hidden = false;
      document.body.classList.add('quote-assistant-open');
      displayStep();
    };

    const closePanel = () => {
      backdrop.hidden = true;
      panel.hidden = true;
      document.body.classList.remove('quote-assistant-open');
      if (previouslyFocused && previouslyFocused.isConnected) previouslyFocused.focus();
      else document.querySelector('[data-open-quote]')?.focus();
    };

    form.addEventListener('submit', (event) => event.preventDefault());
    document.querySelectorAll('[data-open-quote]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        openPanel(button);
      });
    });
    closeButton.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);

    next.addEventListener('click', () => {
      if (!answers[step]) return;
      step += 1;
      displayStep();
    });
    back.addEventListener('click', () => {
      step = Math.max(0, step - 1);
      displayStep();
    });
    edit.addEventListener('click', () => {
      step = 0;
      displayStep();
    });
    reset.addEventListener('click', () => {
      step = 0;
      answers = Array(QUESTIONS.length).fill(null);
      details.value = '';
      displayStep();
    });
    details.addEventListener('input', () => {
      count.textContent = String(details.value.length);
      updateWhatsAppLink();
    });

    document.addEventListener('keydown', (event) => {
      if (panel.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
      }
      if (event.key !== 'Tab') return;
      const candidates = [...panel.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), [tabindex="0"]')]
        .filter((node) => node.getClientRects().length > 0);
      if (!candidates.length) return;
      const first = candidates[0];
      const last = candidates[candidates.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });

  });
})();
