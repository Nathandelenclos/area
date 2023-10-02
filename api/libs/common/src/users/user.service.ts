import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/users/user.entity';
import { Repository } from 'typeorm';
import { NewUser } from '@app/common/users/user.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
  }

  async create(data: NewUser) {
    const salt: number = +this.configService.get('BCRYPT_SALT');
    const hashedPassword: string = await hash(data.password, salt);
    const user = await this.userRepository.save({...data, password: hashedPassword});
    const {password, ...response} = user;
    return response;
  }

  findOne(query: any): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: query,
    });
  }
}