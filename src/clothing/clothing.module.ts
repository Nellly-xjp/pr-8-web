import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { ClothingEntity } from './entities/clothing.entity';
import { CollectionEntity } from './entities/collection.entity';
import { MaterialEntity } from './entities/material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClothingEntity,
      CollectionEntity,
      MaterialEntity,
    ]),
  ],
  controllers: [ClothingController],
  providers: [ClothingService],
})
export class ClothingModule {}
