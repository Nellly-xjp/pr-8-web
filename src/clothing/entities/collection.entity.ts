import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClothingEntity } from './clothing.entity';

@Entity('collections')
export class CollectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  season: string;

  @OneToMany(() => ClothingEntity, (clothing) => clothing.collection)
  clothes: ClothingEntity[];
}