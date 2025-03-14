// src/schemas/schemas.service.ts
import { CreateSchemaDto, UpdateSchemaDto } from '@/routes/schemas/dto/schema.dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Schema, SchemaDocument } from './entities/schema.entity'

@Injectable()
export class SchemasService {
  constructor(
    @InjectModel(Schema.name) private schemaModel: Model<SchemaDocument>
  ) {}

  async create(createSchemaDto: CreateSchemaDto): Promise<Schema> {
    try {
      const newSchema = new this.schemaModel({
        name: createSchemaDto.name,
        description: createSchemaDto.description,
        jsonSchema: createSchemaDto.jsonSchema
      })
      return await newSchema.save()
    } catch (error) {
      console.error('Error in SchemasService.create:', error)
      throw error
    }
  }

  async findAll(): Promise<Schema[]> {
    return this.schemaModel.find().exec()
  }

  async findOne(id: string): Promise<Schema> {
    const schema = await this.schemaModel.findById(id).exec()
    if (!schema) {
      throw new NotFoundException(`Schema with ID ${id} not found`)
    }
    return schema
  }

  async findByName(name: string): Promise<Schema> {
    const schema = await this.schemaModel.findOne({ name }).exec()
    if (!schema) {
      throw new NotFoundException(`Schema with name ${name} not found`)
    }
    return schema
  }

  async update(id: string, updateSchemaDto: UpdateSchemaDto): Promise<Schema> {
    const updatedSchema = await this.schemaModel
      .findByIdAndUpdate(
        id,
        {
          ...updateSchemaDto,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec()

    if (!updatedSchema) {
      throw new NotFoundException(`Schema with ID ${id} not found`)
    }
    return updatedSchema
  }

  async remove(id: string): Promise<Schema> {
    const deletedSchema = await this.schemaModel.findByIdAndDelete(id).exec()
    if (!deletedSchema) {
      throw new NotFoundException(`Schema with ID ${id} not found`)
    }
    return deletedSchema
  }
}
