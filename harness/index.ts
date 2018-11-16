import { Selectable } from '../src';

document.addEventListener('DOMContentLoaded', function () {
  const foo = new Selectable({
    elements: 'a',
    selectedClass: 'active',
    zone: document.getElementById('selectlist')
  });

  foo.start.subscribe(_ => console.log('Selection started...'));
  foo.select.subscribe(e => console.log('Element selected...', e.innerText));
  foo.deselect.subscribe(e => console.log('Element deselected...', e.innerText));
  foo.stop.subscribe(i => console.log('Selection stopped...', i.length));
});
