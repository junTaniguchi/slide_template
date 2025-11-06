/**
 * Optional helper to preload slide data without using the data-slide-data attribute.
 *
 * Call `window.loadSlideData('slides.json')` before DOMContentLoaded,
 * or leave <body data-slide-data="slides.json"> in place and this script will fetch automatically.
 */
(function () {
  function applyDataSource(url) {
    if (!url) return;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        window.SLIDE_DATA = json;
      })
      .catch((error) => {
        console.warn('slide data fetch error', error);
      });
  }

  window.loadSlideData = applyDataSource;

  if (document?.body?.dataset?.slideData) {
    applyDataSource(document.body.dataset.slideData);
  }
})();
