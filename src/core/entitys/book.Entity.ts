import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ImagesEntity } from './images.Entity';
import Languages from 'src/common/enum/language';

@Entity('books')
export class BookEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number

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

  @Column({ type: 'varchar', name: 'image' })
  image: string;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => ImagesEntity, (images) => images.book)
  images: ImagesEntity[];
}

