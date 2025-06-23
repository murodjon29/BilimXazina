import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

interface JwtUser {
    userId: number;
    email: string;
}

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Get()
    findAll() {
        return this.reviewService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.reviewService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdateReviewDto,
        @Request() req: ExpressRequest & { user: JwtUser },
    ) {
        return this.reviewService.update(+id, dto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(
        @Param('id') id: number,
        @Request() req: ExpressRequest & { user: JwtUser },
    ) {
        return this.reviewService.remove(+id, req.user.userId);
    }
}
