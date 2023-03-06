import m from 'mithril';
//import { TextInput, TextArea, Select, Button, Icon, Collapsible } from 'mithril-materialized';
import { TextInput, Button, Icon } from 'mithril-materialized';
import { IResource, deepCopy, deepEqual } from 'trial-manager-models';
import { MeiosisComponent } from '../../services';
import {  getResources, getStakeholders } from '../../utils';


export const ResourceForm: MeiosisComponent = () => {
  let resource = {} as IResource;

  return {
    view: ({
      attrs: {
        state: {
          app: { trial, resourceId },
        },
        actions: { updateResource, deleteResource },
      },
    }) => {
      const resources = getResources(trial);
      if (!resourceId) {
        return m(
          'p',
          m(
            'i',
            `Please, create a resource using the + button${
              resources.length > 0 ? ', or select one in the tree' : ''
            }.`
          )
        );
      }
      const original = resources.filter((s: { id: string; }) => s.id === resourceId).shift() || ({} as IResource);
      if (!resource || original.id !== resource.id) {
        resource = deepCopy(original);
      }
      const hasChanged = !deepEqual(resource, original);
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
        if (resource) {
          console.log(resource);
          updateResource(resource);
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
          resource
            ? [
                m('h4', [
                  m(Icon, {
                    iconName: 'my_location',
                    style: 'margin-right: 12px;',
                  }),
                  'Resource details',
                ]),
                [
                  m(TextInput, {
                    id: 'name',
                    initialValue: resource.name,
                    onchange: (v: string) => (resource.name = v),
                    label: 'Resource name',
                    iconName: 'title',
                  }),
                  /*
                  m(TextInput, {
                    id: 'resource_number',
                    initialValue: resource.resource_num,
                    onchange: (v: string) => (resource.resource_num = parseInt(v)),
                    label: 'Number of resources',
                    iconName: 'web_asset',
                  }),
                  */
                ],
                m('row', [
                  m(Button, {
                    iconName: 'undo',
                    class: `green ${hasChanged ? '' : 'disabled'}`,
                    onclick: () => (resource = deepCopy(original)),
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
                    onclick: () => deleteResource(resource),
                  }),
                ]),
              ]
            : [],
        ])
      );
    },
  };
};
