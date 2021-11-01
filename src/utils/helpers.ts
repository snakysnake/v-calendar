import { isArray, isObject, isFunction, isDate } from './_';

export interface PageAddress {
  day?: number;
  week?: number;
  month: number;
  year: number;
}

export const pad = (val: string | number, len: number, char = '0') => {
  val = val !== null && val !== undefined ? String(val) : '';
  len = len || 2;
  while (val.length < len) {
    val = `${char}${val}`;
  }
  return val;
};

export const evalFn = (fn: Function, args: any) =>
  isFunction(fn) ? fn(args) : fn;

export const mergeEvents = (...args: Array<any>) => {
  const result: any = {};
  args.forEach(e =>
    Object.entries(e).forEach(([key, value]) => {
      if (!result[key]) {
        result[key] = value;
      } else if (isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    }),
  );
  return result;
};

export const pageIsValid = (page: PageAddress | null): boolean =>
  !!(page && page.month && page.year);

export const pageIsBeforePage = (
  page: PageAddress,
  comparePage: PageAddress,
): boolean => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  if (page.year !== comparePage.year) return page.year < comparePage.year;
  if (page.month !== comparePage.month) return page.month < comparePage.month;
  if (page.week !== comparePage.week)
    return (page.week || 0) < (comparePage.week || 0);
  if (page.day !== comparePage.day)
    return (page.day || 0) < (comparePage.day || 0);
  return false;
};

export const pageIsAfterPage = (
  page: PageAddress,
  comparePage: PageAddress,
): boolean => {
  if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
  if (page.year !== comparePage.year) return page.year > comparePage.year;
  if (page.month !== comparePage.month) return page.month > comparePage.month;
  if (page.week !== comparePage.week)
    return (page.week || 0) > (comparePage.week || 0);
  if (page.day !== comparePage.day)
    return (page.day || 0) > (comparePage.day || 0);
  return false;
};

export const pageIsBetweenPages = (
  page: PageAddress,
  fromPage: PageAddress,
  toPage: PageAddress,
): boolean =>
  (page || false) &&
  !pageIsBeforePage(page, fromPage) &&
  !pageIsAfterPage(page, toPage);

export const pageIsEqualToPage = (
  aPage: PageAddress,
  bPage: PageAddress,
): boolean => {
  if (!aPage && bPage) return false;
  if (aPage && !bPage) return false;
  if (!aPage && !bPage) return true;
  return (
    aPage.year === bPage.year &&
    aPage.month === bPage.month &&
    aPage.week === bPage.week
  );
};

export function datesAreEqual(a: any, b: any): boolean {
  const aIsDate = isDate(a);
  const bIsDate = isDate(b);
  if (!aIsDate && !bIsDate) return true;
  if (aIsDate !== bIsDate) return false;
  return a.getTime() === b.getTime();
}

export const arrayHasItems = (array: any): boolean =>
  isArray(array) && array.length > 0;

export interface ElementPosition {
  top: number;
  left: number;
}

export const mixinOptionalProps = (source: any, target: any, props: [any]) => {
  const assigned: Array<string> = [];
  props.forEach(p => {
    const name = p.name || p.toString();
    const mixin = p.mixin;
    const validate = p.validate;
    if (Object.prototype.hasOwnProperty.call(source, name)) {
      const value = validate ? validate(source[name]) : source[name];
      target[name] = mixin && isObject(value) ? { ...mixin, ...value } : value;
      assigned.push(name);
    }
  });
  return {
    target,
    assigned: assigned.length ? assigned : null,
  };
};

export const on = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  opts: boolean | AddEventListenerOptions | undefined,
) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, opts);
  }
};

export const off = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  opts: boolean | EventListenerOptions | undefined,
) => {
  if (element && event) {
    element.removeEventListener(event, handler, opts);
  }
};

export const elementContains = (element: Element, child: Element) =>
  !!element && !!child && (element === child || element.contains(child));

export const onSpaceOrEnter = (
  event: KeyboardEvent,
  handler: (e: KeyboardEvent) => void,
) => {
  if (event.key === ' ' || event.key === 'Enter') {
    handler(event);
    event.preventDefault();
  }
};

/* eslint-disable no-bitwise */

export const createGuid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export function hash(str: string): number {
  let hashcode = 0;
  let i = 0;
  let chr;
  if (str.length === 0) return hashcode;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hashcode = (hashcode << 5) - hashcode + chr;
    hashcode |= 0; // Convert to 32bit integer
  }
  return hashcode;
}

/* eslint-enable no-bitwise */
