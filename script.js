document.addEventListener('DOMContentLoaded', () => {
  updateCurrentYear();
  setupRevealAnimations();
  setupScrollToTop();
  setupToggleButtons();
  setupCopyButtons();
  secureExternalLinks();
});

function updateCurrentYear() {
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function setupRevealAnimations() {
  const cards = document.querySelectorAll('.card');

  if (!cards.length) {
    return;
  }

  cards.forEach((card) => card.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function setupScrollToTop() {
  const button = document.getElementById('scrollToTop');

  if (!button) {
    return;
  }

  const toggleVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > 240);
  };

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
}

function setupToggleButtons() {
  document.querySelectorAll('.toggle-details-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target || '');

      if (!target) {
        return;
      }

      const willOpen = !target.classList.contains('is-open');
      target.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      button.textContent = willOpen
        ? button.dataset.openText || '收合內容'
        : button.dataset.closedText || '查看更多';
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget || '');
      const feedback = document.getElementById(button.dataset.feedbackTarget || '');

      if (!target) {
        return;
      }

      try {
        await copyText(target.textContent.trim());
        button.textContent = '已複製';

        if (feedback) {
          feedback.textContent = '已複製電子郵件';
        }

        window.setTimeout(() => {
          button.textContent = '複製電子郵件';

          if (feedback) {
            feedback.textContent = '';
          }
        }, 2000);
      } catch (error) {
        if (feedback) {
          feedback.textContent = '複製失敗，請手動複製';
        }
      }
    });
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

function secureExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const relValues = new Set((link.getAttribute('rel') || '').split(' ').filter(Boolean));
    relValues.add('noopener');
    relValues.add('noreferrer');
    link.setAttribute('rel', Array.from(relValues).join(' '));
  });
}
