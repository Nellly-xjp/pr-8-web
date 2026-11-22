import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CollectionEntity } from './collection.entity';
import { MaterialEntity } from './material.entity';

@Entity('clothing')
export class ClothingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 20 })
  size: string;

  @Column({ type: 'varchar', length: 100 })
  color: string;

  @ManyToOne(() => CollectionEntity, (collection) => collection.clothes, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionEntity | null;

  @ManyToMany(() => MaterialEntity, (material) => material.clothes, {
    cascade: true,
  })
  @JoinTable({
    name: 'clothing_materials',
    joinColumn: { name: 'clothing_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'material_id', referencedColumnName: 'id' },
  })
  materials: MaterialEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}