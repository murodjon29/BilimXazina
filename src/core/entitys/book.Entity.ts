import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { ImagesEntity } from './images.Entity';
import Languages from 'src/common/enum/language';
import { BaseEntitys } from 'src/common/database/base-entity';
import { OrderEntity } from './order.Entity';
import { ReviewEntity } from './review.Entity';

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

  @Column({type: 'int'})
  barcode: number;

  @OneToMany(() => ImagesEntity, (images) => images.book, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  images: ImagesEntity[];

  @OneToMany(() => OrderEntity, order => order.book, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity[];

  @OneToMany(() => ReviewEntity, review => review.book, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: ReviewEntity[]
    reviews: any;
}

