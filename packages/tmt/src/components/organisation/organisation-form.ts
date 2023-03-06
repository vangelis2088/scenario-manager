import m from 'mithril';
//import { TextInput, TextArea, Select, Button, Icon, Collapsible } from 'mithril-materialized';
import { TextInput, Button, Icon } from 'mithril-materialized';
import { IOrganisation, deepCopy, deepEqual } from 'trial-manager-models';
import { MeiosisComponent } from '../../services';
//import { getInjectIcon, getInjects, getObjectives, getOrganisations, getStakeholders, isInjectGroup } from '../../utils';
import {  getOrganisations, getStakeholders } from '../../utils';


export const OrganisationForm: MeiosisComponent = () => {
  let organisation = {} as IOrganisation;

  return {
    view: ({
      attrs: {
        state: {
          app: { trial, organisationId },
        },
        actions: { updateOrganisation, deleteOrganisation },
      },
    }) => {
      const organisations = getOrganisations(trial);
      if (!organisationId) {
        return m(
          'p',
          m(
            'i',
            `Please, create an organisation using the + button${
              organisations.length > 0 ? ', or select one in the tree' : ''
            }.`
          )
        );
      }
      const original = organisations.filter((s: { id: string; }) => s.id === organisationId).shift() || ({} as IOrganisation);
      if (!organisation || original.id !== organisation.id) {
        organisation = deepCopy(original);
      }
      const hasChanged = !deepEqual(organisation, original);
      const stakeholders = getStakeholders(trial);
      const options = stakeholders
        ? stakeholders.map((u) => ({
            id: u.id,
            label: u.name || 'unknown',
          }))
        : undefined;

      console.log(options?.length);

      const onsubmit = (e: UIEvent) => {
        e.preventDefault();
        if (organisation) {
          console.log(organisation);
          updateOrganisation(organisation);
        }
      };

      //const injectGroups = getInjects(trial).filter(isInjectGroup);
  
      //const mainInjectsGroups =
      //  injectGroups && objective && injectGroups.filter((g) => g.mainObjectiveId === objectiveId);
      //const secInjectsGroups =
      //  injectGroups && objective && injectGroups.filter((g) => g.secondaryObjectiveId === objectiveId);

      return m(
        '.row',
        { style: 'color: black' },
        // m('.col.s12', { key: objective ? objectiveId : undefined }, [
        m('.col.s12', [
          organisation
            ? [
                m('h4', [
                  m(Icon, {
                    iconName: 'my_location',
                    style: 'margin-right: 12px;',
                  }),
                  'Organisation details',
                ]),
                [
                  m(TextInput, {
                    id: 'title',
                    initialValue: organisation.name,
                    onchange: (v: string) => (organisation.name = v),
                    label: 'Name',
                    iconName: 'title',
                  }),
                  m(TextInput, {
                    id: 'street',
                    initialValue: organisation.street,
                    onchange: (v: string) => (organisation.street = v),
                    label: 'Street',
                    iconName: 'edit_road',
                  }),
                  m(TextInput, {
                    id: 'city',
                    initialValue: organisation.city,
                    onchange: (v: string) => (organisation.city = v),
                    label: 'City',
                    iconName: 'apartment',
                  }),
                  m(TextInput, {
                    id: 'state',
                    initialValue: organisation.state,
                    onchange: (v: string) => (organisation.state = v),
                    label: 'State',
                    iconName: 'house',
                  }),
                  m(TextInput, {
                    id: 'postal_code',
                    initialValue: organisation.postal_code,
                    onchange: (v: string) => (organisation.postal_code = v),
                    label: 'Postal Code',
                    iconName: 'local_post_office',
                  }),
                  m(TextInput, {
                    id: 'country',
                    initialValue: organisation.country,
                    onchange: (v: string) => (organisation.country = v),
                    label: 'Country',
                    iconName: 'flag',
                  }),
                ],
                m('row', [
                  m(Button, {
                    iconName: 'undo',
                    class: `green ${hasChanged ? '' : 'disabled'}`,
                    onclick: () => (organisation = deepCopy(original)),
                  }),
                  ' ',
                  m(Button, {
                    iconName: 'save',
                    class: `green ${hasChanged ? '' : 'disabled'}`,
                    onclick: onsubmit,
                  }),
                  ' ',
                  m(Button, {
                    iconName: 'delete',
                    class: 'red',
                    onclick: () => deleteOrganisation(organisation),
                  }),
                ]),
              ]
            : [],
        ])
      );
    },
  };
};
