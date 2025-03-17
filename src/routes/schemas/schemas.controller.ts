// src/routes/schemas/schemas.controller.ts
import { CreateSchemaDto, UpdateSchemaDto } from '@/routes/schemas/dto/schema.dto'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { DynamicDataService } from './dynamic-data.service'
import { SchemasService } from './schemas.service'

@Controller('schemas')
export class SchemasController {
  constructor(
    private readonly schemasService: SchemasService,
    private readonly dynamicDataService: DynamicDataService
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createSchemaDto: CreateSchemaDto) {
    try {
      // Explicitly extract fields to ensure proper data structure
      const { name, description, jsonSchema } = createSchemaDto
      return await this.schemasService.create({
        name,
        description,
        jsonSchema
      })
    } catch (error) {
      console.error('Error creating schema:', error)
      throw error
    }
  }

  @Get()
  findAll() {
    return this.schemasService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemasService.findOne(id)
  }

  @Get('by-name/:name')
  findByName(@Param('name') name: string) {
    return this.schemasService.findByName(name)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateSchemaDto: UpdateSchemaDto) {
    return this.schemasService.update(id, updateSchemaDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schemasService.remove(id)
  }

  // Dynamic data endpoints
  @Post(':schemaName/data')
  createData(
    @Param('schemaName') schemaName: string,
    @Body() data: Record<string, any>,
    @Query('skipValidation') skipValidation?: string
  ) {
    return this.dynamicDataService.insert(schemaName, data, {
      skipValidation: skipValidation === 'true'
    })
  }

  @Get(':schemaName/data')
  findAllData(@Param('schemaName') schemaName: string) {
    return this.dynamicDataService.findAll(schemaName)
  }

  @Get(':schemaName/data/:id')
  findOneData(@Param('schemaName') schemaName: string, @Param('id') id: string) {
    return this.dynamicDataService.findOne(schemaName, id)
  }

  @Put(':schemaName/data/:id')
  updateData(
    @Param('schemaName') schemaName: string,
    @Param('id') id: string,
    @Body() data: Record<string, any>,
    @Query('skipValidation') skipValidation?: string
  ) {
    return this.dynamicDataService.update(schemaName, id, data, {
      skipValidation: skipValidation === 'true'
    })
  }

  @Delete(':schemaName/data/:id')
  removeData(@Param('schemaName') schemaName: string, @Param('id') id: string) {
    return this.dynamicDataService.remove(schemaName, id)
  }

  // Test validation for schema data without inserting
  @Post(':schemaName/validate')
  validateData(
    @Param('schemaName') schemaName: string,
    @Body() data: Record<string, any>
  ) {
    // This will throw an error if validation fails
    return this.dynamicDataService
      .validateSchemaData(schemaName, data, false)
      .then((validatedData) => ({
        valid: true,
        message: 'Data is valid against all active validations for this schema',
        data: validatedData
      }))
  }
}
