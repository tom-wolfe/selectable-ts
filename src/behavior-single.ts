import { SelectableBehavior } from './behavior';
import { SelectableController } from './controller';

export class SingleBehavior implements SelectableBehavior {
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
