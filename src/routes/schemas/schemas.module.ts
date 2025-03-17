// src/routes/schemas/schemas.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DynamicDataService } from './dynamic-data.service'
import { Schema, SchemaSchema } from './entities/schema.entity'
import { Validation, ValidationSchema } from './entities/validation.entity'
import { SchemaValidationService } from './schema-validation.service'
import { SchemasController } from './schemas.controller'
import { SchemasService } from './schemas.service'
import { ValidationsController } from './validations.controller'
import { ValidationsService } from './validations.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schema.name, schema: SchemaSchema },
      { name: Validation.name, schema: ValidationSchema }
    ])
  ],
  controllers: [SchemasController, ValidationsController],
  providers: [
    SchemasService,
    DynamicDataService,
    SchemaValidationService,
    ValidationsService
  ],
  exports: [
    SchemasService,
    DynamicDataService,
    SchemaValidationService,
    ValidationsService
  ]
})
export class SchemasModule {}
