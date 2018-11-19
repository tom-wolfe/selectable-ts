import { CheckedListBehavior } from './behavior-check';
import { ListBehavior } from './behavior-list';
import { SelectableController } from './controller';
import { BehaviorMode } from './options';

export interface SelectableBehavior {
  onMouseDown(e: MouseEvent);
  onMouseMove(e: MouseEvent);
  onMouseUp(e: MouseEvent);
}

export function createBehavior(type: BehaviorMode, controller: SelectableController) {
  switch (type) {
    case 'list': return new ListBehavior(controller);
    case 'checked-list': return new CheckedListBehavior(controller);
    default: return new ListBehavior(controller);
  }
}
