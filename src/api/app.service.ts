import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from 'src/infrastructure/exception/all.exception.filter';
import * as cookieParser from 'cookie-parser';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'src/config';

export class Application {
  public static async main(): Promise<void> {
    let app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionFilter());
    app.use(cookieParser());
    app.enableCors({
      origin: '*',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    const api = 'api/v1';
    app.setGlobalPrefix(api);
    const config_swagger = new DocumentBuilder()
      .setTitle('Bilim Xazna')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        in: 'header',
      })
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config_swagger);
    SwaggerModule.setup(api, app, documentFactory);
    await app.listen(config.API_PORT, () =>
      console.log(Date.now(), 'Server is running on PORT:', config.API_PORT),
    );
  }
}
