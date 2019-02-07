# SelectableTS [![NPM version](https://badge.fury.io/js/selectable-ts.svg)](http://badge.fury.io/js/selectable-ts)

A TypeScript library for adding drag select functionality. Based on [p34eu/selectables](https://github.com/p34eu/selectables).

## Usage

``` typescript
  const selectable = new Selectable({
    zone: '#select-list', // The boundary element of the selectable functionality.
    selectedClass: 'active', // The CSS class to add to selected items.
    elements: '.list-group-item', // A query selector for the selectable elements.
    behavior: 'single' // The way the selection behavior works.
  });

  selectable.start.subscribe(_ => console.log('Selection started...'));
  selectable.select.subscribe(e => console.log('Element selected...', e.innerText));
  selectable.deselect.subscribe(e => console.log('Element deselected...', e.innerText));
  selectable.stop.subscribe(_ => console.log('Selection stopped...'));
  selectable.change.subscribe((e: ChangeEvent) => {
    console.log('Selection changed...', e.index, e.element.innerText, e.selected);
  });
```
### Options

#### zone (optional, default='#wrapper')
This is a query selector or an element that defines the operable area/boundary in which the functionality is enabled. For example, if you're creating a selectable list of `li` elements, the zone would be the `ul` tag that encloses them.

#### selectedClass (optional, default='active')
This is the CSS class that's added to any selected items for styling.

#### elements (optional, default='a')
This is the query selector that will be used to determine which elements inside the zone element are selectable.

#### behavior (optional, default='list')
This defines the type of behavior the selectable list will have. There are three provided options:

* `list`: Similar to something like Windows Explorer. Multiple items can be chosen. Ctrl and Shift can be used as selection modifiers.
* `checked-list`: Each selection rectangle toggles the items contained within it.
* `single`: Only one element at a time can be selected.

As well as these built-in behaviors, custom behaviors can be provided through a factory function, for example:

```typescript
  export class CustomBehavior implements SelectableBehavior {
    constructor(private _controller: SelectableController) { }
    onMouseDown(e: MouseEvent) {
      const itemUnderCursor = this._controller.getItemAtPosition(e.pageX, e.pageY);
      this._controller.items.forEach(i => {
        this._controller.setItemSelected(i, i === itemUnderCursor);
      });
    }
    onMouseMove(e: MouseEvent) { }
    onMouseUp(e: MouseEvent) { }
  }

  const selectable = new Selectable({
    behavior: controller => new CustomBehavior(controller)
  });
```