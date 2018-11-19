import { SelectableBehavior } from './behavior';

export type BehaviorMode = 'list' | 'checked-list';

export interface SelectableOptions {
  zone: string | HTMLElement;
  elements: string;
  selectedClass: string;
  behavior: BehaviorMode | SelectableBehavior;
}

export const defaults: SelectableOptions = {
  zone: '#wrapper',
  elements: 'a',
  selectedClass: 'active',
  behavior: 'list'
};
