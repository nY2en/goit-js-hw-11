import axios from 'axios';

export default class ImgApiService {
  constructor() {
    this.searchQuery = 'sfdsfsfs';
    this.page = 1;
  }

  async fetchImg() {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParams = new URLSearchParams({
      key: '35659407-8f84b6661cf33c90047b65b03',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: this.searchQuery,
      per_page: 40,
      page: this.page,
    });
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(query) {
    this.searchQuery = query;
  }
}
