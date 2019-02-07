import { SelectableBehavior } from './behavior';
import { SelectableController } from './controller';

export type BehaviorMode = 'list' | 'checked-list' | 'single';
export type BehaviorFactory = (controller: SelectableController) => SelectableBehavior;

export interface SelectableOptions {
  zone: string | HTMLElement;
  elements: string;
  selectedClass: string;
  behavior: BehaviorMode | BehaviorFactory;
}

export const defaults: SelectableOptions = {
  zone: '#wrapper',
  elements: 'a',
  selectedClass: 'active',
  behavior: 'list'
};
