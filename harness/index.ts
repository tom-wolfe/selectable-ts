import { Selectable } from '../src';

document.addEventListener('DOMContentLoaded', function () {
  var foo = new Selectable({
    elements: 'a',
    selectedClass: 'active',
    zone: document.getElementById('selectlist')
  });
});
