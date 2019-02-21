import m, { FactoryComponent, Attributes } from 'mithril';
import {
  Collection,
  ICollectionItem,
  CollectionMode,
  TextInput,
  NumberInput,
  Switch,
  TextArea,
  FlatButton,
} from 'mithril-materialized';

export interface IMapEditor extends Attributes {
  /** If true, displays a header over the map */
  header?: string;
  /**
   * Optional value for the key label
   * @default: "Key"
   */
  labelKey?: string;
  /**
   * Optional value for the value label
   * @default: "Value"
   */
  labelValue?: string;
  /** If true, the item cannot be edited */
  disabled?: boolean;
  /** If true, do not parse arrays like [1, 2, 3] */
  disallowArrays?: boolean;
  /** The actual map of key-value pairs */
  properties: { [key: string]: number | string | boolean | Array<string | number> };
  /** Optional component to use to render the key-value pair in a Collection */
  keyValueConverter?: (key: string, value: number | string | boolean | Array<string | number>) => ICollectionItem;
}

/** A simple editor for a Map (i.e. key - value pairs) */
export const MapEditor: FactoryComponent<IMapEditor> = () => {
  const parseArray = (v?: string, disallowArrays = false) => {
    if (disallowArrays) {
      return v;
    }
    const extractArrayData = /\s*\[(.*)\]\s*/gi;
    if (!v) {
      return undefined;
    }
    const match = extractArrayData.exec(v);
    if (!match || match.length !== 2) {
      return undefined;
    }
    return match[1]
      .split(',')
      .map(i => i.trim())
      .map(i => (/^\d+$/g.test(i) ? +i : i));
  };

  const kvc = (key: string, value: number | string | boolean | Array<string | number>) => {
    const displayValue = value instanceof Array ? value.join(', ') : value.toString();
    // const title = m('.row', [m('.col.s6', key), m('.col.s6', displayValue)]);
    const title = `${key}: ${displayValue}`;
    return {
      title,
    } as ICollectionItem;
  };

  const onclick = (key: string) => (state.curKey = state.id = key);

  const kvcWrapper = (key: string, item: ICollectionItem) => {
    const clickHandler = item.onclick;
    item.id = item.id || key;
    item.active = key === state.curKey;
    item.onclick = clickHandler ? () => onclick(key) && clickHandler(item) : () => onclick(key);
    return item;
  };

  const toCollectionArray = (properties: { [key: string]: number | string | boolean | Array<string | number> }) =>
    Object.keys(properties)
      .map(key => ({ key, value: properties[key] }))
      .map(item => kvcWrapper(item.key, state.kvc(item.key, item.value)));

  const state = {
    id: '',
    curKey: '',
    kvc,
  };

  const resetInputs = () => {
    state.id = '';
    state.curKey = '';
  };

  return {
    oninit: ({ attrs: { keyValueConverter } }) => {
      if (keyValueConverter) {
        state.kvc = keyValueConverter;
      }
    },
    view: ({
      attrs: { header, disabled, disallowArrays, properties, labelKey = 'Key', labelValue: label = 'Value' },
    }) => {
      const items = toCollectionArray(properties);
      const key = state.curKey;
      const prop = properties[key];
      const value =
        typeof prop === 'boolean' ? prop : prop ? (prop instanceof Array ? `[${prop.join(', ')}]` : prop) : '';
      console.table(items);

      return [
        m('.row.map-editor-collection', m('.col.s12', m(Collection, { items, mode: CollectionMode.LINKS, header }))),
        disabled
          ? undefined
          : m('.row.map-editor-edit', [
              m(
                '.col.s12.m6',
                m(TextInput, {
                  label: labelKey,
                  initialValue: key,
                  onchange: (v: string) => {
                    state.curKey = v;
                    if (state.id) {
                      delete properties[state.id];
                      properties[v] = prop;
                      state.id = v;
                    }
                  },
                })
              ),
              m(
                '.col.s12.m6',
                typeof value === 'string'
                  ? m(TextArea, {
                      label,
                      initialValue: value,
                      onchange: (v: string) => {
                        const b = /false/i.test(v) ? false : /true/i.test(v) ? true : undefined;
                        const n = typeof b === 'undefined' ? (/^\s*\d+\s*$/i.test(v) ? +v : undefined) : undefined;
                        properties[key] =
                          typeof b === 'boolean' ? b : typeof n === 'number' ? n : parseArray(v, disallowArrays) || v;
                      },
                    })
                  : typeof value === 'number'
                  ? m(NumberInput, {
                      label,
                      initialValue: value,
                      onchange: (v: number) => {
                        properties[key] = v;
                      },
                    })
                  : m(Switch, {
                      label,
                      checked: value,
                      onchange: (v: boolean) => {
                        properties[key] = v;
                      },
                    })
              ),
              m('.col.s12', [
                m(FlatButton, {
                  iconName: 'add',
                  onclick: resetInputs,
                }),
                m(FlatButton, {
                  iconName: 'delete',
                  disabled: !key,
                  onclick: () => {
                    delete properties[key];
                    resetInputs();
                  },
                }),
              ]),
            ]),
      ];
    },
  };
};
