import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/db/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  // private readonly users: Record<string, User> = {};

  constructor(@InjectRepository(Users) private readonly usersRepo: Repository<Users>) {}

  async findOne(name: string): Promise<User> {
    // return Object.values(this.users).find((user) => user.name === name );
    return await this.usersRepo.findOneBy({ name });
  }

  async createOne({ name, password }: User): Promise<User> {
    const id = v4();
    const newUser = { id, name, password };

    // this.users[ id ] = newUser;

    const res = await this.usersRepo.insert(newUser);

    console.log(res)

    return newUser;
  }
}
