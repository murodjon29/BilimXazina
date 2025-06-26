import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { ImagesEntity } from './images.Entity';
import Languages from 'src/common/enum/language';
import { BaseEntitys } from 'src/common/database/base-entity';

@Entity('books')
export class BookEntity extends BaseEntitys {

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'enum', enum: Languages, default: Languages.UZ })
  language: string;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => ImagesEntity, (images) => images.book, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  images: ImagesEntity[];
}

