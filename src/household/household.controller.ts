import {
    Body,
    Controller,
    Headers,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { HouseHoldService } from "./household.service";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";

@Controller("house")
export class HouseHoldController {
    constructor(private readonly househodService: HouseHoldService) { }

    @Post("create-house")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions("carbon:today-intensity")
    async HouseHoldCreate(
        @Body() dto: CreateHouseHoldDTO,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.househodService.CreateHouseHold(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        );
    }
}