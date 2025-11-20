// Simple rotating tagline for about.html
(function () {
  const el = document.getElementById('taglineRotator');
  if (!el) return;

  const taglines = [
    'Turning learning, labs, and late-night debugging into practical cloud skills.',
    'Building reliable systems one small, well-documented step at a time.',
    'Bridging the gap between support tickets and cloud architecture.',
    "Happy to say “I don’t know yet” — as long as I can add “here’s how I’ll find out.”"
  ];

  if (!taglines.length) return;

  let index = 0;

  // Ensure the first tagline is set explicitly
  el.textContent = taglines[0];

  if (taglines.length === 1) return;

  setInterval(() => {
    index = (index + 1) % taglines.length;
    el.textContent = taglines[index];
  }, 10000); // 10 seconds
})();
