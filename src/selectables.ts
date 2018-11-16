import { defaults, SelectableOptions } from './options';

/*
 *   Adapted from: https://github.com/p34eu/Selectables.git
 */

export class Selectable {
  private _enabled = false;
  private _options: SelectableOptions;
  private _zone: HTMLElement;
  private _items: NodeListOf<Element>;
  private _ipos: [number, number];

  private _zoneMouseDown = this.zoneMouseDown.bind(this);
  private _select = this.select.bind(this);
  private _rectDraw = this.rectDraw.bind(this);

  constructor(options?: Partial<SelectableOptions>) {
    this._options = Object.assign({}, defaults, options);
    this.enable();
  }

  public get enabled(): boolean { return this._enabled; }
  public get options(): SelectableOptions { return this._options; }
  public get zone(): HTMLElement { return this._zone; }

  enable() {
    if (this.enabled) { return; }

    this._zone = document.querySelector(this._options.zone);
    if (!this.zone) {
      throw new Error(this.constructor.name + ' :: no zone defined in options. Please use element with ID');
    }

    this._items = document.querySelectorAll(this.options.zone + ' ' + this.options.elements);
    this.zone.addEventListener('mousedown', this._zoneMouseDown);
    this._enabled = true;
  }

  disable() {
    if (!this.enabled) { return; }
    this.zone.removeEventListener('mousedown', this._zoneMouseDown);
    this._enabled = false;
  }

  suspend(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  zoneMouseDown(e: MouseEvent) {
    if (this.options.start) { this.options.start(e); }

    document.body.classList.add('s-noselect');

    Array.from(this._items).forEach(el => {
      el.addEventListener('click', this.suspend, true); // skip any clicks
      if (!e['shiftKey']) {
        el.classList.remove(this.options.selectedClass);
      }
    });

    this._ipos = [e.pageX, e.pageY];
    if (!this.rb()) {
      const gh = document.createElement('div');
      gh.id = 's-rectBox';
      gh.style.left = e.pageX + 'px';
      gh.style.top = e.pageY + 'px';
      document.body.appendChild(gh);
    }
    document.body.addEventListener('mousemove', this._rectDraw);
    window.addEventListener('mouseup', this._select);
  }

  rb() {
    return document.getElementById('s-rectBox');
  }

  cross(a, b) {
    const aTop = this.offset(a).top, aLeft = this.offset(a).left, bTop = this.offset(b).top, bLeft = this.offset(b).left;
    return !(((aTop + a.offsetHeight) < (bTop)) ||
      (aTop > (bTop + b.offsetHeight)) || ((aLeft + a.offsetWidth) < bLeft) || (aLeft > (bLeft + b.offsetWidth)));
  }

  select(e) {
    const a = this.rb();
    if (!a) { return; }
    this._ipos = null;

    document.body.classList.remove('s-noselect');
    document.body.removeEventListener('mousemove', this._rectDraw);
    window.removeEventListener('mouseup', this._select);
    const s = this.options.selectedClass;
    Array.from(this._items).forEach(el => {
      if (this.cross(a, el) === true) {
        if (el.classList.contains(s)) {
          el.classList.remove(s);
          if (this.options.onDeselect) { this.options.onDeselect(el); }
        } else {
          el.classList.add(s);
          if (this.options.onSelect) { this.options.onSelect(el); }
        }
      }
      setTimeout(() => {
        el.removeEventListener('click', this.suspend, true);
      }, 100);
    });
    a.parentNode.removeChild(a);
    if (this.options.stop) { this.options.stop(e); }
  }

  rectDraw(e) {
    const g = this.rb();
    if (!this._ipos || g === null) {
      return;
    }
    let tmp, x1 = this._ipos[0], y1 = this._ipos[1], x2 = e.pageX, y2 = e.pageY;
    if (x1 > x2) {
      tmp = x2, x2 = x1, x1 = tmp;
    }
    if (y1 > y2) {
      tmp = y2, y2 = y1, y1 = tmp;
    }
    g.style.left = x1 + 'px', g.style.top = y1 + 'px', g.style.width = (x2 - x1) + 'px', g.style.height = (y2 - y1) + 'px';
  }

  offset(el) {
    const r = el.getBoundingClientRect();
    return { top: r.top + document.body.scrollTop, left: r.left + document.body.scrollLeft };
  }

}
