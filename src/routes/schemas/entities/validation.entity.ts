// src/routes/schemas/entities/validation.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Validation {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ type: Object, required: true })
  validationSchema: Record<string, any>

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: [String], default: [] })
  associatedSchemas: string[]

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export type ValidationDocument = Validation & Document
export const ValidationSchema = SchemaFactory.createForClass(Validation)
