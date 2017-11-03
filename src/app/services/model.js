import {URL_WRITERS, URL_BOOKS} from '../constans/url';

/**
 * Writers and Books service, calling API, filtering
 */
export class Model {
  /** @ngInject */
  constructor($http, $log, $q, $timeout) {
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.$timeout = $timeout;

    this.unfiltered = null;
    this.nationalitiesDeferred = $q.defer();
  }

  // call api and get data
  getWritersAndBooks() {
    const writersDeferred = this.$http.get(URL_WRITERS);
    const booksDeferred = this.$http.get(URL_BOOKS);
    return this.$q
      .all([writersDeferred, booksDeferred])
      .then(this.onGetWritersAndBooks.bind(this), this.onError.bind(this));
  }

  // return asynchronously existing nationalities
  getNationalities() {
    return this.nationalitiesDeferred.promise;
  }

  // return books asynchronously filtered by nationality
  filterByWriter(writer) {
    const deferred = this.$q.defer();
    this.$timeout(() => {
      const books = this.unfiltered.books.filter(book => book.author_id === writer.id);
      deferred.resolve(books);
    });
    return deferred.promise;
  }

  // return books and writers asynchronously filtered by nationality
  filterByNationality(nationality) {
    const deferred = this.$q.defer();
    this.$timeout(() => {
      const writers = this.unfiltered.writers.filter(writer => writer.nationality === nationality);
      const books = this.unfiltered.books.filter(book => writers.find(writer => book.author_id === writer.id));
      deferred.resolve({
        writers,
        books
      });
    });
    return deferred.promise;
  }

  // return cached books and writers
  getUnfiltered() {
    const deferred = this.$q.defer();
    this.$timeout(() => {
      const writers = [...this.unfiltered.writers];
      const books = [...this.unfiltered.books];
      deferred.resolve({
        writers,
        books
      });
    });
    return deferred.promise;
  }

  // $http success callback
  onGetWritersAndBooks(responses) {
    this.unfiltered = processData(responses);
    const nationalities = shellNationalities(this.unfiltered.writers);
    this.nationalitiesDeferred.resolve(nationalities);
    return this.unfiltered;
  }

  // $http error callback
  onError(error) {
    this.$log.error(error.data);
    return [];
  }
}

// helper methods ////////////////////

// get data from responses: [0] - writers, [1] - books
function processData(responses) {
  return {
    writers: processWriters(responses[0].data, responses[1].data),
    books: processBooks(responses[1].data, responses[0].data)
  };
}

// create array of writer objects for table directive
function processWriters(writers, books) {
  return writers.map(writer => {
    return {
      id: writer.id,
      name: `${writer.first_name} ${writer.last_name}`,
      nationality: writer.nationality,
      books: books.filter(book => book.author_id === writer.id).length
    };
  });
}

// create array of book objects for table directive
function processBooks(books, writers) {
  return books.map(book => {
    const author = writers.find(writer => writer.id === book.author_id);
    if (author) {
      book = angular.extend({}, book, {
        author: `${author.first_name} ${author.last_name}`
      });
    }
    return book;
  });
}

// Get nationalities from the writers and return unique values
function shellNationalities(writers) {
  const nationalities = writers.map(writer => writer.nationality);
  return [...new Set(nationalities)];
}
