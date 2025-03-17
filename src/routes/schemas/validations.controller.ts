// src/routes/schemas/validations.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateValidationDto, UpdateValidationDto } from './dto/validation.dto'
import { SchemaValidationService } from './schema-validation.service'
import { ValidationsService } from './validations.service'

@Controller('validations')
export class ValidationsController {
  constructor(
    private readonly validationsService: ValidationsService,
    private readonly schemaValidationService: SchemaValidationService
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createValidationDto: CreateValidationDto) {
    // Validate the validation schema
    this.schemaValidationService.validateJsonSchema(
      createValidationDto.validationSchema
    )

    return this.validationsService.create(createValidationDto)
  }

  @Get()
  findAll() {
    return this.validationsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.validationsService.findOne(id)
  }

  @Get('by-name/:name')
  findByName(@Param('name') name: string) {
    return this.validationsService.findByName(name)
  }

  @Get('for-schema/:schemaName')
  findForSchema(@Param('schemaName') schemaName: string) {
    return this.validationsService.findForSchema(schemaName)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateValidationDto: UpdateValidationDto
  ) {
    // Validate the validation schema if provided
    if (updateValidationDto.validationSchema) {
      this.schemaValidationService.validateJsonSchema(
        updateValidationDto.validationSchema
      )
    }

    return this.validationsService.update(id, updateValidationDto)
  }

  @Put('by-name/:name')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateByName(
    @Param('name') name: string,
    @Body() updateValidationDto: UpdateValidationDto
  ) {
    // Validate the validation schema if provided
    if (updateValidationDto.validationSchema) {
      this.schemaValidationService.validateJsonSchema(
        updateValidationDto.validationSchema
      )
    }

    return this.validationsService.updateByName(name, updateValidationDto)
  }

  @Put('toggle/:name')
  toggleStatus(@Param('name') name: string, @Body() body: { isActive: boolean }) {
    return this.validationsService.toggleStatus(name, body.isActive)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.validationsService.remove(id)
  }

  // Association management
  @Post(':name/associate')
  associateWithSchema(
    @Param('name') name: string,
    @Body() body: { schemaName: string }
  ) {
    return this.validationsService.associateWithSchema(name, body.schemaName)
  }

  @Delete(':name/disassociate')
  disassociateFromSchema(
    @Param('name') name: string,
    @Body() body: { schemaName: string }
  ) {
    return this.validationsService.disassociateFromSchema(name, body.schemaName)
  }

  // Test validation
  @Post('test/:name')
  async testValidation(
    @Param('name') name: string,
    @Body() data: Record<string, any>
  ) {
    // This will throw an error if validation fails
    await this.schemaValidationService.validateWithSpecificValidation(name, data)

    return {
      valid: true,
      message: `Data is valid against ${name} validation`,
      data
    }
  }
}
