import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { ObjectId } from "mongoose";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { DictionaryService } from "./dictionary.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { UserId } from "../common/decorators/current-user.decorator";

@Controller("entries/en")
@UseGuards(JwtAuthGuard)
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  async getWords(@Query() paginationDto: PaginationDto) {
    return this.dictionaryService.getWords(paginationDto);
  }

  @Get(":word")
  async getWord(@Param("word") word: string, @UserId() userId: ObjectId) {
    try {
      return await this.dictionaryService.getWordDefinition(word, userId);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        error.message === 'Word not found' ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post(":word/favorite")
  async favoriteWord(@Param("word") word: string, @UserId() userId: ObjectId) {
    await this.dictionaryService.addToFavorites(userId, word);
    return {};
  }

  @Delete(":word/unfavorite")
  async unfavoriteWord(@Param("word") word: string, @UserId() userId: ObjectId) {
    await this.dictionaryService.removeFromFavorites(userId, word);
    return {};
  }
}
