import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookEntity } from "src/core/entitys/book.Entity";
import { OrderEntity } from "src/core/entitys/order.Entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, BookEntity])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}