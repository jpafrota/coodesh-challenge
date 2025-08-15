import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  getProfileInfo() {
    return {};
  }

  @Get("/me/history")
  getWordViewHistory() {
    return {};
  }

  @Get("/me/favorites")
  getFavoriteWords() {
    return {};
  }
}
