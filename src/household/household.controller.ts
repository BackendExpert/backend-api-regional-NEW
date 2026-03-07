import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    UnauthorizedException,
    UseGuards,
    Param,
    Patch,
    Delete,
} from "@nestjs/common";
import { HouseHoldService } from "./household.service";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { UpdateHouseHoldDTO } from "./dtos/update-household.dto";

@Controller("house")
export class HouseHoldController {
    constructor(private readonly househodService: HouseHoldService) { }

    @Post("create-house")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions("house:create")

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

    @Get('all-houses')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions("house:fetch-all")

    async fetchAllHouse(
        @Headers("authorization") authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.househodService.getAllHouses(token)
    }

    @Get('get-house/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions("house:fetch-by-hnumber")

    async fetchHouse(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string,

    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.househodService.getHouseById(token, id)
    }

    @Patch('update-house/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions("house:update")

    async UpdateHouse(
        @Body() dto: UpdateHouseHoldDTO,
        @Param('id') id: string,
        @Headers('authorization') authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.househodService.UpdateHouseHold(
            token,
            id,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }

    @Delete('house-delete/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('house:delete')

    async DeleteHouse(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.househodService.DeleteHouse(
            token,
            id,
            client.ipAddress,
            client.userAgent
        )

    }
}