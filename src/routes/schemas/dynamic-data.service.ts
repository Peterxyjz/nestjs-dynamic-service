import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { ObjectId } from 'mongodb'
import { Connection } from 'mongoose'
import { SchemasService } from './schemas.service'

@Injectable()
export class DynamicDataService {
  constructor(
    @InjectConnection() private connection: Connection,
    private schemasService: SchemasService
  ) {}

  async createCollection(schemaName: string): Promise<void> {
    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }
    const collections = await this.connection.db
      .listCollections({ name: schemaName })
      .toArray()
    const exists = collections.length > 0
    if (!exists) {
      await this.connection.createCollection(schemaName)
    }
  }

  async insert(schemaName: string, data: Record<string, any>): Promise<any> {
    await this.createCollection(schemaName)
    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }
    const result = await this.connection.db.collection(schemaName).insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { id: result.insertedId, ...data }
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
    data: Record<string, any>
  ): Promise<any> {
    // Ensure schema exists
    await this.schemasService.findByName(schemaName)
    if (!this.connection.db) {
      throw new Error('Database connection is not established')
    }
    const collection = this.connection.db.collection(schemaName)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
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

  // Advanced method to validate data against schema before insertion
  async validateAgainstSchema(
    schemaName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputData: Record<string, any>
  ): Promise<boolean> {
    await this.schemasService.findByName(schemaName)

    // You can implement schema validation here using libraries like Ajv or joi
    // This is a placeholder
    console.log(`Validating against schema: ${schemaName}`)
    return true
  }
}
