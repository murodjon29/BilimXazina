import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from "../../users/entities/user.entity";
import { Book } from "../../books/entities/book.entity";

@Entity()
export class Review {
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

    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @ManyToOne(() => Book, (book) => book.reviews)
    book: Book;
}