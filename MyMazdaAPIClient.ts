import MyMazdaAPIController from "./MyMazdaAPIController";

interface Vehicle {
    vin: string,
    id: number,
    nickname: string,
    carlineCode: string,
    carlineName: string,
    modelYear: string,
    modelCode: string,
    modelName: string,
    automaticTransmission: boolean,
    interiorColorCode: string,
    interiorColorName: string,
    exteriorColorCode: string,
    exteriorColorName: string,
}

interface OtherVehicleInformation {
    OtherInformation: {
        modelYear: string,
        modelCode: string,
        modelName: string,
        transmissionName: string,
        transmissionType: string,
        trimName: string,
        engineInformation: string,
        interiorColorCode: string,
        interiorColorName: string,
        exteriorColorCode: string,
        exteriorColorName: string,
        carlineCode: string,
        carlineName: string,
    },
    CVServiceInformation: {
        automobileIdentificationCode: string,
        transmissionType: string,
        carName: string,
        carModelType: string,
        carBodyColor: string,
        driveType: string,
        fuelType: string,
        fuelName: string,
        engineStartSec: string,
        engineStartLimitSec: string
    }
}

interface VehicleStatus {
    lastUpdatedTimestamp: string
    latitude: number,
    longitude: number,
    positionTimestamp: string,
    fuelRemainingPercent: number,
    fuelDistanceRemainingKm: number,
    odometerKm: number,
    doors: {
        driverDoorOpen: boolean,
        passengerDoorOpen: boolean,
        rearLeftDoorOpen: boolean,
        rearRightDoorOpen: boolean,
        trunkOpen: boolean,
        hoodOpen: boolean,
        fuelLidOpen: boolean
    },
    doorLocks: {
        driverDoorUnlocked: boolean,
        passengerDoorUnlocked: boolean,
        rearLeftDoorUnlocked: boolean,
        rearRightDoorUnlocked: boolean,
    },
    windows: {
        driverWindowOpen: boolean,
        passengerWindowOpen: boolean,
        rearLeftWindowOpen: boolean,
        rearRightWindowOpen: boolean
    },
    hazardLightsOn: boolean,
    tirePressure: {
        frontLeftTirePressurePsi: number,
        frontRightTirePressurePsi: number,
        rearLeftTirePressurePsi: number,
        rearRightTirePressurePsi: number
    }
}

export default class MyMazdaAPIClient {
    private controller: MyMazdaAPIController

    constructor(email: string, password: string) {
        this.controller = new MyMazdaAPIController(email, password);
    }

    async getVehicles(): Promise<Vehicle[]> {
        let vecBaseInfos = await this.controller.getVecBaseInfos();

        let vehicles: Vehicle[] = [];
        for (let vecBaseInfo of vecBaseInfos.vecBaseInfos) {
            let otherVehInfo: OtherVehicleInformation = JSON.parse(vecBaseInfo.Vehicle.vehicleInformation);

            let nickname = await this.controller.getNickName(vecBaseInfo.vin);

            let vehicle: Vehicle = {
                vin: vecBaseInfo.vin,
                id: vecBaseInfo.Vehicle.CvInformation.internalVin,
                nickname: nickname,
                carlineCode: otherVehInfo.OtherInformation.carlineCode,
                carlineName: otherVehInfo.OtherInformation.carlineName,
                modelYear: otherVehInfo.OtherInformation.modelYear,
                modelCode: otherVehInfo.OtherInformation.modelCode,
                modelName: otherVehInfo.OtherInformation.modelName,
                automaticTransmission: otherVehInfo.OtherInformation.transmissionType === "A",
                interiorColorCode: otherVehInfo.OtherInformation.interiorColorCode,
                interiorColorName: otherVehInfo.OtherInformation.interiorColorName,
                exteriorColorCode: otherVehInfo.OtherInformation.exteriorColorCode,
                exteriorColorName: otherVehInfo.OtherInformation.exteriorColorName,
            };

            vehicles.push(vehicle);
        }

        return vehicles;
    }

    async getVehicleStatus(vehicleId: number): Promise<VehicleStatus> {
        let vehicleStatusResponse = await this.controller.getVehicleStatus(vehicleId);

        let alertInfo = vehicleStatusResponse.alertInfos[0];
        let remoteInfo = vehicleStatusResponse.remoteInfos[0];

        let vehicleStatus: VehicleStatus = {
            lastUpdatedTimestamp: remoteInfo.OccurrenceDate,
            latitude: remoteInfo.PositionInfo.Latitude * (remoteInfo.PositionInfo.LatitudeFlag === 1 ? -1 : 1),
            longitude: remoteInfo.PositionInfo.Longitude * (remoteInfo.PositionInfo.LongitudeFlag === 0 ? -1 : 1),
            positionTimestamp: remoteInfo.PositionInfo.AcquisitionDatetime,
            fuelRemainingPercent: remoteInfo.ResidualFuel.FuelSegementDActl,
            fuelDistanceRemainingKm: remoteInfo.ResidualFuel.RemDrvDistDActlKm,
            odometerKm: remoteInfo.DriveInformation.OdoDispValue,
            doors: {
                driverDoorOpen: alertInfo.Door.DrStatDrv === 1,
                passengerDoorOpen: alertInfo.Door.DrStatPsngr === 1,
                rearLeftDoorOpen: alertInfo.Door.DrStatRl === 1,
                rearRightDoorOpen: alertInfo.Door.DrStatRr === 1,
                trunkOpen: alertInfo.Door.DrStatTrnkLg === 1,
                hoodOpen: alertInfo.Door.DrStatHood === 1,
                fuelLidOpen: alertInfo.Door.FuelLidOpenStatus === 1
            },
            doorLocks: {
                driverDoorUnlocked: alertInfo.Door.LockLinkSwDrv === 1,
                passengerDoorUnlocked: alertInfo.Door.LockLinkSwPsngr === 1,
                rearLeftDoorUnlocked: alertInfo.Door.LockLinkSwRl === 1,
                rearRightDoorUnlocked: alertInfo.Door.LockLinkSwRr === 1,
            },
            windows: {
                driverWindowOpen: alertInfo.Pw.PwPosDrv === 1,
                passengerWindowOpen: alertInfo.Pw.PwPosPsngr === 1,
                rearLeftWindowOpen: alertInfo.Pw.PwPosRl === 1,
                rearRightWindowOpen: alertInfo.Pw.PwPosRr === 1
            },
            hazardLightsOn: alertInfo.HazardLamp.HazardSw === 1,
            tirePressure: {
                frontLeftTirePressurePsi: remoteInfo.TPMSInformation.FLTPrsDispPsi,
                frontRightTirePressurePsi: remoteInfo.TPMSInformation.FRTPrsDispPsi,
                rearLeftTirePressurePsi: remoteInfo.TPMSInformation.RLTPrsDispPsi,
                rearRightTirePressurePsi: remoteInfo.TPMSInformation.RRTPrsDispPsi
            }
        }

        return vehicleStatus;
    }

    async turnHazardLightsOn(vehicleId: number): Promise<void> {
        await this.controller.lightOn(vehicleId);
    }

    async turnHazardLightsOff(vehicleId: number): Promise<void> {
        await this.controller.lightOff(vehicleId);
    }

    async unlockDoors(vehicleId: number): Promise<void> {
        await this.controller.doorUnlock(vehicleId);
    }

    async lockDoors(vehicleId: number): Promise<void> {
        await this.controller.doorLock(vehicleId);
    }

    async startEngine(vehicleId: number): Promise<void> {
        await this.controller.engineStart(vehicleId);
    }

    async stopEngine(vehicleId: number): Promise<void> {
        await this.controller.engineStop(vehicleId);
    }
}