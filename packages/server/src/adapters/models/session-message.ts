import { ApiModelProperty } from '@nestjs/swagger';
import { ISessionMgmt, SessionState } from 'trial-manager-models';

export class SessionMessage implements ISessionMgmt {
  @ApiModelProperty()
  public trialId: string;
  @ApiModelProperty()
  public trialName: string;
  @ApiModelProperty()
  public scenarioId: string;
  @ApiModelProperty()
  public scenarioName: string;
  @ApiModelProperty()
  public sessionId: string;
  @ApiModelProperty()
  public sessionName: string;
  @ApiModelProperty()
  public sessionState: SessionState;

  constructor(session: ISessionMgmt) {
    this.trialId = session.trialId;
    this.trialName = session.trialName;
    this.scenarioId = session.scenarioId;
    this.scenarioName = session.scenarioName;
    this.sessionId = session.sessionId;
    this.sessionName = session.sessionName;
    this.sessionState = session.sessionState;
  }
}
