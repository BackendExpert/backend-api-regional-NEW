import { Body, Controller, Get, Headers, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { EmploymentService } from "./employment.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { CreateEmploymentDTO } from "./dto/create-employment.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface"

@Controller('employment')
export class EmploymentController {
    constructor(private readonly employmentService: EmploymentService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('employment:create')

    createEmployment(
        @Body() dto: CreateEmploymentDTO,
        @Headers('authorization') authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.employmentService.CreateEmploymentRecode(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }

    @Get('all-recodes')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('employment:create')

    fetchAllRecodes(
        @Headers('authorization') authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.employmentService.GetallEmploymentRecodes(token)
    }
}