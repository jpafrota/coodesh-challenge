import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DictionaryModule } from "./dictionary/dictionary.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    DictionaryModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
