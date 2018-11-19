import { SelectableBehavior } from './behavior';
import { SelectableController } from './controller';

export class CheckedListBehavior implements SelectableBehavior {
  constructor(private _controller: SelectableController) { }

  onMouseDown(e: MouseEvent) {
    this._controller.createSelectionRectangle(e.pageX, e.pageY);
  }

  onMouseMove(e: MouseEvent) { }

  onMouseUp(e: MouseEvent) {
    this._controller.items
      .filter(el => this._controller.intersects(el))
      .forEach(el => this._controller.toggleItem(el));
  }
}
