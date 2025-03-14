// src/schemas/entities/schema.entity.ts
import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@SchemaDecorator()
export class Schema {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ type: Object, required: true })
  jsonSchema: Record<string, any>

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export type SchemaDocument = Schema & Document
export const SchemaSchema = SchemaFactory.createForClass(Schema)
