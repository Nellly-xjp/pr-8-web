import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { MaterialDto } from './dto/material.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { ClothingEntity } from './entities/clothing.entity';
import { CollectionEntity } from './entities/collection.entity';
import { MaterialEntity } from './entities/material.entity';

@Injectable()
export class ClothingService {
  constructor(
    @InjectRepository(ClothingEntity)
    private readonly clothingRepository: Repository<ClothingEntity>,
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async createCollection(dto: CreateCollectionDto): Promise<CollectionEntity> {
    return this.collectionRepository.save(
      this.collectionRepository.create(dto),
    );
  }

  async create(dto: CreateClothingDto): Promise<ClothingEntity> {
    const clothing = this.clothingRepository.create({
      title: dto.title,
      price: dto.price,
      size: dto.size,
      color: dto.color,
    });

    clothing.collection = await this.resolveCollection(dto);
    clothing.materials = await this.resolveMaterials(dto.materials ?? []);

    return this.clothingRepository.save(clothing);
  }

  async findAll(material?: string): Promise<ClothingEntity[]> {
    if (material !== undefined) {
      return this.clothingRepository
        .createQueryBuilder('clothing')
        .innerJoinAndSelect('clothing.materials', 'material')
        .leftJoinAndSelect('clothing.collection', 'collection')
        .where('material.name = :material', { material })
        .getMany();
    }

    return this.clothingRepository.find({
      relations: { collection: true, materials: true },
    });
  }

  async findOne(id: string): Promise<ClothingEntity> {
    const clothing = await this.clothingRepository.findOne({
      where: { id },
      relations: { collection: true, materials: true },
    });

    if (!clothing) {
      throw new NotFoundException(`Clothing item "${id}" not found`);
    }
    return clothing;
  }

  async update(id: string, dto: UpdateClothingDto): Promise<ClothingEntity> {
    const clothing = await this.findOne(id);
    Object.assign(clothing, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.size !== undefined && { size: dto.size }),
      ...(dto.color !== undefined && { color: dto.color }),
    });

    if (dto.collectionId !== undefined || dto.collection !== undefined) {
      clothing.collection = await this.resolveCollection(dto);
    }
    if (dto.materials !== undefined) {
      clothing.materials = await this.resolveMaterials(dto.materials);
    }

    return this.clothingRepository.save(clothing);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clothingRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Clothing item "${id}" not found`);
    }
  }

  private async resolveCollection(
    dto: Pick<CreateClothingDto, 'collectionId' | 'collection'>,
  ): Promise<CollectionEntity | null> {
    if (dto.collectionId) {
      const collection = await this.collectionRepository.findOneBy({
        id: dto.collectionId,
      });
      if (!collection) {
        throw new NotFoundException(
          `Collection "${dto.collectionId}" not found`,
        );
      }
      return collection;
    }

    if (dto.collection) {
      return this.collectionRepository.save(
        this.collectionRepository.create(dto.collection),
      );
    }
    return null;
  }

  private async resolveMaterials(
    materials: MaterialDto[],
  ): Promise<MaterialEntity[]> {
    if (materials.length === 0) {
      return [];
    }

    const existing = await this.materialRepository.findBy({
      name: In(materials.map(({ name }) => name)),
    });
    const materialsByName = new Map(
      existing.map((material) => [material.name, material]),
    );

    return materials.map((input) => {
      const material = materialsByName.get(input.name);
      if (material) {
        if (input.percentage !== undefined) {
          material.percentage = input.percentage;
        }
        return material;
      }
      const newMaterial = this.materialRepository.create({
        name: input.name,
        percentage: input.percentage ?? null,
      });
      materialsByName.set(newMaterial.name, newMaterial);
      return newMaterial;
    });
  }
}
