import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {ReviewController} from "./review.controller";
import {ReviewService} from "./review.service";
import { ReviewEntity } from 'src/core/entitys/review.Entity';


@Module({
    imports: [TypeOrmModule.forFeature([ReviewEntity])],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {}