export default function decorate(block) {
  const rows = [...block.children];

  const imageRow = rows[0];
  const eyebrowRow = rows[1];
  const titleRow = rows[2];
  const ctaRow = rows[3];

  const picture = imageRow?.querySelector('picture');

  const eyebrow = eyebrowRow?.textContent?.trim() || '';
  const title = titleRow?.textContent?.trim() || '';

  const ctaLink = ctaRow?.querySelector('a');

  const wrapper = document.createElement('div');
  wrapper.className = 'featured-article__wrapper';

  const media = document.createElement('div');
  media.className = 'featured-article__media';

  if (picture) {
    media.append(picture);
  }

  const content = document.createElement('div');
  content.className = 'featured-article__content';

  const eyebrowEl = document.createElement('div');
  eyebrowEl.className = 'featured-article__eyebrow';
  eyebrowEl.textContent = eyebrow;

  const titleEl = document.createElement('h3');
  titleEl.className = 'featured-article__title';
  titleEl.textContent = title;

  content.append(eyebrowEl);
  content.append(titleEl);

  if (ctaLink) {
    ctaLink.classList.add('featured-article__link');

    const arrow = document.createElement('span');
    arrow.className = 'featured-article__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';

    ctaLink.append(' ', arrow);

    content.append(ctaLink);
  }

  wrapper.append(media);
  wrapper.append(content);

  block.replaceChildren(wrapper);
}