class HeaderController { }

export const Header = {
  template: require('./header.html'),
  controller: HeaderController,
  bindings: {
    nationalities: '<',
    nationality: '<',
    onChange: '&',
    onClear: '&'
  }
};
