function getCardsPerView() {
  if (window.innerWidth >= 1200) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
}

export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) {
    return;
  }

  const headerRow = rows.shift();

  const headerCells = [...headerRow.children];

  const sectionTitle = headerCells[0]?.textContent?.trim() || '';
  const viewAllText = headerCells[1]?.textContent?.trim() || '';
  const viewAllLink = headerCells[2]?.textContent?.trim() || '';

  const items = rows.map((row) => {
    const cells = [...row.children];

    return {
      media: cells[0]?.querySelector('picture, img'),
      tag: cells[1]?.textContent?.trim() || '',
      category: cells[2]?.textContent?.trim() || '',
      readTime: cells[3]?.textContent?.trim() || '',
      title: cells[4]?.textContent?.trim() || '',
      description: cells[5]?.textContent?.trim() || '',
      buttonText: cells[6]?.textContent?.trim() || '',
      buttonLink: cells[7]?.textContent?.trim() || '',
    };
  });

  block.textContent = '';

  const wrapper = document.createElement('section');
  wrapper.className = 'carousell-container';

  const header = document.createElement('div');
  header.className = 'carousell-header';

  const heading = document.createElement('h2');
  heading.className = 'carousell-title';
  heading.textContent = sectionTitle;

  header.append(heading);

  if (viewAllText && viewAllLink) {
    const viewAll = document.createElement('a');
    viewAll.className = 'carousell-view-all';
    viewAll.href = viewAllLink;
    viewAll.textContent = viewAllText;
    header.append(viewAll);
  }

  const carousel = document.createElement('div');
  carousel.className = 'carousell';
  carousel.setAttribute('aria-label', sectionTitle || 'Carousel');
  carousel.setAttribute('aria-live', 'polite');
  carousel.setAttribute('aria-roledescription', 'carousell');

  const viewport = document.createElement('div');
  viewport.className = 'carousell-viewport';

  const track = document.createElement('div');
  track.className = 'carousell-track';

  items.forEach((item) => {
    const slide = document.createElement('article');
    slide.className = 'carousell-slide';

    const card = document.createElement('div');
    card.className = 'carousell-card';

    if (item.media) {
      const mediaWrapper = document.createElement('div');
      mediaWrapper.className = 'carousell-media';
      mediaWrapper.append(item.media.cloneNode(true));
      card.append(mediaWrapper);
    }

    const meta = document.createElement('div');
    meta.className = 'carousell-meta';

    if (item.tag) {
      const tag = document.createElement('span');
      tag.className = 'carousell-tag';
      tag.textContent = item.tag;
      meta.append(tag);
    }

    if (item.category) {
      const category = document.createElement('span');
      category.className = 'carousell-category';
      category.textContent = item.category;
      meta.append(category);
    }

    if (item.readTime) {
      const readTime = document.createElement('span');
      readTime.className = 'carousell-read-time';
      readTime.textContent = item.readTime;
      meta.append(readTime);
    }

    card.append(meta);

    if (item.title) {
      const title = document.createElement('h3');
      title.className = 'carousell-card-title';
      title.textContent = item.title;
      card.append(title);
    }

    if (item.description) {
      const description = document.createElement('p');
      description.className = 'carousell-description';
      description.textContent = item.description;
      card.append(description);
    }

    if (item.buttonText && item.buttonLink) {
      const button = document.createElement('a');
      button.className = 'carousell-link';
      button.href = item.buttonLink;
      button.textContent = item.buttonText;
      card.append(button);
    }

    slide.append(card);
    track.append(slide);
  });

  viewport.append(track);

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

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      next();
    }

    if (event.key === 'ArrowLeft') {
      previous();
    }

    if (event.key === ' ' || event.key === 'Enter') {
      const target = document.activeElement;

      if (target === nextButton) {
        event.preventDefault();
        next();
      }

      if (target === previousButton) {
        event.preventDefault();
        previous();
      }
    }
  });

  let startX = 0;

  viewport.addEventListener(
    'touchstart',
    (event) => {
      startX = event.touches[0].clientX;
    },
    { passive: true },
  );

  viewport.addEventListener(
    'touchend',
    (event) => {
      const endX = event.changedTouches[0].clientX;
      const delta = startX - endX;

      if (Math.abs(delta) < 40) {
        return;
      }

      if (delta > 0) {
        next();
      } else {
        previous();
      }
    },
    { passive: true },
  );

  window.addEventListener('resize', updateCarousel);

  updateCarousel();
}