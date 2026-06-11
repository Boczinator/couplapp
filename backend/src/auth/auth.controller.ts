import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { JwtService } from '@nestjs/jwt'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) { }
    
    @Post('login')
    async login(@Body() { email, password}: LoginUserDto) {
        const user = await this.authService.validateUser({ email, password })

        if (!user) {
            this.jwtService.
        }
    }
}
