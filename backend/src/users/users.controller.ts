import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import type { ObjectId } from "mongoose";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {
  CurrentUser,
  UserId,
} from "../common/decorators/current-user.decorator";
import { PaginationDto } from "../common/dto/pagination.dto";
import { User } from "./users.schema";
import { UsersService } from "./users.service";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  getProfileInfo(@CurrentUser() user: User) {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  @Get("/me/history")
  async getWordViewHistory(
    @Query() paginationDto: PaginationDto,
    @UserId() userId: ObjectId,
  ) {
    return this.usersService.getUserHistory(userId, paginationDto);
  }

  @Get("/me/favorites")
  async getFavoriteWords(
    @Query() paginationDto: PaginationDto,
    @UserId() userId: ObjectId,
  ) {
    return this.usersService.getUserFavorites(userId, paginationDto);
  }
}
