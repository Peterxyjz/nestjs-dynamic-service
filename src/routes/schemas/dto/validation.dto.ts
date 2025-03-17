// src/routes/schemas/dto/validation.dto.ts
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateValidationDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsObject()
  validationSchema: Record<string, any>

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  associatedSchemas?: string[]
}

export class UpdateValidationDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsObject()
  validationSchema?: Record<string, any>

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  associatedSchemas?: string[]
}

export class AssociateValidationDto {
  @IsNotEmpty()
  @IsString()
  validationName: string
}
