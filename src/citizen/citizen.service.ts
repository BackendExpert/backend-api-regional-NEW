import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Citizen, CitizenDocument } from "./schema/citizen.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateCitizenDTO } from "./dto/create-citizan.dto";
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { UpdateCitizanDTO } from "./dto/update-citizan.dto";

@Injectable()
export class CitizenService {
    constructor(
        @InjectModel(Citizen.name)
        private citizanModel: Model<CitizenDocument>,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(AuditLog.name)
        private auditlogModel: Model<AuditLogDocument>,

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

        const citizancheck = await this.citizanModel.findOne({ nic: dto.nic })

        if (citizancheck) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: "REGISTERING_EXISTING_CITIZAN",
                description: `Citizan with ${dto.nic} already exists and user: ${user.email} going to re-register`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            throw new ConflictException("This House is Already Registed In Systerm")
        }

        const citizen = await this.citizanModel.create({
            nic: dto.nic,
            first_name: dto.first_name,
            last_name: dto.last_name,
            full_name: dto.full_name,
            gender: dto.gender,
            date_of_birth: dto.date_of_birth,
            household_id: dto.household_id,
            phone: dto.phone,
            email: dto.email,
            marital_status: dto.marital_status,
            occupation: dto.occupation,
            education_level: dto.education_level,
            blood_group: dto.blood_group,
            nationality: dto.nationality,
            notes: dto.notes,
            status: dto.status
        });

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "CITIZAN_REGISTERED",
            description: `Citizan ${dto.nic} registered by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return { success: true, message: "Citizan registered Success" }
    }

    async GetAllCitizans(token: string) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchCitizans = await this.citizanModel.find()

        return { success: true, result: fetchCitizans, message: "All Citizans Fetach Success" }

    }

    async GetOneCitizan(token: string, nic: string) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchnicCitizan = await this.citizanModel.findOne({ nic })

        return { success: true, result: fetchnicCitizan, message: "Citizan Fetched Successful" }

    }

    async UpdateCitizan(
        token: string,
        nic: string,
        dto: UpdateCitizanDTO,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const citizan = await this.citizanModel.findOne({ nic });
        if (!citizan) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: 'UPDATING_UNKNOWN_CITIZAN',
                description: `Citizan ${nic} does not exist, and user ${user.email} attempted to update`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent },
            });

            throw new ConflictException('This Citizan does not exist in the system');
        }
        Object.assign(citizan, dto);
        await citizan.save();


        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: 'CITIZAN_UPDATED',
            description: `Citizan ${nic} updated successfully by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent, updateData: dto },
        });

        return { success: true, message: "Citizan Updated Success" }

    }


}