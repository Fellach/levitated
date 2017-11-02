import './index.scss';

class AppController {
  /** @ngInject */
  constructor(model) {
    this.model = model;
    this.model
      .getNationalities() // get nationalities of writers
      .then(nationalities => {
        this.nationalities = nationalities;
      });

    this.model
      .getWritersAndBooks()  // get all writers and books
      .then(this.setWritersAndBooks.bind(this));

    this.writersColumns = [
      {key: 'id', label: 'ID'},
      {key: 'name', label: 'Name'},
      {key: 'nationality', label: 'Nationality'},
      {key: 'books', label: 'Number of Books', onclick: this.onClickBooks.bind(this)}
    ];

    this.booksColumns = [
      {key: 'id', label: 'ID'},
      {key: 'title', label: 'Title'},
      {key: 'author', label: 'Author'},
      {key: 'year', label: 'Year'}
    ];

    this.filterWriter = null;
    this.filterNationality = null;
  }

  // filter books table by clicked writer
  onClickBooks(writer) {
    this.filterWriter = `Books of ${writer.name}`;
    this.model
      .filterByWriter(writer)
      .then(books => {
        this.books = books;
      });
  }

  // filter both tables by changed nationality
  onChangeNationality(nationality) {
    this.filterWriter = null;
    this.filterNationality = nationality;
    this.model
      .filterByNationality(nationality)
      .then(this.setWritersAndBooks.bind(this));
  }

  // clear nationality filter
  onClearNationality() {
    this.filterWriter = null;
    this.filterNationality = null;
    this.model
      .getUnfiltered()
      .then(this.setWritersAndBooks.bind(this));
  }

  // reset filter by author
  onClearWriterFilter() {
    this.filterWriter = null;
    if (this.filterNationality) {
      this.model
        .filterByNationality(this.filterNationality)
        .then(this.setWritersAndBooks.bind(this));
    } else {
      this.model
        .getUnfiltered()
        .then(this.setWritersAndBooks.bind(this));
    }
  }

  // callback for arrays of objects writer and books
  setWritersAndBooks(writersAndBooks) {
    this.writers = writersAndBooks.writers;
    this.books = writersAndBooks.books;
  }
}

export const App = {
  template: require('./index.html'),
  controller: AppController
};
