function elementOffset(el: HTMLElement): [number, number] {
  const r = el.getBoundingClientRect();
  return [r.top + document.body.scrollTop, r.left + document.body.scrollLeft];
}

export function elementsIntersect(a: HTMLElement, b: HTMLElement): boolean {
  if (!a || !b) { return false; }

  const [aTop, aLeft] = elementOffset(a);
  const [bTop, bLeft] = elementOffset(b);

  return !(((aTop + a.offsetHeight) < bTop)
    || (aTop > (bTop + b.offsetHeight))
    || ((aLeft + a.offsetWidth) < bLeft)
    || (aLeft > (bLeft + b.offsetWidth)));
}

function suspend(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

export function allowElementClick(el: HTMLElement, enabled: boolean) {
  if (!el) { return; }
  enabled
    ? el.removeEventListener('click', suspend, true)
    : el.addEventListener('click', suspend, true);
}