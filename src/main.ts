declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './common/config/app.config';
import configuration from './common/config/configuration';
import * as dotenv from 'dotenv';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  app.setGlobalPrefix(`${appConfig.prefix}/${appConfig.version}`);

  // Set up validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );

  // Set up Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Video Share Application')
    .setDescription('API Documentation')
    .setVersion(appConfig.version)
    .addTag('video-share')
    .addServer(`${appConfig.domain}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();
  await app.listen(configuration().app.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
