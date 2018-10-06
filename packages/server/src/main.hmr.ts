import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.enableCors({
  //   origin: 'http://localhost:1234',
  //   credentials: true,
  // });

  const options = new DocumentBuilder()
    .setTitle('Scenario manager example')
    .setDescription('The scenario manager API description')
    .setVersion('1.0')
    .addTag('scenario')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.SCENARIO_MANAGER_SERVER_PORT || 3000;
  await app.listen(port, () => {
    console.log(
      `SCENARIO_MANAGER_REST_SERVICE is listening on port ${port}. Swagger documentation is available at 'http://localhost:${port}/api'.`,
    );
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();