import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';
import { MaterialDto } from './material.dto';

export class UpdateClothingDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  size?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  color?: string;

  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsUUID()
  collectionId?: string | null;

  @ValidateIf((_, value) => value !== undefined && value !== null)
  @ValidateNested()
  @Type(() => CreateCollectionDto)
  collection?: CreateCollectionDto | null;

  @ValidateIf((_, value) => value !== undefined)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  materials?: MaterialDto[];
}
