"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = require("./options");
var utils_1 = require("./utils");
var rxjs_1 = require("rxjs");
/*
 *   Adapted from: https://github.com/p34eu/Selectables.git
 */
var Selectable = /** @class */ (function () {
    function Selectable(options) {
        var _this = this;
        this._enabled = false;
        this._start = new rxjs_1.Subject();
        this._stop = new rxjs_1.Subject();
        this._select = new rxjs_1.Subject();
        this._deselect = new rxjs_1.Subject();
        this.onMouseDown = (function (e) {
            if (e.button !== 0) {
                return;
            } // Only fire on left mouse button.
            _this._mouseDownPosition = [e.pageX, e.pageY];
            _this._start.next();
            _this.setTextSelection(false);
            var els = document.elementsFromPoint(e.pageX, e.pageY);
            var curEl = _this._items.find(function (i) { return els.includes(i); });
            if (e['ctrlKey']) {
                if (curEl) {
                    utils_1.allowElementClick(curEl, false);
                    (curEl.classList.toggle(_this._options.selectedClass) ? _this._select : _this._deselect).next(curEl);
                    _this._stop.next([curEl]);
                }
            }
            else {
                _this._items.forEach(function (el) {
                    utils_1.allowElementClick(el, false);
                    if (el === curEl) {
                        el.classList.add(_this._options.selectedClass);
                    }
                    else if (el.classList.contains(_this._options.selectedClass)) {
                        el.classList.remove(_this._options.selectedClass);
                        _this._deselect.next(el);
                    }
                });
                _this.createSelectionRectangle(e.pageX, e.pageY);
            }
        }).bind(this);
        this.onMouseMove = (function (e) {
            if (!_this._mouseDownPosition || !_this._selectionRectangle) {
                return;
            }
            // Update the position of the selection rectangle.
            var x1 = Math.min(_this._mouseDownPosition[0], e.pageX);
            var y1 = Math.min(_this._mouseDownPosition[1], e.pageY);
            var x2 = Math.max(_this._mouseDownPosition[0], e.pageX);
            var y2 = Math.max(_this._mouseDownPosition[1], e.pageY);
            _this._selectionRectangle.style.left = x1 + 'px';
            _this._selectionRectangle.style.top = y1 + 'px';
            _this._selectionRectangle.style.width = (x2 - x1) + 'px';
            _this._selectionRectangle.style.height = (y2 - y1) + 'px';
            _this._items.forEach(function (el) {
                el.classList.toggle(_this._options.selectedClass, utils_1.elementsIntersect(_this._selectionRectangle, el));
            });
        }).bind(this);
        this.onMouseUp = (function (e) {
            if (e.button !== 0) {
                return;
            } // Only fire on left mouse button.
            if (!_this._mouseDownPosition || !_this._selectionRectangle) {
                return;
            }
            _this._mouseDownPosition = undefined;
            var selected = [];
            _this._items.forEach(function (el) {
                if (utils_1.elementsIntersect(_this._selectionRectangle, el)) {
                    selected.push(el);
                    _this._select.next(el);
                }
                utils_1.allowElementClick(el, true);
            });
            _this.removeSelectionRectangle();
            _this.setTextSelection(true);
            _this._stop.next(selected);
        }).bind(this);
        this.loadOptions(options);
        this.enable();
    }
    Object.defineProperty(Selectable.prototype, "start", {
        get: function () { return this._start.asObservable(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selectable.prototype, "stop", {
        get: function () { return this._stop.asObservable(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selectable.prototype, "select", {
        get: function () { return this._select.asObservable(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selectable.prototype, "deselect", {
        get: function () { return this._deselect.asObservable(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selectable.prototype, "enabled", {
        get: function () { return this._enabled; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selectable.prototype, "zone", {
        get: function () { return this._zone; },
        enumerable: true,
        configurable: true
    });
    Selectable.prototype.enable = function () {
        if (this.enabled) {
            return;
        }
        this.zone.addEventListener('mousedown', this.onMouseDown);
        document.body.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this._items = Array.from(this.zone.querySelectorAll(this._options.elements));
        this._enabled = true;
    };
    Selectable.prototype.disable = function () {
        if (!this.enabled) {
            return;
        }
        this.zone.removeEventListener('mousedown', this.onMouseDown);
        document.body.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        this._items = [];
        this._enabled = false;
    };
    Selectable.prototype.loadOptions = function (options) {
        this._options = Object.assign({}, options_1.defaults, options);
        // Load the zone.
        this._zone = typeof this._options.zone === 'string'
            ? document.querySelector(this._options.zone) : this._options.zone;
        if (!this.zone) {
            throw new Error('No zone element found.');
        }
    };
    Selectable.prototype.createSelectionRectangle = function (x, y) {
        if (!this._selectionRectangle) {
            this._selectionRectangle = document.createElement('div');
            this._selectionRectangle.id = 's-rectBox';
            this._selectionRectangle.style.left = x + 'px';
            this._selectionRectangle.style.top = y + 'px';
            document.body.appendChild(this._selectionRectangle);
        }
    };
    Selectable.prototype.removeSelectionRectangle = function () {
        this._selectionRectangle.parentNode.removeChild(this._selectionRectangle);
        this._selectionRectangle = null;
    };
    Selectable.prototype.setTextSelection = function (enabled) {
        if (enabled) {
            document.body.style.userSelect = this._userSelect;
            this._userSelect = undefined;
        }
        else {
            this._userSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
        }
    };
    return Selectable;
}());
exports.Selectable = Selectable;
//# sourceMappingURL=selectables.js.map