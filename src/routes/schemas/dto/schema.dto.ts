// src/schemas/dto/create-schema.dto.ts
import { IsNotEmpty, IsObject, IsString } from 'class-validator'

export class CreateSchemaDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsObject()
  jsonSchema: Record<string, any>
}

// src/schemas/dto/update-schema.dto.ts
import { IsOptional } from 'class-validator'

export class UpdateSchemaDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsObject()
  jsonSchema?: Record<string, any>
}
