export interface SelectableOptions {
  zone: string | HTMLElement;
  elements: string;
  selectedClass: string;
  behaviourMode: 'list' | 'checked-list';
}

export const defaults: SelectableOptions = {
  zone: '#wrapper',
  elements: 'a',
  selectedClass: 'active',
  behaviourMode: 'list'
};
