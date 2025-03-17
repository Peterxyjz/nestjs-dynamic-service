// src/routes/schemas/schema-validation.service.ts
import { BadRequestException, Injectable } from '@nestjs/common'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ValidationsService } from './validations.service'

@Injectable()
export class SchemaValidationService {
  private ajv: Ajv

  constructor(private validationsService: ValidationsService) {
    // Initialize Ajv with preferred options
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      $data: true,
      strict: false
    })
    // Add formats
    addFormats(this.ajv)
  }

  /**
   * Validates data against all active validations for a schema
   * @param schemaName Name of the schema
   * @param data Data to validate
   * @param skipValidation Optional flag to skip validation
   * @returns Data if validation passes
   * @throws BadRequestException if validation fails
   */
  async validateData(
    schemaName: string,
    data: Record<string, any>,
    skipValidation = false
  ): Promise<Record<string, any>> {
    // Skip validation if requested
    if (skipValidation) {
      return data
    }

    // Get all active validations for this schema
    const validations = await this.validationsService.findForSchema(schemaName)

    // If no validations are associated or active, return data as-is
    if (validations.length === 0) {
      return data
    }

    // Run each validation
    const errors: any[] = []

    for (const validation of validations) {
      // Compile the validation schema
      const validate = this.ajv.compile(validation.validationSchema)

      // Validate the data
      const valid = validate(data)

      if (!valid && validate.errors) {
        // Collect errors from this validation
        errors.push({
          validationName: validation.name,
          errors: validate.errors.map((error) => ({
            path: error.instancePath || '/',
            message: error.message,
            params: error.params
          }))
        })
      }
    }

    // If any validation failed, throw error
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors
      })
    }

    return data
  }

  /**
   * Validates a specific validation by name
   * @param validationName Name of the validation to use
   * @param data Data to validate
   * @returns Data if validation passes
   * @throws BadRequestException if validation fails
   */
  async validateWithSpecificValidation(
    validationName: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    // Get the validation
    const validation = await this.validationsService.findByName(validationName)

    // Skip validation if it's not active
    if (!validation.isActive) {
      return data
    }

    // Compile the validation schema
    const validate = this.ajv.compile(validation.validationSchema)

    // Validate the data
    const valid = validate(data)

    if (!valid) {
      // Format validation errors
      const errors = (validate.errors || []).map((error) => ({
        path: error.instancePath || '/',
        message: error.message,
        params: error.params
      }))

      throw new BadRequestException({
        message: `Validation failed for ${validationName}`,
        errors
      })
    }

    return data
  }

  /**
   * Validates a JSON Schema for correctness
   * @param schema JSON Schema to validate
   * @returns true if valid, throws error otherwise
   */
  validateJsonSchema(schema: Record<string, any>): boolean {
    try {
      // Attempt to compile the schema to check if it's valid
      this.ajv.compile(schema)
      return true
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid JSON Schema',
        details: error.message
      })
    }
  }
}
