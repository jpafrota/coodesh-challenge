import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { DictionaryService } from "./dictionary.service";

@Controller("entries/en")
@UseGuards(JwtAuthGuard)
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get(":word")
  getWord(@Param("word") word: string) {
    return { message: "Word: " + word };
  }

  @Post(":word/favorite")
  favoriteWord(@Param("word") word: string) {
    return { message: "Adding to favorites: " + word };
  }

  @Delete(":word/unfavorite")
  unfavoriteWord(@Param("word") word: string) {
    return { message: "Removing from favorites: " + word };
  }
}
