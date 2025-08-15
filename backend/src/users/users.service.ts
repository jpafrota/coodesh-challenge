import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel({
      email: "jorgepabloafrota@gmail.com",
      name: " Jorge",
      password: "pass",
    });
    return await createdUser.save();
  }
}
