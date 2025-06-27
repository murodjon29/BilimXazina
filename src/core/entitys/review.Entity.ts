import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { BookEntity } from './book.Entity';
// import {User} from "../../users/entities/user.entity";

@Entity()
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column()
    bookId: number;

    // @ManyToOne(() => User, (user) => user.reviews)
    // user: User;

    @ManyToOne(() => BookEntity, (book) => book.reviews)
    @JoinColumn({ name: 'book_id' })
    book: BookEntity;
}