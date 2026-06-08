export type certificate = {             //водит удостоверение
    num: string;
    certificatePeriod: Date;
    category: "A" | "B" | "C";
}

export type vehicle = {
    category: "A" | "B" | "C";
    marketValue: number;
    serviceLife: number;
}

export type driver = {                  //водитель
    certificate?: certificate;
    yearOfCommencementOfInternship: number; //начало водит стажа
    fine: Fine;
    currentBalance: number;  //текущий баланс
}

export type User = { //пользователь
    login: string;
    password: string;
    role: "driver" | "dps" | "bank";
    fio: string;
    driverType: driver;
    vehicleType?: vehicle;
}

export type Fine = {
    startCounting?: Date;
    numberOfUnpaidFines: number;
}
