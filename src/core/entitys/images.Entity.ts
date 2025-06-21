import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "./book.Entity";


@Entity('images')
export class ImagesEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', name: 'image' })
    image: string

    @ManyToOne(() => BookEntity, (book) => book.images)
    book: BookEntity
}