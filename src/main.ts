// src/main.ts
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  })

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )

  // Enable CORS
  app.enableCors()

  // Global API prefix
  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT ?? 3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
