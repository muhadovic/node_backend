import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './services/config.services';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors();
  const swaggerUrl = config.get('swagger_url');
  const port = config.get('port');
  const host = config.get('host');
  if (swaggerUrl) {
    const options = new DocumentBuilder()
        .setTitle('Api documentation')
        .addBearerAuth('Authorization', 'header', 'apiKey')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerUrl, app, document);

  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, host, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server is running http://${host}:${port}/`);
    if (swaggerUrl) {
      // tslint:disable-next-line:no-console
      console.log(`Swagger is running http://${host}:${port}/${swaggerUrl}`);
    }
  });
}

bootstrap();