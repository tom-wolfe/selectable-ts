import { defaults, SelectableOptions } from './options';
import { elementsIntersect, allowElementClick } from './utils';
import { Subject, Observable } from 'rxjs';

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

  private _start: Subject<never> = new Subject<never>();
  private _stop: Subject<HTMLElement[]> = new Subject<HTMLElement[]>();
  private _select: Subject<HTMLElement> = new Subject<HTMLElement>();
  private _deselect: Subject<HTMLElement> = new Subject<HTMLElement>();

  public get start(): Observable<never> { return this._start.asObservable(); }
  public get stop(): Observable<HTMLElement[]> { return this._stop.asObservable(); }
  public get select(): Observable<HTMLElement> { return this._select.asObservable(); }
  public get deselect(): Observable<HTMLElement> { return this._deselect.asObservable(); }

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

  private setTextSelection(enabled: boolean) {
    if (enabled) {
      document.body.style.userSelect = this._userSelect;
      this._userSelect = undefined;
    } else {
      this._userSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
    }
  }

  private onMouseDown = ((e: MouseEvent) => {
    if (e.button !== 0) { return; } // Only fire on left mouse button.
    this._mouseDownPosition = [e.pageX, e.pageY];

    this._start.next();

    this.setTextSelection(false);

    const els = document.elementsFromPoint(e.pageX, e.pageY);
    const curEl = this._items.find(i => els.includes(i));

    if (e['ctrlKey']) {
      if (curEl) {
        allowElementClick(curEl, false);
        (curEl.classList.toggle(this._options.selectedClass) ? this._select : this._deselect).next(curEl);
        this._stop.next([curEl]);
      }
    } else {
      this._items.forEach(el => {
        allowElementClick(el, false);
        if (el === curEl) {
          el.classList.add(this._options.selectedClass);
        } else if (el.classList.contains(this._options.selectedClass)) {
          el.classList.remove(this._options.selectedClass);
          this._deselect.next(el);
        }
      });
      this.createSelectionRectangle(e.pageX, e.pageY);
    }

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
    if (!this._mouseDownPosition || !this._selectionRectangle) { return; }
    this._mouseDownPosition = undefined;

    const selected: HTMLElement[] = [];

    this._items.forEach(el => {
      if (elementsIntersect(this._selectionRectangle, el)) {
        selected.push(el);
        el.classList.add(this._options.selectedClass);
        this._select.next(el);
      }
      allowElementClick(el, true);
    });

    this.removeSelectionRectangle();
    this.setTextSelection(true);

    this._stop.next(selected);

  }).bind(this);
}
