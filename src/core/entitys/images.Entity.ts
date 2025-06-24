import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BookEntity } from "./book.Entity";
import { BaseEntitys } from "src/common/database/base-entity";


@Entity('images')
export class ImagesEntity extends BaseEntitys {

    @Column({ type: 'varchar', nullable: false})
    image: string

    @ManyToOne(() => BookEntity, (book) => book.images)
    @JoinColumn({ name: 'book_id' })
    book: BookEntity
}