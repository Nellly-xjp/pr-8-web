import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClothingEntity } from './clothing.entity';

@Entity('materials')
export class MaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  percentage: number | null;

  @ManyToMany(() => ClothingEntity, (clothing) => clothing.materials)
  clothes: ClothingEntity[];
}
