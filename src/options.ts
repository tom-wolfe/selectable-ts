export interface SelectableOptions {
  zone: string | HTMLElement;
  elements: string;
  selectedClass: string;
}

export const defaults: SelectableOptions = {
  zone: '#wrapper',
  elements: 'a',
  selectedClass: 'active'
};
