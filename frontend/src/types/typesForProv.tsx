import * as React from "react";
import type {driver, User} from "./types.tsx";

export type typeForProv = {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,

    driver: driver,
    setDriver: React.Dispatch<React.SetStateAction<driver>>,

    stage: number,
    setStage: React.Dispatch<React.SetStateAction<number>>,

    userRegistration_: (login: string, password: string, role: "driver" | "dps" | "bank", fio: string) => Promise<void>,

    user: User,
    setUser: (value: (((prevState: User) => User) | User)) => void,

    payFine_: (login: string) => Promise<void>,

    addCertificate_: (login:string, num: string, certificatePeriod: Date, category: "A" | "B" | "C") => Promise<void>,

    addVich: (category: "A" | "B" | "C", marketValue: number, serviceLife: number, login: string,) => Promise<void>,

    addCertifPer: (selectedPeriod: number, login: string) => Promise<void>,

    issueFine: (num: string,) => Promise<void>,

    allUsers: User[],

    bank: User,

    autoCertificateVerification_: (num: string, userLogin: string,) => Promise<void>,

    certRequests: any[],
    vehReq: any[],

    autoRegVehic: (userLogin: string) => Promise<void>,

    extenReq: any[],

    autoExtensionOfRights_: (userLogin: string) => Promise<void>,

    addCategory_: (login: string, category: "A" | "B" | "C") => Promise<void>
}