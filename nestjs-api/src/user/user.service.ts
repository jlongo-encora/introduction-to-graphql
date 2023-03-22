import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

const users: User[] = [
  Object.assign(new User(), {
    uid: 1,
    firstName: 'João',
    lastName: 'Longo',
    age: 34,
  }),
  Object.assign(new User(), {
    uid: 2,
    firstName: 'Test',
    lastName: 'User',
    age: 18,
  }),
];

@Injectable()
export class UserService {
  async getUser(uid: number): Promise<User | undefined> {
    return users.find(user => user.uid === uid);
  }

  async getUsers(): Promise<User[]> {
    return users;
  }
}
