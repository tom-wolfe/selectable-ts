export interface SelectableOptions {
  zone: string; // ID of the element with selectables.
  elements: string; // items to be selectable .list-group, #id > .class,'htmlelement' - valid querySelectorAll
  selectedClass: string; // class name to apply to selected items
  enabled: boolean; // false to .enable() at later time
  start: (e: Event) => boolean; // event on selection start
  stop: (e: Event) => void; // event on selection end
  onSelect: (el: Element) => void; // event fired on every item when selected.
  onDeselect: (el: Element) => void; // event fired on every item when selected.
}

export const defaults: SelectableOptions = {
  zone: '#wrapper',
  elements: 'a',
  selectedClass: 'active',
  enabled: true,
  start: null,
  stop: null,
  onSelect: null,
  onDeselect: null
};
