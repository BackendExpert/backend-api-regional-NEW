import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schema/user.schema";
import { HouseHold, HouseHoldSchema } from "./schema/house-hold.schema";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { HouseHoldController } from "./household.controller";
import { HouseHoldService } from "./household.service";
import { JwtService } from "@nestjs/jwt";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { RoleModule } from "src/role/role.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        RoleModule,
        AuthModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: HouseHold.name, schema: HouseHoldSchema },
            { name: AuditLog.name, schema: AuditLogSchema }
        ])
    ],
    controllers: [HouseHoldController],
    providers: [
        HouseHoldService,
        JwtAuthGuard,
        PermissionsGuard,
    ],
    exports: [HouseHoldService]
})

export class HouseHoldModule { }