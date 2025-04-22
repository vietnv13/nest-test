import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength, IsInt, IsOptional, MaxLength } from 'class-validator';

import { PagerDto } from '~/common/dto/pager.dto';

export class LocationQueryDto extends PagerDto {
  @ApiPropertyOptional({ description: 'Search keyword to match building, name, or number' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  q?: string;
}

export class CreateLocationDto {
  @ApiProperty({ description: 'Name of the building' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  building!: string;

  @ApiProperty({ description: 'Name of the location' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'Location number or identifier' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  number!: string;

  @ApiPropertyOptional({ description: 'Area of the location' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  area?: string;

  @ApiPropertyOptional({ description: 'Parent location ID, if this is a sub-location' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  parentId?: number;
}

export class UpdateLocationDto {
  @ApiPropertyOptional({ description: 'Updated building name' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  building?: string;

  @ApiPropertyOptional({ description: 'Updated location name' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Updated location number or identifier' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({ description: 'Updated area of location' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  area?: string;

  @ApiPropertyOptional({ description: 'Updated parent location ID' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  parentId?: number;
}
