import { SelectableBehavior } from './behavior';
import { SelectableController } from './controller';

type SelectMode = 'toggle' | 'add' | 'normal';

export class ListBehavior implements SelectableBehavior {
  private _mode: SelectMode;

  constructor(private _controller: SelectableController) { }

  private getMode(e: MouseEvent): SelectMode {
    if (e['ctrlKey']) { return 'toggle'; }
    if (e['shiftKey']) { return 'add'; }
    return 'normal';
  }

  onMouseDown(e: MouseEvent) {
    const curEl = this._controller.getItemAtPosition(e.pageX, e.pageY);
    this._mode = this.getMode(e);
    switch (this._mode) {
      case 'toggle': {
        if (curEl) { this._controller.toggleItem(curEl); }
        break;
      }
      case 'add': {
        if (curEl) { this._controller.selectItem(curEl); }
        this._controller.createSelectionRectangle(e.pageX, e.pageY);
        break;
      }
      default: {
        this._controller.items.forEach(el => this._controller.toggleItem(el, el === curEl));
        this._controller.createSelectionRectangle(e.pageX, e.pageY);
        break;
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    this._controller.items.forEach(el => {
      switch (this._mode) {
        case 'add': {
          if (this._controller.intersects(el)) { this._controller.selectItem(el); }
          break;
        }
        default: {
          this._controller.toggleItem(el, this._controller.intersects(el));
          break;
        }
      }
    });
  }

  onMouseUp(e: MouseEvent) {
    if (this._mode === 'normal') {
      this._controller.items
        .filter(el => this._controller.intersects(el))
        .forEach(el => this._controller.selectItem(el));
    }
    this._mode = undefined;
  }

}
