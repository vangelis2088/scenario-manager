import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrialModule } from './api/trials/trial.module';
import { RepoModule } from './api/repo/repo.module';
import { TimeEventsModule } from './api/time';
import { KafkaModule } from './adapters/kafka';

// console.log('DIR: ' + __dirname);

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    KafkaModule,
    TrialModule,
    RepoModule,
    TimeEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
