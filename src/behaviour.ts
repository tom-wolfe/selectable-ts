import { SelectableController } from 'controller';
import { ListBehavior } from './behaviour-list';

export interface SelectableBehavior {
  onMouseDown(e: MouseEvent);
  onMouseMove(e: MouseEvent);
  onMouseUp(e: MouseEvent);
}

export function createBehavior(type: string, controller: SelectableController) {
  switch (type) {
    default: return new ListBehavior(controller);
  }
}
