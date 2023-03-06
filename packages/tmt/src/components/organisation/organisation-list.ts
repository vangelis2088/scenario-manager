import m from 'mithril';
import { OrganisationForm } from './organisation-form';
import { IOrganisation, uniqueId } from 'trial-manager-models';
import { RoundIconButton, TextInput, Collection, CollectionMode } from 'mithril-materialized';
import { MeiosisComponent } from '../../services';
import { getOrganisations } from '../../utils';

const OrganisationList: MeiosisComponent = () => {
  let filterValue = '' as string | undefined;
  let curOrganisationId = undefined as string | undefined;

  return {
    view: ({
      attrs: {
        state: {
          app: { trial, organisationId },
        },
        actions: { selectOrganisation, createOrganisation },
      },
    }) => {
      const organisations = getOrganisations(trial, filterValue);
      curOrganisationId = organisationId;
      const items = organisations
        ? organisations.map((cur) => ({
            title: cur.name || '?',
            avatar: 'attach_money',
            iconName: 'create',
            className: 'yellow black-text',
            active: curOrganisationId === cur.id,
            onclick: () => selectOrganisation(cur),
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
                  name: 'New Organisation',
                } as IOrganisation;
                curOrganisationId = sh.id;
                await createOrganisation(sh);
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

export const OrganisationView: MeiosisComponent = () => {
  return {
    view: ({ attrs: { state, actions } }) =>
      m('.row', [
        m('.col.s12.m5.l4', m(OrganisationList, { state, actions })),
        m('.col.s12.m7.l8', m(OrganisationForm, { state, actions })),
      ]),
  };
};
