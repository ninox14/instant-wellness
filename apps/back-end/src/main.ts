import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { cleanupOpenApiDoc } from 'nestjs-zod';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // FIXME: do proper cors setup
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(
    '/api/docs',
    apiReference({ content: cleanupOpenApiDoc(document), theme: 'deepSpace' }),
  );

  await app.listen(process.env.PORT || 3000);
};

bootstrap().catch(console.error);
