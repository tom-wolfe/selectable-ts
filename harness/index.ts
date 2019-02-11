import { Selectable, ChangeEvent } from '../src';

document.addEventListener('DOMContentLoaded', function () {
  const zone = document.getElementById('selectlist');
  
  for (let x = 0; x < 1000; x++) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'list-group-item';
    a.innerText = 'List Item #' + x.toString();
    zone.appendChild(a);
  }
  
  const foo = new Selectable({
    elements: 'a',
    selectedClass: 'active',
    zone,
    behavior: 'checked-list'
  });

  foo.start.subscribe(_ => console.log('Selection started...'));
  foo.select.subscribe(e => console.log('Element selected...', e.innerText));
  foo.deselect.subscribe(e => console.log('Element deselected...', e.innerText));
  foo.stop.subscribe(_ => console.log('Selection stopped...'));
  foo.change.subscribe((e: ChangeEvent) => {
    console.log('Selection changed...', e.index, e.element.innerText, e.selected);
  });
});
