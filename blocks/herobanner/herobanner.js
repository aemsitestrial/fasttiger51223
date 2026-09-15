export default function decorate(block) {
  const rows = [...block.children];

  const getText = (index) =>
    rows[index]?.textContent?.trim() || '';

  const category = getText(0);
  const topic = getText(1);
  const readTime = getText(2);
  const publishDate = getText(3);
  const title = getText(4);
  const description = getText(5);
  const ctaText = getText(6);
  const ctaLink = getText(7) || '#';
  const author = getText(8);
  const designation = getText(9);

  block.innerHTML = `
    <div class="hero-banner-2__container">

      <div class="hero-banner-2__meta">
        <span class="hero-banner-2__tag">${category}</span>
        <span>${topic}</span>
        <span>${readTime}</span>
      </div>

      <div class="hero-banner-2__date">
        ${publishDate}
      </div>

      <h1 class="hero-banner-2__title">
        ${title}
      </h1>

      <p class="hero-banner-2__description">
        ${description}
      </p>

      ${ctaLink}
        ${ctaText}
        <span class="hero-banner-2__arrow">→</span>
      </a>

      <div class="hero-banner-2__author">
        <div class="hero-banner-2__author-name">
          ${author}
        </div>
        <div class="hero-banner-2__author-role">
          ${designation}
        </div>
      </div>

    </div>
  `;
}
``