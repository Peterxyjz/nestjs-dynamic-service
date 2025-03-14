import { SchemasModule } from '@/routes/schemas/schemas.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import databaseConfig from 'src/config/database.config'

const routesModules = [SchemasModule]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env']
    }),
    //database module
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri')
        const dbName = configService.get<string>('database.name')
        return {
          uri,
          dbName,
          connectionFactory: (connection) => {
            return connection
          }
        }
      },
      inject: [ConfigService]
    }),
    ...routesModules
  ]
})
export class AppModule {}
