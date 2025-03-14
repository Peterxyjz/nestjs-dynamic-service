// import envConfig from '@/config/config'
// import { INestApplication } from '@nestjs/common'
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// function setupSwagger(app: INestApplication) {
//   const appName = envConfig.APP_NAME
//   const url = envConfig.APP_URL

//   const config = new DocumentBuilder()
//     .setTitle(appName)
//     .setDescription('The ' + appName + ' API description')
//     .setVersion('1.0')
//     .addBearerAuth()
//     // .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
//     .addServer(url)
//     .build()
//   const document = SwaggerModule.createDocument(app, config)
//   SwaggerModule.setup('api-docs', app, document, {
//     customSiteTitle: appName,
//     swaggerOptions: {
//       tagsSorter: 'alpha',
//       operationsSorter: '-method'
//     }
//   })
// }

// export default setupSwagger
