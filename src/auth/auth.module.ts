import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schema/user.schema";
import { OTP, OTPSchema } from "./schema/otp.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EmailService } from "src/common/utils/email.util";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { JwtStrategy } from "./jwt.strategy";
import { Role, RoleSchema } from "src/role/schema/role.schema";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: OTP.name, schema: OTPSchema},
            { name: AuditLog.name, schema: AuditLogSchema},
            { name: Role.name, schema: RoleSchema }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, EmailService],
    exports: [JwtModule]
})

export class AuthModule { }