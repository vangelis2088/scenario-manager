import { IContent } from '../models/content';
import { InjectType } from '../models/inject';

/**
 * Convert an item array to a tree. Assumes each item has a parentId.
 * @param items Items
 */
export const unflatten = <T extends { id: string; parentId?: string }>(
  entities: T[] = [],
  parent = { id: undefined } as { id?: string; children?: T[] },
  tree = [] as Array<T & { children: T[] }>
) => {
  const children = (parent.id
    ? entities.filter(entity => entity.parentId === parent.id)
    : entities.filter(entity => !entity.parentId)) as Array<T & { children: T[] }>;

  if (children.length > 0) {
    if (!parent.id) {
      tree = children;
    } else {
      parent.children = children;
    }
    children.forEach(child => unflatten(entities, child));
  }

  return tree;
};

/**
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach(v => {
      cp.push(v);
    });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === 'object' && target !== {}) {
    const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
    Object.keys(cp).forEach(k => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};

/**
 * Function to filter case-insensitive title and description.
 * @param filterValue Filter text
 */
export const titleAndDescriptionFilter = (filterValue: string) => {
  filterValue = filterValue.toLowerCase();
  return (content: IContent) =>
    !filterValue ||
    !content.title ||
    content.title.toLowerCase().indexOf(filterValue) >= 0 ||
    (content.description && content.description.toLowerCase().indexOf(filterValue) >= 0);
};

export const deepEqual = <T extends { [key: string]: any }>(x?: T, y?: T): boolean => {
  const tx = typeof x;
  const ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(key => deepEqual(x[key], y[key]))
    : x === y;
};

// let i = 0;
// console.log(`${++i}: ${deepEqual([1, 2, 3], [1, 2, 3])}`);
// console.log(`${++i}: ${deepEqual([1, 2, 3], [1, 2, 3, 4])}`);
// console.log(`${++i}: ${deepEqual({ a: 'foo', b: 'bar' }, { a: 'foo', b: 'bar' })}`);
// console.log(`${++i}: ${deepEqual({ a: 'foo', b: 'bar' }, { b: 'bar', a: 'foo' })}`);

/**
 * Represent the inject with an icon.
 * @param type inject type
 */
export const getInjectIcon = (type: InjectType) => {
  switch (type) {
    case InjectType.INJECT: return 'colorize';
    case InjectType.ACT: return 'call_to_action'; // 'chat';
    default: return 'import_contacts';
  }
};