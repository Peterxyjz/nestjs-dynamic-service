// src/schemas/schemas.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DynamicDataService } from './dynamic-data.service'
import { Schema, SchemaSchema } from './entities/schema.entity'
import { SchemasController } from './schemas.controller'
import { SchemasService } from './schemas.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schema.name, schema: SchemaSchema }])
  ],
  controllers: [SchemasController],
  providers: [SchemasService, DynamicDataService],
  exports: [SchemasService, DynamicDataService]
})
export class SchemasModule {}
