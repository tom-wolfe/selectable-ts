function elementOffset(el: HTMLElement): [number, number] {
  const r = el.getBoundingClientRect();
  return [r.top + document.body.scrollTop, r.left + document.body.scrollLeft];
}

export function elementsIntersect(a: HTMLElement, b: HTMLElement): boolean {
  const [aTop, aLeft] = elementOffset(a);
  const [bTop, bLeft] = elementOffset(b);

  return !(((aTop + a.offsetHeight) < bTop)
    || (aTop > (bTop + b.offsetHeight))
    || ((aLeft + a.offsetWidth) < bLeft)
    || (aLeft > (bLeft + b.offsetWidth)));
}