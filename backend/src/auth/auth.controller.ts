import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  signup() {
    return { message: "Signed up!" };
  }

  @Post("/signin")
  signin() {
    return { message: "Signed in!" };
  }
}
