import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { User, UserSchema } from "src/user/schema/user.schema";
import { Employment, EmploymentSchema } from "./schema/employment.schema";
import { EmploymentController } from "./employment.controller";
import { EmploymentService } from "./employment.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { RoleModule } from "src/role/role.module";
import { AuthModule } from "src/auth/auth.module";
import { Citizen, CitizenSchema } from "src/citizen/schema/citizen.schema";

@Module({
    imports: [
        RoleModule,
        AuthModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: AuditLog.name, schema: AuditLogSchema },
            { name: Employment.name, schema: EmploymentSchema },
            { name: Citizen.name, schema: CitizenSchema }
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