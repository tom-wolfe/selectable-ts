# SelectableTS
A TypeScript library for adding drag select functionality. Based on [p34eu/selectables](https://github.com/p34eu/selectables).

## Usage

``` typescript
  const foo = new Selectable({
    zone: '#selected'
    selectedClass: 'active',
    elements: 'a',
  });

  foo.start.subscribe(_ => console.log('Selection started...'));
  foo.select.subscribe(e => console.log('Element selected...', e.innerText));
  foo.deselect.subscribe(e => console.log('Element deselected...', e.innerText));
  foo.stop.subscribe(i => console.log('Selection stopped...', i.length));
```
