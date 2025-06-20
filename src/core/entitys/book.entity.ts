import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('books')
export class BookEntity extends BaseEntity {
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

  @Column({ type: 'enum', enum: Language, default: Language.UZ })
  language: string;

  @Column({ type: 'varchar', name: 'image' })
  image: string;

  @Column({ type: 'int' })
  quantity: number;
}
