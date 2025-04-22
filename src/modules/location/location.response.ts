import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

class BaseLocationItemResponse {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsString()
  building!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  number!: string;

  @ApiProperty()
  @IsString()
  area!: string;
}

export class CreateLocationResponse {
  @ApiProperty()
  @IsInt()
  id!: number;
}

export class GetLocationDetailResponse extends BaseLocationItemResponse {
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: () => GetLocationDetailResponse, required: false })
  @IsOptional()
  parent?: GetLocationDetailResponse;
}

export class LocationListItemResponse extends BaseLocationItemResponse {
  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: () => LocationListItemResponse, required: false })
  @IsOptional()
  parent?: LocationListItemResponse;
}

export class LocationTreeResponse extends BaseLocationItemResponse {
  @ApiProperty({ type: () => [LocationTreeResponse], required: false })
  children!: LocationTreeResponse[];
}
