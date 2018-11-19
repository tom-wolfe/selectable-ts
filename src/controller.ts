import { Subject, Observable } from 'rxjs';
import { SelectableOptions } from './options';
import { allowElementClick, elementsIntersect } from './utils';

export class SelectableController {
  private _userSelect: string;
  private _select: Subject<HTMLElement> = new Subject<HTMLElement>();
  private _deselect: Subject<HTMLElement> = new Subject<HTMLElement>();
  private _start: Subject<never> = new Subject<never>();
  private _stop: Subject<never> = new Subject<never>();

  public items: HTMLElement[];
  public selectionRectangle: HTMLDivElement;

  public get start(): Observable<never> { return this._start.asObservable(); }
  public get select(): Observable<HTMLElement> { return this._select.asObservable(); }
  public get deselect(): Observable<HTMLElement> { return this._deselect.asObservable(); }
  public get stop(): Observable<never> { return this._stop.asObservable(); }

  constructor(private _options: SelectableOptions) { }

  public begin(zone: HTMLElement, elementSelector: string) {
    this._start.next();
    this.setTextSelection(false);
    this.refreshItems(zone, elementSelector);
    this.setItemsEnabled(false);
  }

  public end() {
    this.setItemsEnabled(false);
    this.removeSelectionRectangle();
    this.setTextSelection(true);
    this._stop.next();
    this.items = [];
  }

  public createSelectionRectangle(x: number, y: number) {
    if (this.selectionRectangle) { return; }

    this.selectionRectangle = document.createElement('div');
    this.selectionRectangle.classList.add('selection-rectangle');
    this.selectionRectangle.style.left = x + 'px';
    this.selectionRectangle.style.top = y + 'px';
    document.body.appendChild(this.selectionRectangle);
  }

  public refreshItems(zone: HTMLElement, selector: string) {
    this.items = Array.from(zone.querySelectorAll(selector));
  }

  public selectItem(el: HTMLElement) {
    if (this.itemSelected(el)) { return; }
    el.classList.add(this._options.selectedClass);
    this._select.next(el);
  }

  public deselectItem(el: HTMLElement) {
    if (!this.itemSelected(el)) { return; }
    el.classList.remove(this._options.selectedClass);
    this._deselect.next(el);
  }

  public toggleItem(el: HTMLElement, force?: boolean) {
    if (force !== undefined && el.classList.contains(this._options.selectedClass) === force) { return; }
    const toggle = el.classList.toggle(this._options.selectedClass, force);
    (toggle ? this._select : this._deselect).next(el);
  }

  public itemSelected(el: HTMLElement): boolean {
    return el.classList.contains(this._options.selectedClass);
  }

  public updateSelectionRectangle(start: [number, number], stop: [number, number]) {
    // Update the position of the selection rectangle.
    const x1 = Math.min(start[0], stop[0]);
    const x2 = Math.max(start[0], stop[0]);
    const y1 = Math.min(start[1], stop[1]);
    const y2 = Math.max(start[1], stop[1]);

    this.selectionRectangle.style.left = x1 + 'px';
    this.selectionRectangle.style.top = y1 + 'px';
    this.selectionRectangle.style.width = (x2 - x1) + 'px';
    this.selectionRectangle.style.height = (y2 - y1) + 'px';
  }

  public getItemAtPosition(x: number, y: number) {
    const els = document.elementsFromPoint(x, y);
    return this.items.find(i => els.includes(i));
  }

  public intersects(el: HTMLElement) {
    return elementsIntersect(el, this.selectionRectangle);
  }

  private removeSelectionRectangle() {
    if (!this.selectionRectangle) { return; }

    this.selectionRectangle.parentNode.removeChild(this.selectionRectangle);
    this.selectionRectangle = null;
  }

  private setItemsEnabled(enabled: boolean) {
    this.items.forEach(i => allowElementClick(i, enabled));
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
}
