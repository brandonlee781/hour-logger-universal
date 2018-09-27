import { enableProdMode } from '@angular/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

enableProdMode();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: 'GET',
    maxAge: 3600,
  });
  await app.listen(4000);
}
bootstrap().catch(err => console.error(err));
