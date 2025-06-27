import { BaseEntitys } from "src/common/database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BookEntity } from "./book.Entity";


@Entity('orders')
export class OrderEntity extends BaseEntitys {
    @Column({ type: 'int' })
    book_quantity: number;
    
    @Column({ type: 'varchar' })
    description: string;


    @Column({ type: 'enum', enum: [], default: '' })
    status: string

    @Column({ type: 'float' })
    total_price: number;

    @ManyToOne(() => BookEntity, book => book.order)
    @JoinColumn({ name: 'book_id' })
    book: BookEntity;

}