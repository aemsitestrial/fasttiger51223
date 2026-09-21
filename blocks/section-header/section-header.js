export default function decorate(block) {
  const data = {};

  [...block.children].forEach((row) => {
    const cols = row.querySelectorAll(':scope > div');

    if (cols.length >= 2) {
      const key = cols[0].textContent.trim();
      const value = cols[1].textContent.trim();
      data[key] = value;
    }
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'section-header__wrapper';

  const heading = document.createElement('h2');
  heading.className = 'section-header__title';
  heading.textContent = data.title || '';

  wrapper.append(heading);

  if (data.viewAllLabel && data.viewAllLink) {
    const link = document.createElement('a');
    link.className = 'section-header__link';
    link.href = data.viewAllLink;
    link.textContent = data.viewAllLabel;

    const arrow = document.createElement('span');
    arrow.className = 'section-header__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';

    link.append(' ', arrow);

    wrapper.append(link);
  }

  block.replaceChildren(wrapper);
}
