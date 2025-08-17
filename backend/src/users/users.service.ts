import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/users.schema";
import { UserHistory } from "./schemas/user-history.schema";
import {
  PaginationDto,
  PaginationResponseDto,
} from "../common/dto/pagination.dto";
import { HistoryItemDto } from "./dto/history.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserHistory.name) private userHistoryModel: Model<UserHistory>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async addToHistory(userId: ObjectId, word: string): Promise<void> {
    await this.userHistoryModel.findOneAndUpdate(
      { userId: userId, word },
      { $set: { added: new Date() } },
      { upsert: true },
    );
  }

  async getUserHistory(
    userId: ObjectId,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<HistoryItemDto>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [history, totalDocs] = await Promise.all([
      this.userHistoryModel
        .find({ userId: userId })
        .sort({ added: -1 })
        .skip(skip)
        .limit(limit)
        .select("word added")
        .lean(),
      this.userHistoryModel.countDocuments({
        userId: userId,
      }),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      results: history.map((h) => ({ word: h.word, added: h.added })),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async addToFavorites(userId: ObjectId, word: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $addToSet: {
          favoriteWords: { word: word.toLowerCase(), added: new Date() },
        },
      },
    );
  }

  async removeFromFavorites(userId: ObjectId, word: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          favoriteWords: { word: word.toLowerCase() },
        },
      },
    );
  }

  async getUserFavorites(
    userId: ObjectId,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<HistoryItemDto>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [favorites, totalDocs] = await Promise.all([
      // Get paginated favorites - unwind array, then apply ORM-like operations
      this.userModel
        .aggregate()
        .match({ _id: userId })
        .unwind("favoriteWords")
        .sort({ "favoriteWords.added": -1 })
        .skip(skip)
        .limit(limit)
        .project({
          word: "$favoriteWords.word",
          added: "$favoriteWords.added",
        }),

      // Get total count
      this.userModel
        .aggregate()
        .match({ _id: userId })
        .unwind("favoriteWords")
        .count("total")
        .then((result) => result[0]?.total || 0),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      results: favorites,
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
