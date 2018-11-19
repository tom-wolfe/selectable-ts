import { SelectableBehavior } from './behaviour';
import { SelectableController } from './controller';

export class ListBehavior implements SelectableBehavior {
  constructor(private _controller: SelectableController) { }

  onMouseDown(e: MouseEvent) {
    const curEl = this._controller.getItemAtPosition(e.pageX, e.pageY);

    if (e['ctrlKey']) {
      if (curEl) {
        this._controller.toggleItem(curEl);
      }
    } else {
      this._controller.items.forEach(el => {
        this._controller.toggleItem(el, el === curEl);
      });
      this._controller.createSelectionRectangle(e.pageX, e.pageY);
    }
  }

  onMouseMove(e: MouseEvent) {
    this._controller.items.forEach(el => {
      this._controller.toggleItem(el, this._controller.intersects(el));
    });
  }

  onMouseUp(e: MouseEvent) {
    if (!e['ctrlKey']) {
      this._controller.items.forEach(el => {
        if (this._controller.intersects(el)) {
          this._controller.selectItem(el);
        }
      });
    }
  }

}
