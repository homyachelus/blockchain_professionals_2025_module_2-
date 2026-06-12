import type {driver} from "../types/types.tsx";

export const userRegistration = async (login: string, password:string, role: "driver" | "dps", fio: string, driverType: driver) => {
    const raw = await fetch("http://localhost:3002/userRegistration", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({login, password, role, fio, driverType})
    });
    return await raw.json()
}

export const getAllUsers = async () => {
    const raw = await fetch("http://localhost:3002/getAllUsers", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({})
    });
    return await raw.json()
}

export const getUser = async(login: string) => {
    const raw = await fetch("http://localhost:3002/getUser", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({login})
    })
    return await raw.json()
}

export const payFine = async(login:string) => {
    const raw = await fetch("http://localhost:3002/payFine", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({login})
    })
    return await raw.json()
}

export const addCertificate = async (num: string, certificatePeriod: Date, category: "A" | "B" | "C") => {
    const raw = await fetch("http://localhost:3002/addCertificate", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({num, certificatePeriod, category})
    });
    return await raw.json()
}

export const getRequestCertificate = async(num: string) => {
    const raw = await fetch("http://localhost:3002/getRequestCertificate", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({num})
    })
    return await raw.json()
}

export const vehicleRegistration = async(category: "A" | "B" | "C", marketValue: number, serviceLife: number, login: string) => {
    const raw = await fetch("http://localhost:3002/vehicleRegistration", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({category, marketValue, serviceLife, login})
    })
    return await raw.json()
}

export const extensionOfRights = async(selectedPeriod: number, login: string) => {
    const raw = await fetch("http://localhost:3002/extensionOfRights", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({selectedPeriod, login})
    })
    return await raw.json()
}

export const getRequestVehicle = async(login: string) => {
    const raw = await fetch("http://localhost:3002/getRequestVehicle", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({login})
    })
    return await raw.json()
}

export const getRequestCertificatePeriod = async(login: string) => {
    const raw = await fetch("http://localhost:3002/getRequestCertificatePeriod", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({login})
    })
    return await raw.json()
}





export const issuanceFine = async() => {
    const raw = await fetch("http://localhost:3002/issuanceFine", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}

export const autoCertificateVerification = async() => {
    const raw = await fetch("http://localhost:3002/autoCertificateVerification", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}

export const autoRegVehicle = async() => {
    const raw = await fetch("http://localhost:3002/autoRegVehicle", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}

export const autoExtensionOfRights = async() => {
    const raw = await fetch("http://localhost:3002/autoExtensionOfRights", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}

export const getCertificates = async() => {
    const raw = await fetch("http://localhost:3002/getCertificates", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}

export const getBank = async() => {
    const raw = await fetch("http://localhost:3002/getBank", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({})
    })
    return await raw.json()
}