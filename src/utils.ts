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

function suspend(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

export function allowElementClick(el: HTMLElement, enabled: boolean) {
  const events = ['click', 'ondragstart'];
  if (enabled) {
    events.forEach(e => el.removeEventListener(e, suspend, true));
  } else {
    events.forEach(e => el.addEventListener(e, suspend, true));
  }
}
