import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import axios from 'axios';
import { Word } from './schemas/word.schema';
import { PaginationDto, PaginationResponseDto } from '../common/dto/pagination.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Word.name) private wordModel: Model<Word>,
    private usersService: UsersService,
  ) {}

  async getWords(paginationDto: PaginationDto): Promise<PaginationResponseDto<string>> {
    const { page = 1, limit = 20, search } = paginationDto;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = { word: { $regex: search, $options: 'i' } };
    }

    const [words, totalDocs] = await Promise.all([
      this.wordModel.find(query, 'word').skip(skip).limit(limit).lean(),
      this.wordModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      results: words.map(w => w.word),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getWordDefinition(word: string, userId: ObjectId): Promise<any> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    
    try {
      const response = await axios.get(url);
      
      // Save to user history via users service
      await this.usersService.addToHistory(userId, word.toLowerCase());
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Word not found');
      }
      throw new Error('Failed to fetch word definition');
    }
  }

  async addToFavorites(userId: ObjectId, word: string): Promise<void> {
    await this.usersService.addToFavorites(userId, word);
  }

  async removeFromFavorites(userId: ObjectId, word: string): Promise<void> {
    await this.usersService.removeFromFavorites(userId, word);
  }
}
