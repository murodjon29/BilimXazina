import { Repository } from 'typeorm';
import { IFindOtions } from './interface';

export class BaseService<CreateDto, Entity> {
  constructor(private readonly repository: Repository<any>) {}

  get getRepository() {
    return this.repository;
  }

  async create(dto: CreateDto) {
    let created_data = this.repository.create({ ...dto }) as unknown as Entity;
    created_data = await this.repository.save(created_data);
    return {
      status_code: 201,
      message: 'success',
      date: created_data,
    };
  }

  async findAll(options?: IFindOtions<Entity>) {
    const data = (await this.repository.find({ ...options })) as Entity[];
    return {
      status_code: 200,
      message: 'success',
      data: data,
    };
  }

  // async findAllWithPagination(options?: IFindOtions<Entity>) {
  //     return await RepositoryPager.
  // }
}
