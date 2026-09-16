export default function decorate(block) {
  const rows = [...block.children];

  const image = rows[0]?.querySelector('img')?.src || '';
  const imageAlt = rows[1]?.textContent?.trim() || '';
  const content = rows[2]?.innerHTML?.trim() || '';

  if (image) {
    block.style.backgroundImage = `url("${image}")`;
  }

  if (imageAlt) {
    block.setAttribute('aria-label', imageAlt);
  }

  block.innerHTML = `
    <div class="hero-banner-2__overlay">
      <div class="hero-banner-2__container">
        <div class="hero-banner-2__content">
          ${content}
        </div>
      </div>
    </div>
  `;
}
