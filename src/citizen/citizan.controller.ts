import { Body, Controller, Headers, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CitizenService } from "./citizen.service";
import { CreateCitizenDTO } from "./dto/citizan.dto";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";


@Controller('citizan')
export class CitizanController {
    constructor(private readonly citizanService: CitizenService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions("house:create")

    createCitizan(
        @Body() dto: CreateCitizenDTO,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.citizanService.CreateCitizan(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }
}