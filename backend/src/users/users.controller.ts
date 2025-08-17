import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  getProfileInfo() {
    return {};
  }

  @Get("/me/history")
  @UseGuards(JwtAuthGuard)
  getWordViewHistory() {
    return {};
  }

  @Get("/me/favorites")
  getFavoriteWords() {
    return {};
  }
}
