export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) {
    return;
  }

  const titleRow = rows[0];
  const linkRow = rows[1];

  const title = titleRow?.textContent?.trim() || '';

  const authoredLink = linkRow?.querySelector('a');

  const wrapper = document.createElement('div');
  wrapper.className = 'section-header__wrapper';

  const heading = document.createElement('h2');
  heading.className = 'section-header__title';
  heading.textContent = title;

  wrapper.append(heading);

  if (authoredLink) {
    authoredLink.classList.add('section-header__link');

    const arrow = document.createElement('span');
    arrow.className = 'section-header__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';

    authoredLink.append(' ', arrow);
    wrapper.append(authoredLink);
  }

  block.replaceChildren(wrapper);
}
