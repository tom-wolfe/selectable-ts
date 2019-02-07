import { Selectable, ChangeEvent } from '../src';

document.addEventListener('DOMContentLoaded', function () {
  const foo = new Selectable({
    elements: 'a',
    selectedClass: 'active',
    zone: document.getElementById('selectlist'),
    behavior: 'single'
  });

  foo.start.subscribe(_ => console.log('Selection started...'));
  foo.select.subscribe(e => console.log('Element selected...', e.innerText));
  foo.deselect.subscribe(e => console.log('Element deselected...', e.innerText));
  foo.stop.subscribe(_ => console.log('Selection stopped...'));
  foo.change.subscribe((e: ChangeEvent) => {
    console.log('Selection changed...', e.index, e.element.innerText, e.selected);
  });
});
