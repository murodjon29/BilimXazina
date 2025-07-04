import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntitys {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'created_at',
    type: 'bigint',
    default: () => '(EXTRACT(epoch FROM NOW()) * 1000)::bigint',
  })
  createdAt: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
    default: () => '(EXTRACT(epoch FROM NOW()) * 1000)::bigint',
  })
  updated_at: number;
}
