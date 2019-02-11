import { Observable } from 'rxjs';
import { createBehavior, SelectableBehavior } from './behavior';
import { SelectableController } from './controller';
import { defaults, SelectableOptions } from './options';
import { ChangeEvent } from './events';

export class Selectable {
  private _behavior: SelectableBehavior;
  private _controller: SelectableController;
  private _enabled = false;
  private _mouseDownPosition: [number, number];
  private _options: SelectableOptions;
  private _zone: HTMLElement;

  public get start(): Observable<never> { return this._controller.start; }
  public get select(): Observable<HTMLElement> { return this._controller.select; }
  public get deselect(): Observable<HTMLElement> { return this._controller.deselect; }
  public get change(): Observable<ChangeEvent> { return this._controller.change; }
  public get stop(): Observable<never> { return this._controller.stop; }

  constructor(options?: Partial<SelectableOptions>) {
    this.loadOptions(options);
    this.enable();
  }

  public get enabled(): boolean { return this._enabled; }
  public get zone(): HTMLElement { return this._zone; }

  private onMouseDown = ((e: MouseEvent) => {
    if (e.button !== 0) { return; } // Only fire on left mouse button.
    document.body.addEventListener('mousemove', this.onMouseMove);
    this._mouseDownPosition = [e.pageX, e.pageY];
    this._controller.begin(this._zone, this._options.elements);
    this._behavior.onMouseDown(e);
    
  }).bind(this);

  private onMouseMove = ((e: MouseEvent) => {
    if (!this._mouseDownPosition) { return; }
    this._controller.updateSelectionRectangle(this._mouseDownPosition, [e.pageX, e.pageY]);
    this._behavior.onMouseMove(e);
  }).bind(this);

  private onMouseUp = ((e: MouseEvent) => {
    if (e.button !== 0) { return; } // Only fire on left mouse button.
    document.body.removeEventListener('mousemove', this.onMouseMove);
    if (!this._mouseDownPosition) { return; }
    this._mouseDownPosition = undefined;
    this._behavior.onMouseUp(e);
    this._controller.end();
  }).bind(this);

  private onDragStart = ((e: DragEvent) => e.preventDefault()).bind(this);

  public enable() {
    if (this.enabled) { return; }
    this.zone.addEventListener('mousedown', this.onMouseDown);
    this.zone.addEventListener('dragstart', this.onDragStart);
    window.addEventListener('mouseup', this.onMouseUp);
    this._enabled = true;
  }

  public disable() {
    if (!this.enabled) { return; }
    this.zone.removeEventListener('mousedown', this.onMouseDown);
    this.zone.removeEventListener('dragstart', this.onDragStart);
    window.removeEventListener('mouseup', this.onMouseUp);
    this._enabled = false;
  }

  public selectAll() { this._controller.selectAll(); }
  public deselectAll() { this._controller.deselectAll(); }

  private loadOptions(options: Partial<SelectableOptions>) {
    this._options = Object.assign({}, defaults, options);
    this._controller = new SelectableController(this._options);

    // Load the zone.
    this._zone = typeof this._options.zone === 'string'
      ? document.querySelector(this._options.zone) : this._options.zone;
    if (!this.zone) { throw new Error('No zone element found.'); }

    this._behavior = typeof this._options.behavior === 'string'
      ? createBehavior(this._options.behavior, this._controller) : this._options.behavior(this._controller);
  }
}
