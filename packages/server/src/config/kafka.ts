import * as fs from 'fs';
import {
  LogLevel,
  ITestBedOptions,
  RequestChangeOfTrialStage,
  TrialManagementPhaseMessageTopic,
  TrialManagementRolePlayerTopic,
  TrialManagementSessionMgmtTopic,
} from 'node-test-bed-adapter';

export default {
  kafkaHost: process.env.KAFKA_HOST || 'tb4.driver-testbed.eu:3541',
  schemaRegistry: process.env.SCHEMA_REGISTRY || 'tb4.driver-testbed.eu:3542',
  // kafkaHost: process.env.KAFKA_HOST || 'localhost:3501',
  // schemaRegistry: process.env.SCHEMA_REGISTRY || 'localhost:3502',
  // kafkaHost: process.env.KAFKA_HOST || 'tb5.driver-testbed.eu:3551',
  // schemaRegistry: process.env.SCHEMA_REGISTRY || 'tb5.driver-testbed.eu:3552',
  // kafkaHost: 'driver-testbed.eu:3501',
  // schemaRegistry: 'driver-testbed.eu:3502',
  sslOptions: process.env.SSL === 'true'
    ? {
        pfx: fs.readFileSync(process.env.SSL_PFX || 'certs/TB-TrialMgmt.p12'),
        passphrase: process.env.SSL_PASSPHRASE || 'changeit',
        ca: fs.readFileSync(process.env.SSL_CA || 'certs/test-ca.pem'),
        rejectUnauthorized: true,
      }
    : undefined,
  clientId: process.env.CLIENT_ID || 'TB-TrialMgmt',
  fetchAllSchemas: false,
  fetchAllVersions: false,
  // autoRegisterSchemas: true,
  autoRegisterSchemas: false,
  wrapUnions: 'auto',
  schemaFolder: './data/schemas',
  // consume: [],
  produce: process.env.PRODUCE
    ? JSON.parse(process.env.PRODUCE)
    : [
        RequestChangeOfTrialStage,
        TrialManagementPhaseMessageTopic,
        TrialManagementRolePlayerTopic,
        TrialManagementSessionMgmtTopic,
        'standard_cap',
        'standard_geojson',
        // 'standard_named_geojson',
      ],
  logging: {
    logToConsole: LogLevel.Debug,
    logToKafka: LogLevel.Warn,
  },
} as ITestBedOptions;
