export interface SelectableOptions {
  zone: string | HTMLElement; // ID of the element with selectables.
  elements: string; // items to be selectable .list-group, #id > .class,'htmlelement' - valid querySelectorAll
  selectedClass: string; // class name to apply to selected items
}

export const defaults: SelectableOptions = {
  zone: '#wrapper',
  elements: 'a',
  selectedClass: 'active'
};
