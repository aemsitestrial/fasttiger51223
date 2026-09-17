const DEFAULTS = {
  label: 'RESEARCH',
  category: 'AI-FIRST ENTERPRISE',
  readTime: '14 MIN READ',
  publishDate: 'Published Aug 26',
  title: 'The Enterprise\nIntelligence\nOutlook',
  subtitle: 'Enabling Banking Innovation and\nCyber Resilience',
  ctaText: 'Read Report',
  author: 'Dr. Aris Thorne',
  role: 'CHIEF AI STRATEGIST',
};

function normalizeFieldName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getFields(block) {
  return [...block.children].reduce((fields, row) => {
    const [nameCell, valueCell] = row.children;
    if (nameCell && valueCell) {
      fields[normalizeFieldName(nameCell.textContent)] = valueCell;
    }
    return fields;
  }, {});
}

function getText(fields, name, fallback = '') {
  return fields[normalizeFieldName(name)]?.textContent.trim() || fallback;
}

function getLines(fields, name, fallback) {
  const cell = fields[normalizeFieldName(name)];
  if (!cell) return fallback.split('\n');

  const copy = cell.cloneNode(true);
  copy.querySelectorAll('br').forEach((breakElement) => breakElement.replaceWith('\n'));
  const elements = [...copy.children];
  const value = elements.length > 1
    ? elements.map((element) => element.textContent.trim()).filter(Boolean).join('\n')
    : copy.textContent.trim();

  return (value || fallback).split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function createMeta(fields) {
  const meta = document.createElement('div');
  meta.className = 'herobanner__meta';
  meta.setAttribute('aria-label', 'Report metadata');

  const label = getText(fields, 'label', DEFAULTS.label);
  const category = getText(fields, 'category', DEFAULTS.category);
  const readTime = getText(fields, 'readTime', DEFAULTS.readTime);

  if (label) meta.append(createTextElement('span', 'herobanner__label', label));
  if (category) meta.append(createTextElement('span', 'herobanner__category', category));
  if (readTime) meta.append(createTextElement('span', 'herobanner__read-time', readTime));

  return meta;
}

function createHeading(fields) {
  const heading = document.createElement('h1');
  heading.className = 'herobanner__title';

  getLines(fields, 'title', DEFAULTS.title).forEach((line) => {
    heading.append(createTextElement('span', 'herobanner__title-line', line));
  });

  return heading;
}

function createSubtitle(fields) {
  const subtitle = document.createElement('p');
  subtitle.className = 'herobanner__subtitle';

  getLines(fields, 'subtitle', DEFAULTS.subtitle).forEach((line) => {
    subtitle.append(createTextElement('span', 'herobanner__subtitle-line', line));
  });

  return subtitle;
}

function createCallToAction(fields) {
  const text = getText(fields, 'ctaText', DEFAULTS.ctaText);
  const linkCell = fields[normalizeFieldName('ctaLink')];
  const authoredLink = linkCell?.querySelector('a');
  const href = authoredLink?.getAttribute('href') || linkCell?.textContent.trim();
  if (!text || !href) return null;

  const link = document.createElement('a');
  link.className = 'herobanner__cta';
  link.href = href;
  link.append(
    createTextElement('span', 'herobanner__cta-text', text),
    createTextElement('span', 'herobanner__cta-arrow', '→'),
  );
  link.querySelector('.herobanner__cta-arrow').setAttribute('aria-hidden', 'true');
  return link;
}

function createAuthor(fields) {
  const name = getText(fields, 'author', DEFAULTS.author);
  const role = getText(fields, 'role', DEFAULTS.role);
  if (!name && !role) return null;

  const author = document.createElement('footer');
  author.className = 'herobanner__author';
  if (name) author.append(createTextElement('p', 'herobanner__author-name', name));
  if (role) author.append(createTextElement('p', 'herobanner__author-role', role));
  return author;
}

function createBackground(fields) {
  const background = document.createElement('div');
  background.className = 'herobanner__background';
  background.setAttribute('aria-hidden', 'true');

  const image = fields[normalizeFieldName('backgroundImage')]?.querySelector('picture, img');
  if (image) {
    const media = image.closest('picture') || image;
    media.classList.add('herobanner__background-image');
    media.querySelector?.('img')?.setAttribute('alt', '');
    background.append(media);
  }

  return background;
}

export default function decorate(block) {
  const fields = getFields(block);
  const hero = document.createElement('section');
  hero.className = 'herobanner__hero';
  hero.setAttribute('aria-label', 'Research report');

  const content = document.createElement('div');
  content.className = 'herobanner__content';
  content.append(
    createMeta(fields),
    createTextElement('p', 'herobanner__publication', getText(fields, 'publishDate', DEFAULTS.publishDate)),
    createHeading(fields),
    createSubtitle(fields),
  );

  const cta = createCallToAction(fields);
  const author = createAuthor(fields);
  if (cta) content.append(cta);
  if (author) content.append(author);

  hero.append(createBackground(fields), content);
  block.replaceChildren(hero);
}
