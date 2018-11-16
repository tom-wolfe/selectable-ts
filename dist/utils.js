"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function elementOffset(el) {
    var r = el.getBoundingClientRect();
    return [r.top + document.body.scrollTop, r.left + document.body.scrollLeft];
}
function elementsIntersect(a, b) {
    var _a = elementOffset(a), aTop = _a[0], aLeft = _a[1];
    var _b = elementOffset(b), bTop = _b[0], bLeft = _b[1];
    return !(((aTop + a.offsetHeight) < bTop)
        || (aTop > (bTop + b.offsetHeight))
        || ((aLeft + a.offsetWidth) < bLeft)
        || (aLeft > (bLeft + b.offsetWidth)));
}
exports.elementsIntersect = elementsIntersect;
function suspend(e) {
    e.preventDefault();
    e.stopPropagation();
}
function allowElementClick(el, enabled) {
    if (enabled) {
        el.removeEventListener('click', suspend, true);
    }
    else {
        el.addEventListener('click', suspend, true);
    }
}
exports.allowElementClick = allowElementClick;
//# sourceMappingURL=utils.js.map