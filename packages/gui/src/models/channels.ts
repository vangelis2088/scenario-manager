import { messageBus } from '../services/message-bus-service';
import { IObjective } from './objective';
import { IScenario } from './scenario';

export const ChannelNames = {
  DEFAULT_CHANNEL: 'DEFAULT_CHANNEL',
  SCENARIO: 'SCENARIO',
  OBJECTIVE: 'OBJECTIVE',
  STORYLINE: 'STORYLINE',
  ACT: 'ACT',
  INJECT: 'INJECT',
};

export const TopicNames = {
  ALL: '#',
  ITEM: 'ITEM',
  ITEM_SELECT: 'ITEM.SELECT',
  ITEM_CREATE: 'ITEM.CREATE',
  ITEM_DELETE: 'ITEM.DELETE',
  ITEM_UPDATE: 'ITEM.UPDATE',
  LIST: 'LIST',
  LIST_CREATE: 'LIST.CREATE',
  LIST_DELETE: 'LIST.DELETE',
  LIST_UPDATE: 'LIST.UPDATE',
};

export const objectiveChannel = messageBus.channel<{ cur: IObjective; old?: IObjective }>(
  ChannelNames.OBJECTIVE
);
export const scenarioChannel = messageBus.channel<{ cur: IScenario; old?: IScenario }>(
  ChannelNames.SCENARIO
);
