import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { INestApplicationContext } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
  });

  class CustomIoAdapter extends IoAdapter {
    constructor(app: INestApplicationContext) {
      super(app);
    }

    createIOServer(port: number | any, options?: any) {
      const wsOptions = {
        ...(options || {}),
        cors: {
          origin: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          credentials: true
        }
      };
      return super.createIOServer(port, wsOptions);
    }
  }

  app.useWebSocketAdapter(new CustomIoAdapter(app));

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server running on http://0.0.0.0:${port}`);
}
bootstrap();
