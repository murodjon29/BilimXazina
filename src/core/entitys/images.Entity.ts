import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "./book.Entity";


@Entity('images')
export class ImagesEntity extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', nullable: false})
    image: string

    @ManyToOne(() => BookEntity, (book) => book.images, { onDelete: 'CASCADE' })
    book: BookEntity
}