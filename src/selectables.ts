import { defaults, SelectableOptions } from './options';
import { elementsIntersect, disableClick, enableClick } from './utils';

/*
 *   Adapted from: https://github.com/p34eu/Selectables.git
 */

export class Selectable {
  private _enabled = false;
  private _userSelect: string;
  private _options: SelectableOptions;
  private _zone: HTMLElement;
  private _items: HTMLElement[];
  private _selectionRectangle: HTMLDivElement;
  private _mouseDownPosition: [number, number];

  constructor(options?: Partial<SelectableOptions>) {
    this.loadOptions(options);
    this.enable();
  }

  public get enabled(): boolean { return this._enabled; }
  public get zone(): HTMLElement { return this._zone; }

  public enable() {
    if (this.enabled) { return; }

    this.zone.addEventListener('mousedown', this.onMouseDown);
    document.body.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    this._items = Array.from(this.zone.querySelectorAll(this._options.elements));
    this._enabled = true;
  }

  public disable() {
    if (!this.enabled) { return; }

    this.zone.removeEventListener('mousedown', this.onMouseDown);
    document.body.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    this._items = [];
    this._enabled = false;
  }

  private loadOptions(options: Partial<SelectableOptions>) {
    this._options = Object.assign({}, defaults, options);

    // Load the zone.
    this._zone = typeof this._options.zone === 'string'
      ? document.querySelector(this._options.zone) : this._options.zone;
    if (!this.zone) { throw new Error('No zone element found.'); }
  }

  private createSelectionRectangle(x: number, y: number) {
    if (!this._selectionRectangle) {
      this._selectionRectangle = document.createElement('div');
      this._selectionRectangle.id = 's-rectBox';
      this._selectionRectangle.style.left = x + 'px';
      this._selectionRectangle.style.top = y + 'px';
      document.body.appendChild(this._selectionRectangle);
    }
  }

  private removeSelectionRectangle() {
    this._selectionRectangle.parentNode.removeChild(this._selectionRectangle);
    this._selectionRectangle = null;
  }

  private disableTextSelection() {
    this._userSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
  }

  private enableTextSelection() {
    document.body.style.userSelect = this._userSelect;
    this._userSelect = undefined;
  }

  private onMouseDown = ((e: MouseEvent) => {
    if (e.button !== 0) { return; } // Only fire on left mouse button.
    this._mouseDownPosition = [e.pageX, e.pageY];

    this.disableTextSelection();

    this._items.forEach(el => {
      disableClick(el);
      if (!e['ctrlKey']) {
        el.classList.remove(this._options.selectedClass);
      }
    });

    this.createSelectionRectangle(e.pageX, e.pageY);
  }).bind(this);

  private onMouseMove = ((e: MouseEvent) => {
    if (!this._mouseDownPosition || !this._selectionRectangle) { return; }

    // Update the position of the selection rectangle.
    const x1 = Math.min(this._mouseDownPosition[0], e.pageX);
    const y1 = Math.min(this._mouseDownPosition[1], e.pageY);
    const x2 = Math.max(this._mouseDownPosition[0], e.pageX);
    const y2 = Math.max(this._mouseDownPosition[1], e.pageY);

    this._selectionRectangle.style.left = x1 + 'px';
    this._selectionRectangle.style.top = y1 + 'px';
    this._selectionRectangle.style.width = (x2 - x1) + 'px';
    this._selectionRectangle.style.height = (y2 - y1) + 'px';
  }).bind(this);

  private onMouseUp = ((e: MouseEvent) => {
    if (e.button !== 0) { return; } // Only fire on left mouse button.
    if (!this._mouseDownPosition) { return; }
    this._mouseDownPosition = undefined;

    this._items.forEach(el => {
      if (elementsIntersect(this._selectionRectangle, el)) {
        if (e['shiftKey']) {
          el.classList.add(this._options.selectedClass);
        } else {
          el.classList.toggle(this._options.selectedClass);
        }
        
      }
      enableClick(el);
    });

    this.removeSelectionRectangle();
    this.enableTextSelection();

  }).bind(this);
}
