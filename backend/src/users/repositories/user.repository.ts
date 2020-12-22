import { EntityRepository, Repository } from 'typeorm';

import { Users } from '@libs/entities';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {}
