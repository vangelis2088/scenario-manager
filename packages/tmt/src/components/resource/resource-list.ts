import m from 'mithril';
import { ResourceForm } from './resource-form';
import { IResource, uniqueId } from 'trial-manager-models';
import { RoundIconButton, TextInput, Collection, CollectionMode } from 'mithril-materialized';
import { MeiosisComponent } from '../../services';
import { getResources } from '../../utils';

const ResourceList: MeiosisComponent = () => {
  let filterValue = '' as string | undefined;
  let curResourceId = undefined as string | undefined;

  return {
    view: ({
      attrs: {
        state: {
          app: { trial, resourceId },
        },
        actions: { selectResource, createResource },
      },
    }) => {
      const resources = getResources(trial, filterValue);
      curResourceId = resourceId;
      const items = resources
        ? resources.map((cur) => ({
            title: cur.name || '?',
            avatar: 'attach_money',
            iconName: 'create',
            className: 'yellow black-text',
            active: curResourceId === cur.id,
            onclick: () => selectResource(cur),
          }))
        : undefined;

      return [
        m(
          '.row',
          m('.col.s12', [
            m(RoundIconButton, {
              iconName: 'add',
              class: 'green right btn-small',
              style: 'margin: 1em;',
              onclick: async () => {
                const sh = {
                  id: uniqueId(),
                  name: 'New Resource',
                } as IResource;
                curResourceId = sh.id;
                await createResource(sh);
              },
            }),
            m(TextInput, {
              label: 'Filter',
              id: 'filter',
              iconName: 'filter_list',
              onkeyup: (_: KeyboardEvent, v?: string) => (filterValue = v),
              className: 'right',
            }),
          ])
        ),
        items
          ? m(
              '.row.sb',
              m(
                '.col.s12',
                m(Collection, {
                  mode: CollectionMode.AVATAR,
                  items,
                })
              )
            )
          : undefined,
      ];
    },
  };
};

export const ResourceView: MeiosisComponent = () => {
  return {
    view: ({ attrs: { state, actions } }) =>
      m('.row', [
        m('.col.s12.m5.l4', m(ResourceList, { state, actions })),
        m('.col.s12.m7.l8', m(ResourceForm, { state, actions })),
      ]),
  };
};
