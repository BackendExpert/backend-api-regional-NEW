import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Citizen, CitizenDocument } from "./schema/citizen.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateCitizenDTO } from "./dto/citizan.dto";

@Injectable()
export class CitizenService {
    constructor(
        @InjectModel(Citizen.name)
        private citizanModel: Model<CitizenDocument>,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(AuditLog.name)
        private auditModel: Model<AuditLogDocument>,

        private readonly jwtService: JwtService
    ) { }

    async CreateCitizan(
        token: string,
        dto: CreateCitizenDTO,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        

    }
}