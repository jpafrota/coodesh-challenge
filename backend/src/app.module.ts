import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
