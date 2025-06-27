import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateReviewDto} from "./dto/create-review.dto";
import {UpdateReviewDto} from "./dto/update-review.dto";
import { ReviewEntity } from "src/core/entitys/review.Entity";


@Injectable()
export class ReviewService{
    constructor(
        @InjectRepository(ReviewEntity) private readonly reviewRepo: Repository<ReviewEntity>
    ) { }

    async create(dto: CreateReviewDto){
        const review = this.reviewRepo.create(dto);
        return this.reviewRepo.save(review);
    }

    async findAll(){
        return this.reviewRepo.find({ relations: ['user', 'book'] });
    }

    async findOne(id: number){
        const review = await this.reviewRepo.findOne({where: {id},relations: ['user', 'book']});
        if(!review){
            throw new NotFoundException("Review not found");
        }
        return review;
    }

    async update(id: number,updDto: UpdateReviewDto, currentUserId: number , currentUserRole: string){
        const review = await this.reviewRepo.findOne({where: {id}, relations: ['user']});
        if(!review){
            throw new NotFoundException("Review not found");
        }
        // if (review.user.id !== currentUserId && currentUserRole !== 'admin') {
        //     throw new ForbiddenException('Вы не являетесь автором этого обзора');
        // }
        Object.assign(review, updDto);
        return this.reviewRepo.save(review);
    }

    async remove(id: number, currentUserId: number, currentUserRole: string){
        const review = await this.reviewRepo.findOne({where: {id}, relations: ['user']});
        if(!review){
            throw new NotFoundException("Review not found");
        }
        // if (review.user.id !== currentUserId && currentUserRole !== 'admin') {
        //     throw new ForbiddenException('Вы не являетесь автором этого обзора');
        // }
        return this.reviewRepo.delete(id);
    }
}