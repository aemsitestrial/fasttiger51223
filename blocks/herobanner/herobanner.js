export default function decorate(block) {
  const rows = [...block.children];

  const getText = (index) => rows[index]?.textContent?.trim() || '';

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

  const html = `
    <div class="hero-banner-2__container">
      <div class="hero-banner-2__meta">
        ${category ? `<span class="hero-banner-2__tag">${category}</span>` : ''}
        ${topic ? `<span>${topic}</span>` : ''}
        ${readTime ? `<span>${readTime}</span>` : ''}
      </div>
      ${publishDate ? `<div class="hero-banner-2__date">${publishDate}</div>` : ''}
      <h2 class="hero-banner-2__title">${title}</h2>
      <p class="hero-banner-2__description">${description}</p>
      ${ctaText ? `
        <a href="${ctaLink}" class="hero-banner-2__cta">
          ${ctaText}
          <span class="hero-banner-2__arrow">&rarr;</span>
        </a>
      ` : ''}
      ${author || designation ? `
        <div class="hero-banner-2__author">
          ${author ? `<div class="hero-banner-2__author-name">${author}</div>` : ''}
          ${designation ? `<div class="hero-banner-2__author-role">${designation}</div>` : ''}
        </div>
      ` : ''}
    </div>
  `;

  block.innerHTML = html;
}