document.querySelectorAll<HTMLFormElement>('.js-newsletter-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = form.querySelector<HTMLInputElement>('input[type="email"]')!;
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const email = input.value.trim();

    const originalText = btn.textContent ?? 'Subscribe';
    btn.disabled = true;
    btn.textContent = 'Subscribing…';

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        btn.textContent = "You're in!";
        input.value = '';
        input.disabled = true;
      } else {
        const data = await res.json().catch(() => ({}));
        btn.textContent = (data as { error?: string }).error ?? 'Something went wrong';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText; }, 3000);
      }
    } catch {
      btn.textContent = 'Network error — try again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  });
});
