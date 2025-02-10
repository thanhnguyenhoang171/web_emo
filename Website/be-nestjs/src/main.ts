import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {TransformInterceptor } from './core/transform.interceptor'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Config extract metadata with reflector
  const reflector = app.get(Reflector)

  // config Global Pipes
  app.useGlobalPipes(new ValidationPipe());

  //config cookies
  app.use(cookieParser());

  // Config global auth guard
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  // Config configService
  const configService = app.get(ConfigService);

  // Config custom response message with interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector))

  // Config public file
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Config version
  app.setGlobalPrefix("api")
  app.enableVersioning(
    {
      type: VersioningType.URI,
      defaultVersion: ['1']
    }
  );

  // Config CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  })

  // Config host, port
  const port = configService.get<string>('PORT') || 3002;
  const host = configService.get<string>('HOST')

  // Start application
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}, Port: ${port}`);
}
bootstrap();
