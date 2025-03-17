import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateValidationDto, UpdateValidationDto } from './dto/validation.dto'
import { Validation, ValidationDocument } from './entities/validation.entity'

@Injectable()
export class ValidationsService {
  constructor(
    @InjectModel(Validation.name) private validationModel: Model<ValidationDocument>
  ) {}

  async create(createValidationDto: CreateValidationDto): Promise<Validation> {
    try {
      const newValidation = new this.validationModel(createValidationDto)
      return await newValidation.save()
    } catch (error) {
      console.error('Error in ValidationsService.create:', error)
      throw error
    }
  }

  async findAll(): Promise<Validation[]> {
    return this.validationModel.find().exec()
  }

  async findOne(id: string): Promise<Validation> {
    const validation = await this.validationModel.findById(id).exec()
    if (!validation) {
      throw new NotFoundException(`Validation with ID ${id} not found`)
    }
    return validation
  }

  async findByName(name: string): Promise<Validation> {
    const validation = await this.validationModel.findOne({ name }).exec()
    if (!validation) {
      throw new NotFoundException(`Validation with name ${name} not found`)
    }
    return validation
  }

  async findForSchema(schemaName: string): Promise<Validation[]> {
    return this.validationModel
      .find({
        associatedSchemas: schemaName,
        isActive: true
      })
      .exec()
  }

  async update(
    id: string,
    updateValidationDto: UpdateValidationDto
  ): Promise<Validation> {
    const updatedValidation = await this.validationModel
      .findByIdAndUpdate(
        id,
        {
          ...updateValidationDto,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec()

    if (!updatedValidation) {
      throw new NotFoundException(`Validation with ID ${id} not found`)
    }
    return updatedValidation
  }

  async updateByName(
    name: string,
    updateData: Partial<Validation>
  ): Promise<Validation> {
    const updatedValidation = await this.validationModel
      .findOneAndUpdate(
        { name },
        {
          ...updateData,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec()

    if (!updatedValidation) {
      throw new NotFoundException(`Validation with name ${name} not found`)
    }
    return updatedValidation
  }

  async toggleStatus(name: string, isActive: boolean): Promise<Validation> {
    return this.updateByName(name, { isActive })
  }

  async associateWithSchema(name: string, schemaName: string): Promise<Validation> {
    const validation = await this.findByName(name)

    if (!validation.associatedSchemas.includes(schemaName)) {
      validation.associatedSchemas.push(schemaName)
      return this.updateByName(name, {
        associatedSchemas: validation.associatedSchemas
      })
    }

    return validation
  }

  async disassociateFromSchema(
    name: string,
    schemaName: string
  ): Promise<Validation> {
    const validation = await this.findByName(name)

    validation.associatedSchemas = validation.associatedSchemas.filter(
      (schema) => schema !== schemaName
    )

    return this.updateByName(name, {
      associatedSchemas: validation.associatedSchemas
    })
  }

  async remove(id: string): Promise<Validation> {
    const deletedValidation = await this.validationModel.findByIdAndDelete(id).exec()
    if (!deletedValidation) {
      throw new NotFoundException(`Validation with ID ${id} not found`)
    }
    return deletedValidation
  }
}
