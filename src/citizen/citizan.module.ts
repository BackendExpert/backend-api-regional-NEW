import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { AuthModule } from "src/auth/auth.module";
import { RoleModule } from "src/role/role.module";
import { User, UserSchema } from "src/user/schema/user.schema";
import { Citizen, CitizenSchema } from "./schema/citizen.schema";
import { CitizanController } from "./citizan.controller";
import { CitizenService } from "./citizen.service"
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";


@Module({
    imports: [
        RoleModule,
        AuthModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: AuditLog.name, schema: AuditLogSchema },
            { name: Citizen.name, schema: CitizenSchema }
        ])
    ],
    controllers: [CitizanController],
    providers: [
        CitizenService,
        JwtAuthGuard,
        PermissionsGuard,
    ],
    exports: [CitizenService]
})

export class CitizanModule { }