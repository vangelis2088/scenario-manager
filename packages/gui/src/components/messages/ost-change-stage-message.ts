import m, { FactoryComponent } from 'mithril';
import { TextArea, TextInput, NumberInput } from 'mithril-materialized';
import { IInject, MessageType, IOstStageChangeMessage } from 'trial-manager-models';
import { getMessage } from '../../utils';

/** Request the Observer Support Tool to change the list of questions for the observers */
export const OstChangeStageMessageForm: FactoryComponent<{ inject: IInject }> = () => {
  return {
    view: ({ attrs: { inject } }) => {
      const pm = getMessage(inject, MessageType.CHANGE_OBSERVER_QUESTIONNAIRES) as IOstStageChangeMessage;

      return [
        m(TextInput, {
          id: 'title',
          initialValue: inject.title,
          onchange: (v: string) => (inject.title = v),
          label: 'Title',
          iconName: 'title',
        }),
        m(TextArea, {
          id: 'desc',
          initialValue: inject.description,
          onchange: (v: string) => (inject.description = v),
          label: 'Description',
          iconName: 'note',
        }),
        m(
          '.col.s6',
          m(NumberInput, {
            id: 'ts1',
            initialValue: pm.ostTrialSessionId,
            onchange: (v: number) => (pm.ostTrialSessionId = v),
            label: 'OST trial session ID',
            iconName: 'filter_1',
          })
        ),
        m(
          '.col.s6',
          m(NumberInput, {
            id: 'ts2',
            initialValue: pm.ostTrialStageId,
            onchange: (v: number) => (pm.ostTrialStageId = v),
            label: 'OST trial stage ID',
            iconName: 'filter_2',
          })
        ),
      ];
    },
  };
};