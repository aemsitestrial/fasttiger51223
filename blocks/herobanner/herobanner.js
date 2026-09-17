function getRowText(row) {
  if (!row) return '';
  return row.textContent.trim();
}

function getRowLink(row) {
  if (!row) return null;
  const a = row.querySelector('a');
  if (a) return a.getAttribute('href');
  const text = getRowText(row);
  return text || null;
}

function getRowImage(row) {
  if (!row) return null;
  return row.querySelector('img');
}

function getRowRichText(row) {
  if (!row) return '';
  return row.innerHTML.trim();
}

export default function decorate(block) {
  const rows = [...block.children];

  const [
    labelRow,
    categoryRow,
    readTimeRow,
    publishDateRow,
    titleRow,
    subtitleRow,
    ctaTextRow,
    ctaLinkRow,
    authorRow,
    roleRow,
    backgroundImageRow,
  ] = rows;

  const label = getRowText(labelRow) || 'RESEARCH';
  const category = getRowText(categoryRow);
  const readTime = getRowText(readTimeRow);
  const publishDate = getRowText(publishDateRow);
  const titleHTML = getRowRichText(titleRow);
  const subtitle = getRowText(subtitleRow);
  const ctaText = getRowText(ctaTextRow) || 'Read Report';
  const ctaHref = getRowLink(ctaLinkRow) || getRowLink(ctaTextRow) || '#';
  const author = getRowText(authorRow);
  const role = getRowText(roleRow);
  const bgImg = getRowImage(backgroundImageRow);

  const section = document.createElement('div');
  section.className = 'enterprise-hero-inner';

  const bgLayer = document.createElement('div');
  bgLayer.className = 'enterprise-hero-background';

  if (bgImg) {
    const picture = bgImg.closest('picture');
    if (picture) {
      picture.classList.add('enterprise-hero-bg-image');
      bgLayer.append(picture);
    }
  }

  const bgPattern = document.createElement('div');
  bgPattern.className = 'enterprise-hero-pattern';
  bgPattern.setAttribute('aria-hidden', 'true');
  bgLayer.append(bgPattern);

  const bgGradient = document.createElement('div');
  bgGradient.className = 'enterprise-hero-gradient';
  bgGradient.setAttribute('aria-hidden', 'true');
  bgLayer.append(bgGradient);

  const content = document.createElement('div');
  content.className = 'enterprise-hero-content';

  const meta = document.createElement('div');
  meta.className = 'enterprise-hero-meta';

  if (label) {
    const pill = document.createElement('span');
    pill.className = 'enterprise-hero-pill';
    pill.textContent = label;
    meta.append(pill);
  }

  if (category) {
    const cat = document.createElement('span');
    cat.className = 'enterprise-hero-category';
    cat.textContent = category;
    meta.append(cat);
  }

  if (readTime) {
    const rt = document.createElement('span');
    rt.className = 'enterprise-hero-readtime';
    rt.textContent = readTime;
    meta.append(rt);
  }

  content.append(meta);

  if (publishDate) {
    const pub = document.createElement('p');
    pub.className = 'enterprise-hero-publish';
    pub.textContent = publishDate;
    content.append(pub);
  }

  const heading = document.createElement('h1');
  heading.className = 'enterprise-hero-title';
  heading.innerHTML = titleHTML;
  content.append(heading);

  if (subtitle) {
    const sub = document.createElement('p');
    sub.className = 'enterprise-hero-subtitle';
    sub.textContent = subtitle;
    content.append(sub);
  }

  if (ctaText) {
    const cta = document.createElement('a');
    cta.className = 'enterprise-hero-cta';
    cta.href = ctaHref;
    cta.setAttribute('aria-label', ctaText);

    const ctaLabel = document.createElement('span');
    ctaLabel.className = 'enterprise-hero-cta-label';
    ctaLabel.textContent = ctaText;

    const ctaArrow = document.createElement('span');
    ctaArrow.className = 'enterprise-hero-cta-arrow';
    ctaArrow.setAttribute('aria-hidden', 'true');
    ctaArrow.textContent = '→';

    cta.append(ctaLabel, ctaArrow);
    content.append(cta);
  }

  if (author || role) {
    const authorWrap = document.createElement('div');
    authorWrap.className = 'enterprise-hero-author';

    const divider = document.createElement('span');
    divider.className = 'enterprise-hero-author-divider';
    divider.setAttribute('aria-hidden', 'true');
    authorWrap.append(divider);

    const authorInfo = document.createElement('div');
    authorInfo.className = 'enterprise-hero-author-info';

    if (author) {
      const name = document.createElement('p');
      name.className = 'enterprise-hero-author-name';
      name.textContent = author;
      authorInfo.append(name);
    }

    if (role) {
      const roleEl = document.createElement('p');
      roleEl.className = 'enterprise-hero-author-role';
      roleEl.textContent = role;
      authorInfo.append(roleEl);
    }

    authorWrap.append(authorInfo);
    content.append(authorWrap);
  }

  section.append(bgLayer, content);

  block.textContent = '';
  block.append(section);
}
