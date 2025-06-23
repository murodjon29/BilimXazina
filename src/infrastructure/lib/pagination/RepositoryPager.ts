import { ObjectLiteral, Repository } from "typeorm";
import { Pager } from "./Pager";
import { IFindOtions, IResponse, IResponsePagination } from "../baseService/interface";

export class RepositoryPager{
    public static readonly DEFAULT_PAGE = 1;
    public static readonly DEFAULT_PAGE_SIZE = 10;

    public static async findAll<T extends ObjectLiteral>(
        repository: Repository<T>,
        message: string,
        options?: IFindOtions<T>
    ): Promise<IResponsePagination<T>> {
        const [data, count] = await repository.findAndCount(RepositoryPager.normalizeOptions(options));
        return  Pager.of(
            data,
            count, 
            options?.take ?? this.DEFAULT_PAGE_SIZE,
            options?.skip ?? this.DEFAULT_PAGE,
            200,
            message
        );
    }

    private static normalizeOptions<T>(options?: IFindOtions<T>): IFindOtions<T> {
        let page = (options?.skip ?? RepositoryPager.DEFAULT_PAGE) - 1
        return {
            ...options,
            take: options?.take ?? this.DEFAULT_PAGE_SIZE,
            skip: options?.skip ?? this.DEFAULT_PAGE,
        };
    }
}