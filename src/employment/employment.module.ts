import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { AuthService } from "src/auth/auth.service";
import { RoleService } from "src/role/role.service";
import { User, UserSchema } from "src/user/schema/user.schema";
import { Employment, EmploymentSchema } from "./schema/employment.schema";
import { EmploymentController } from "./employment.controller";
import { EmploymentService } from "./employment.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";

@Module({
    imports: [
        RoleService,
        AuthService,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: AuditLog.name, schema: AuditLogSchema },
            { name: Employment.name, schema: EmploymentSchema }
        ])
    ],
    controllers: [EmploymentController],
    providers: [
        EmploymentService,
        JwtAuthGuard,
        PermissionsGuard
    ],
    exports: [EmploymentService]
})

export class EmploymentModule { }