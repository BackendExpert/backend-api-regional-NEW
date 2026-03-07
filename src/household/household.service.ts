import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { HouseHold, HouseHoldDocument } from "./schema/house-hold.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { UpdateHouseHoldDTO } from "./dtos/update-household.dto";

@Injectable()
export class HouseHoldService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(HouseHold.name)
        private householeModel: Model<HouseHoldDocument>,

        @InjectModel(AuditLog.name)
        private auditlogModel: Model<AuditLogDocument>,

        private readonly jwtService: JwtService
    ) { }

    async CreateHouseHold(
        token: string,
        dto: CreateHouseHoldDTO,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        console.log(payload.user)

        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const householdcheck = await this.householeModel.findOne({ house_number: dto.house_number })

        if (householdcheck) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: "REGISTERING_EXISTING_HOUSE",
                description: `House ${dto.house_number} already exists and user: ${user.email} going to re-register this house`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            throw new ConflictException("This House is Already Registed In Systerm")
        }

        const house = await this.householeModel.create({
            house_number: dto.house_number,
            address: dto.address,
            village: dto.village,
            head_of_household: dto.head_of_household,
            member_count: dto.member_count,
            income_level: dto.income_level,
            land_ownership: dto.land_ownership,
            water_source: dto.water_source,
            electricity_available: dto.electricity_available,
            sanitation_type: dto.sanitation_type,
            housing_type: dto.housing_type,
            gps_location: dto.gps_location
        });


        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "HOUSE_REGISTERED",
            description: `House ${dto.house_number} registered by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return { success: true, message: "House registered successfully" };
    }


    async getAllHouses(token: string) {
        const payload = this.jwtService.verify(token)

        const checkuser = await this.userModel.findOne({ email: payload.user })

        if (!checkuser) {
            throw new NotFoundException("The User Not Found")
        }

        const gethouses = await this.householeModel.find()

        return { success: true, result: gethouses, message: "All Houses Fetched Success" }
    }

    async getHouseById(token: string, house_number: string) {
        const payload = this.jwtService.verify(token)

        const checkuser = await this.userModel.findOne({ email: payload.user })

        if (!checkuser) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchhouse = await this.householeModel.findOne({ house_number: house_number })

        if (!fetchhouse) {
            throw new NotFoundException("The House cannot Found...")
        }

        return { success: true, result: fetchhouse, message: "The House Data Fetched Success" }

    }

    async UpdateHouseHold(
        token: string,
        house_number: string,
        dto: UpdateHouseHoldDTO,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = this.jwtService.verify(token)

        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const house = await this.householeModel.findOne({ house_number });
        if (!house) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: 'UPDATING_UNKNOWN_HOUSE',
                description: `House ${house_number} does not exist, and user ${user.email} attempted to update`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent },
            });

            throw new ConflictException('This house does not exist in the system');
        }

        Object.assign(house, dto);
        await house.save();

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: 'HOUSEHOLD_UPDATED',
            description: `House ${house_number} updated successfully by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent, updateData: dto },
        });

        return { success: true, message: "House Updated Successful" }

    }

    async DeleteHouse(
        token: string,
        house_number: string,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = this.jwtService.verify(token)

        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const house = await this.householeModel.findOne({ house_number });
        if (!house) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: 'DELETE_UNKNOWN_HOUSE',
                description: `House ${house_number} does not exist, and user ${user.email} attempted to delete`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent },
            });

            throw new ConflictException('This house does not exist in the system');
        }


        await house.deleteOne();

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: 'HOUSEHOLD_DELETED',
            description: `House ${house_number} deleted successfully by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent, house_number },
        });

        return { successs: true, message: "House Deleted Success"}

    }
}