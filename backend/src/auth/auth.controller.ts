import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post("/signup")
  async signup() {
    await this.usersService.create({});
    return { message: "Signed up!" };
  }

  @Post("/signin")
  signin() {
    return { message: "Signed in!" };
  }
}
