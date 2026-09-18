function getCardsPerView() {
  if (window.innerWidth >= 1200) {
    return 3;
  }
  if (window.innerWidth >= 768) {
    return 2;
  }
  return 1;
}

/**
 * Helper to preserve existing UE data attributes from authoring markup
 */
function moveAueAttributes(fromEl, toEl) {
  if (!fromEl || !toEl) return;
  [...fromEl.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      toEl.setAttribute(attr.name, attr.value);
    }
  });
}

export default function decorate(block) {
  // 1. Mark outer block for Universal Editor
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-model', 'carousel');
  block.setAttribute('data-aue-label', 'Carousel Block');

  const rows = [...block.children];
  if (!rows.length) return;

  // Header row elements
  const headerRow = rows.shift();
  const headerCells = [...headerRow.children];

  const sectionTitleEl = headerCells[0];
  const viewAllTextEl = headerCells[1];
  const viewAllLinkEl = headerCells[2];

  const sectionTitle = sectionTitleEl?.textContent?.trim() || '';
  const viewAllText = viewAllTextEl?.textContent?.trim() || '';
  const viewAllLink = viewAllLinkEl?.textContent?.trim() || '';

  // Card row items
  const items = rows.map((row) => {
    const cells = [...row.children];
    return {
      rowEl: row,
      mediaEl: cells[0],
      tagEl: cells[1],
      categoryEl: cells[2],
      readTimeEl: cells[3],
      titleEl: cells[4],
      descriptionEl: cells[5],
      buttonTextEl: cells[6],
      buttonLinkEl: cells[7],
    };
  });

  // Clear original markup
  block.textContent = '';

  const wrapper = document.createElement('section');
  wrapper.className = 'carousell-container';

  // --- Header Section ---
  const header = document.createElement('div');
  header.className = 'carousell-header';

  const heading = document.createElement('h2');
  heading.className = 'carousell-title';
  heading.textContent = sectionTitle;
  heading.setAttribute('data-aue-prop', 'sectionTitle');
  heading.setAttribute('data-aue-type', 'text');
  heading.setAttribute('data-aue-label', 'Section Title');
  moveAueAttributes(sectionTitleEl, heading);
  header.append(heading);

  if (viewAllText || viewAllLink) {
    const viewAll = document.createElement('a');
    viewAll.className = 'carousell-view-all';
    viewAll.href = viewAllLink || '#';
    viewAll.textContent = viewAllText;
    viewAll.setAttribute('data-aue-prop', 'viewAllText');
    viewAll.setAttribute('data-aue-type', 'text');
    viewAll.setAttribute('data-aue-label', 'View All Link Text');
    moveAueAttributes(viewAllTextEl, viewAll);
    header.append(viewAll);
  }

  // --- Carousel Body ---
  const carousel = document.createElement('div');
  carousel.className = 'carousell';
  carousel.setAttribute('aria-label', sectionTitle || 'Carousel');
  carousel.setAttribute('aria-live', 'polite');
  carousel.setAttribute('aria-roledescription', 'carousel');

  const viewport = document.createElement('div');
  viewport.className = 'carousell-viewport';

  const track = document.createElement('div');
  track.className = 'carousell-track';

  // --- Render Slides ---
  items.forEach((item, index) => {
    const slide = document.createElement('article');
    slide.className = 'carousell-slide';
    // Instrument individual slide item for UE reordering/editing
    slide.setAttribute('data-aue-type', 'component');
    slide.setAttribute('data-aue-model', 'carousel-item');
    slide.setAttribute('data-aue-label', `Card Item ${index + 1}`);
    moveAueAttributes(item.rowEl, slide);
    const card = document.createElement('div');
    card.className = 'carousell-card';

    // Image / Media
    const mediaNode = item.mediaEl?.querySelector('picture, img');
    if (mediaNode) {
      const mediaWrapper = document.createElement('div');
      mediaWrapper.className = 'carousell-media';
      const clonedMedia = mediaNode.cloneNode(true);
      mediaWrapper.append(clonedMedia);
      mediaWrapper.setAttribute('data-aue-prop', 'image');
      mediaWrapper.setAttribute('data-aue-type', 'media');
      mediaWrapper.setAttribute('data-aue-label', 'Card Image');
      moveAueAttributes(item.mediaEl, mediaWrapper);
      card.append(mediaWrapper);
    }

    // Meta (Tag, Category, Read Time)
    const meta = document.createElement('div');
    meta.className = 'carousell-meta';

    if (item.tagEl?.textContent?.trim()) {
      const tag = document.createElement('span');
      tag.className = 'carousell-tag';
      tag.textContent = item.tagEl.textContent.trim();
      tag.setAttribute('data-aue-prop', 'tag');
      tag.setAttribute('data-aue-type', 'text');
      moveAueAttributes(item.tagEl, tag);
      meta.append(tag);
    }

    if (item.categoryEl?.textContent?.trim()) {
      const category = document.createElement('span');
      category.className = 'carousell-category';
      category.textContent = item.categoryEl.textContent.trim();
      category.setAttribute('data-aue-prop', 'category');
      category.setAttribute('data-aue-type', 'text');
      moveAueAttributes(item.categoryEl, category);
      meta.append(category);
    }

    if (item.readTimeEl?.textContent?.trim()) {
      const readTime = document.createElement('span');
      readTime.className = 'carousell-read-time';
      readTime.textContent = item.readTimeEl.textContent.trim();
      readTime.setAttribute('data-aue-prop', 'readTime');
      readTime.setAttribute('data-aue-type', 'text');
      moveAueAttributes(item.readTimeEl, readTime);
      meta.append(readTime);
    }

    card.append(meta);

    // Title
    if (item.titleEl?.textContent?.trim()) {
      const title = document.createElement('h3');
      title.className = 'carousell-card-title';
      title.textContent = item.titleEl.textContent.trim();
      title.setAttribute('data-aue-prop', 'title');
      title.setAttribute('data-aue-type', 'text');
      moveAueAttributes(item.titleEl, title);
      card.append(title);
    }

    // Description
    if (item.descriptionEl?.textContent?.trim()) {
      const description = document.createElement('p');
      description.className = 'carousell-description';
      description.textContent = item.descriptionEl.textContent.trim();
      description.setAttribute('data-aue-prop', 'description');
      description.setAttribute('data-aue-type', 'richtext');
      moveAueAttributes(item.descriptionEl, description);
      card.append(description);
    }

    // Button / Link
    if (item.buttonTextEl?.textContent?.trim() || item.buttonLinkEl?.textContent?.trim()) {
      const button = document.createElement('a');
      button.className = 'carousell-link';
      button.href = item.buttonLinkEl?.textContent?.trim() || '#';
      button.textContent = item.buttonTextEl?.textContent?.trim() || 'Learn More';
      button.setAttribute('data-aue-prop', 'buttonText');
      button.setAttribute('data-aue-type', 'text');
      moveAueAttributes(item.buttonTextEl, button);
      card.append(button);
    }

    slide.append(card);
    track.append(slide);
  });

  viewport.append(track);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'carousell-controls';

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.className = 'carousell-prev';
  previousButton.setAttribute('aria-label', 'Previous slides');
  previousButton.textContent = '← Previous';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'carousell-next';
  nextButton.setAttribute('aria-label', 'Next slides');
  nextButton.textContent = 'Next →';

  controls.append(previousButton, nextButton);

  carousel.append(viewport);
  wrapper.append(header, carousel, controls);
  block.append(wrapper);

  // --- Navigation Logic ---
  let currentIndex = 0;

  const updateCarousel = () => {
    const visibleCards = getCardsPerView();
    const maxIndex = Math.max(0, items.length - visibleCards);

    currentIndex = Math.min(currentIndex, maxIndex);
    const translate = (100 / visibleCards) * currentIndex;

    track.style.transform = `translateX(-${translate}%)`;

    previousButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= maxIndex;
  };

  const next = () => {
    const visibleCards = getCardsPerView();
    const maxIndex = Math.max(0, items.length - visibleCards);
    if (currentIndex < maxIndex) {
      currentIndex += 1;
      updateCarousel();
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  };

  previousButton.addEventListener('click', previous);
  nextButton.addEventListener('click', next);

  // Keyboard navigation
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') previous();
  });

  // Touch / Swipe
  let startX = 0;
  viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const delta = startX - endX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) next();
    else previous();
  }, { passive: true });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
