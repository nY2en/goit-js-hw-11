import { Notify } from 'notiflix';
import ImgApiService from './img-api-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadmoreBtn: document.querySelector('.btnLoadMore'),
};

refs.form.addEventListener('submit', onFormChange);

refs.loadmoreBtn.addEventListener('click', fetchImgs);

const api = new ImgApiService();

function onFormChange(e) {
  e.preventDefault();
  const currentSearch = e.currentTarget.elements.searchQuery.value;
  if (currentSearch !== api.query) {
    refs.gallery.innerHTML = '';
    api.resetPage();
  }

  api.query = currentSearch;

  fetchImgs();
}

function fetchImgs() {
  api.fetchImg().then(data => {
    if (data.hits.length === 0 && api.page !== 1) {
      refs.loadmoreBtn.classList.add('hide');
      Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      return;
    }

    if (data.hits.length === 0) {
      if (!refs.loadmoreBtn.classList.contains('hide')) {
        refs.loadmoreBtn.classList.add('hide');
      }

      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }

    refs.loadmoreBtn.classList.remove('hide');

    if (data.hits.length === 0 && api.page !== 1) {
      Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      refs.loadmoreBtn.classList.add('hide');
      return;
    }
    if (40 * api.page > data.totalHits && api.page !== 1) {
      Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      refs.loadmoreBtn.classList.add('hide');
    }

    if (api.page === 1) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    refs.gallery.insertAdjacentHTML('beforeend', createCardsMarkup(data.hits));
    api.incrementPage();
  });
}

function createCardsMarkup(cards) {
  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                <div class="info">
                    <p class="info-item">
                        <b>Likes <br> ${likes}</b>
                    </p>
                    <p class="info-item">
                        <b>Views <br> ${views}</b>
                    </p>
                    <p class="info-item">
                        <b>Comments <br> ${comments}</b>
                    </p>
                    <p class="info-item">
                        <b>Downloads <br> ${downloads}</b>
                    </p>
                </div>
        </div>`
    )
    .join('');
}
