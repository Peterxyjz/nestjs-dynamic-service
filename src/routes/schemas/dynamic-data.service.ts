// src/routes/schemas/dynamic-data.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { ObjectId } from 'mongodb'
import { Connection } from 'mongoose'
import { SchemaValidationService } from './schema-validation.service'
import { SchemasService } from './schemas.service'
import { ValidationsService } from './validations.service'

@Injectable()
export class DynamicDataService {
  constructor(
    @InjectConnection() private connection: Connection,
    private schemasService: SchemasService,
    private validationService: SchemaValidationService,
    private validationsService: ValidationsService
  ) {}

  async createCollection(schemaName: string): Promise<void> {
    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }

    // Check if collection exists
    const collections = await this.connection.db
      .listCollections({ name: schemaName })
      .toArray()
    const exists = collections.length > 0

    // Only create if it doesn't exist
    if (!exists) {
      await this.connection.createCollection(schemaName)
      console.log(`Collection ${schemaName} created`)
    }
  }

  async insert(
    schemaName: string,
    data: Record<string, any>,
    options: { skipValidation?: boolean } = {}
  ): Promise<any> {
    // Validate data against all active validations for this schema
    const validatedData = await this.validationService.validateData(
      schemaName,
      data,
      options.skipValidation
    )

    // Create or ensure collection exists
    await this.createCollection(schemaName)

    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }

    const result = await this.connection.db.collection(schemaName).insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return { id: result.insertedId, ...validatedData }
  }

  async findAll(schemaName: string): Promise<any[]> {
    // Ensure schema exists
    await this.schemasService.findByName(schemaName)

    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }

    const collection = this.connection.db.collection(schemaName)
    return collection.find({}).toArray()
  }

  async findOne(schemaName: string, id: string): Promise<any> {
    // Ensure schema exists
    await this.schemasService.findByName(schemaName)

    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }

    const collection = this.connection.db.collection(schemaName)
    const document = await collection.findOne({ _id: new ObjectId(id) })

    if (!document) {
      throw new NotFoundException(
        `Document with ID ${id} not found in ${schemaName}`
      )
    }

    return document
  }

  async update(
    schemaName: string,
    id: string,
    data: Record<string, any>,
    options: { skipValidation?: boolean } = {}
  ): Promise<any> {
    // Validate data against schema
    const validatedData = await this.validationService.validateData(
      schemaName,
      data,
      options.skipValidation
    )

    // Ensure schema exists
    await this.schemasService.findByName(schemaName)

    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }

    const collection = this.connection.db.collection(schemaName)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...validatedData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new NotFoundException(
        `Document with ID ${id} not found in ${schemaName}`
      )
    }

    return result
  }

  async remove(schemaName: string, id: string): Promise<void> {
    // Ensure schema exists
    await this.schemasService.findByName(schemaName)

    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }

    const collection = this.connection.db.collection(schemaName)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Document with ID ${id} not found in ${schemaName}`
      )
    }
  }

  /**
   * Validates data against a specific validation
   * @param validationName Name of the validation to use
   * @param data Data to validate
   * @returns Validation result
   */
  async validateWithSpecificValidation(
    validationName: string,
    data: Record<string, any>
  ): Promise<any> {
    return this.validationService.validateWithSpecificValidation(
      validationName,
      data
    )
  }

  /**
   * Validates data against all active validations for a schema
   * @param schemaName Name of the schema
   * @param data Data to validate
   * @param skipValidation Option to skip validation
   * @returns Validated data
   */
  async validateSchemaData(
    schemaName: string,
    data: Record<string, any>,
    skipValidation = false
  ): Promise<Record<string, any>> {
    return this.validationService.validateData(schemaName, data, skipValidation)
  }
}
