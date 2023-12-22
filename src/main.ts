import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';

const port = process.env.PORT || 4000;
const dev = process.env.NODE_ENV !== 'production';

if (dev) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
  
    app.enableCors({
      origin: (req, callback) => callback(null, true),
    });
    app.use(helmet());
  
    await app.listen(port);
  }
  bootstrap().then(() => {
    console.log('App is running on %s port', port);
  });
}

export async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}
