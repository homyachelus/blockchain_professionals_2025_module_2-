import {Contract, Context} from "fabric-contract-api";
import {certificate, driver, User} from "./types";

export class SafeRoadTraffic extends Contract{
    public async init(ctx: Context) {
        const bank = {
            login: "Bank",
            password: "bank",
            role: "bank",
            fio: "bank",
            driverType: {
                yearOfCommencementOfInternship: 0,
                fine: {numberOfUnpaidFines: 0},
                currentBalance: 1000
            },
        } as User;
        await ctx.stub.putState("Bank-", Buffer.from(JSON.stringify(bank)));

        const User_DPS_III = {
            login: "III",
            password: "III",
            role: "dps",
            fio: "Иванов Иван Иванович",
            driverType: {
                yearOfCommencementOfInternship: 2,
                fine: {numberOfUnpaidFines: 0},
                currentBalance: 50
            }
        } as User;
        await ctx.stub.putState("User_LOGIN-"+User_DPS_III.login, Buffer.from(JSON.stringify(User_DPS_III.login)));
        await ctx.stub.putState("User-"+User_DPS_III.login, Buffer.from(JSON.stringify(User_DPS_III)));

        const User_Driver_SSS = {
            login: "SSS",
            password: "SSS",
            role: "driver",
            fio: "Семенов Семен Семенович",
            driverType: {
                yearOfCommencementOfInternship: 5,
                fine: {numberOfUnpaidFines: 0},
                currentBalance: 50
            }
        } as User;
        await ctx.stub.putState("User_LOGIN-"+User_Driver_SSS.login, Buffer.from(JSON.stringify(User_Driver_SSS.login)));
        await ctx.stub.putState("User-"+User_Driver_SSS.login, Buffer.from(JSON.stringify(User_Driver_SSS)));

        const User_Driver_PPP = {
            login: "PPP",
            password: "PPP",
            role: "driver",
            fio: "Петров Петр Петрович",
            driverType: {
                yearOfCommencementOfInternship: 10,
                fine: {numberOfUnpaidFines: 0},
                currentBalance: 50
            }
        } as User;
        await ctx.stub.putState("User_LOGIN-"+User_Driver_PPP.login, Buffer.from(JSON.stringify(User_Driver_PPP.login)));
        await ctx.stub.putState("User-"+User_Driver_PPP.login, Buffer.from(JSON.stringify(User_Driver_PPP)));

        const certificate000 = {
            num: "000",
            certificatePeriod: "2021-01-11",
            category: ["A"]
        }
        await ctx.stub.putState("certificate000-", Buffer.from(JSON.stringify(certificate000)));
        const certificate111 = {
            num: "111",
            certificatePeriod: "2025-05-12",
            category: ["B"]
        }
        await ctx.stub.putState("certificate111-", Buffer.from(JSON.stringify(certificate111)));
        const certificate222 = {
            num: "222",
            certificatePeriod: "2020-09-09",
            category: ["C"]
        }
        await ctx.stub.putState("certificate222-", Buffer.from(JSON.stringify(certificate222)));
        const certificate333 = {
            num: "333",
            certificatePeriod: "2027-02-13",
            category: ["A"]
        }
        await ctx.stub.putState("certificate333-", Buffer.from(JSON.stringify(certificate333)));
        const certificate444 = {
            num: "444",
            certificatePeriod: "2020-09-10",
            category: ["B"]
        }
        await ctx.stub.putState("certificate444-", Buffer.from(JSON.stringify(certificate444)));
        const certificate555 = {
            num: "555",
            certificatePeriod: "2029-06-24",
            category: ["C"]
        }
        await ctx.stub.putState("certificate555-", Buffer.from(JSON.stringify(certificate555)));
        const certificate666 = {
            num: "666",
            certificatePeriod: "2030-03-31",
            category: ["A"]
        }
        await ctx.stub.putState("certificate666-", Buffer.from(JSON.stringify(certificate666)));
    }

    //регистрация пользователя
    public async userRegistration(ctx: Context, login:string, password:string, role: "driver" | "dps", fio: string, driverType: string) {
        //const findLogin = await ctx.stub.getState("User-"+login);

        const driverType2: driver = JSON.parse(driverType)

        // if (findLogin && findLogin.length > 0) {
        //     throw new Error("Такой логин существует")
        // } else {
            const newUser: User = {
                login, password, role, fio: fio, driverType: driverType2
            }
            await ctx.stub.putState("User-"+login, Buffer.from(JSON.stringify(newUser)));
            await ctx.stub.putState("User_LOGIN-"+login, Buffer.from(JSON.stringify(newUser.login)));

            return JSON.stringify(newUser);
        //}
    }


    //функции водителя

    //добавление лицензии
    public async addCertificate(ctx: Context, login: string, num: string, certificatePeriod: Date, category: "A" | "B" | "C") {
        const request = {
            id: num,
            login: login,
            certificate: {
                num: num,
                certificatePeriod: certificatePeriod,
                category: category
            }
        }

        await ctx.stub.putState("request_Add_Certif-"+request.id, Buffer.from(JSON.stringify(request)))

        return JSON.stringify(request);
    }

    //добавление категории
    public async addCategory(ctx: Context, login: string, category: string) {
        const user: User = JSON.parse((await ctx.stub.getState("User-"+login)).toString());

        if (!Array.isArray(user.driverType.certificate.category)) {
            const oldCategoryValue = user.driverType.certificate.category as unknown as string;
            user.driverType.certificate.category = [oldCategoryValue];
        }

        if (!user.driverType.certificate.category.includes(category)) {
            user.driverType.certificate.category.push(category);
        }

        await ctx.stub.putState("User-"+login, Buffer.from(JSON.stringify(user)))
        return JSON.stringify(user);
    }

    //регистрция транспорта
    public async vehicleRegistration(ctx: Context, category: "A" | "B" | "C", marketValue: number, serviceLife: number, login: string) {
        const request = {
            login: login,
            vehicle: {
                category: category,
                marketValue: marketValue,
                serviceLife: serviceLife,
            }
        }

        await ctx.stub.putState("request_Reg_Vechile-"+login, Buffer.from(JSON.stringify(request)))

        return JSON.stringify(request);
    }

    //продление срока водит удостовер
    public async extensionOfRights(ctx: Context, selectedPeriod: number, login: string) {
        const request = {
            login: login,
            certificatePeriod: selectedPeriod,
        }

        await ctx.stub.putState("request_Exten-"+login, Buffer.from(JSON.stringify(request)))

        return JSON.stringify(request);
    }

    //оплата штрафа
    public async payFine(ctx: Context, login: string) {
        const user: User = JSON.parse((await ctx.stub.getState("User-"+login)).toString());
        const bank: User = JSON.parse((await ctx.stub.getState("Bank-")).toString());

        // const startCounting = user.driverType.fine.startCounting as unknown as number;
        // const payDay = ctx.stub.getDateTimestamp().getSeconds();

        if (!user.driverType.fine.numberOfUnpaidFines || user.driverType.fine.numberOfUnpaidFines == 0) {
            throw new Error("У вас нет штрафов")
        }

        const startCounting = new Date(user.driverType.fine.startCounting as any).getTime() / 1000;
        const payDay = ctx.stub.getDateTimestamp().getTime() / 1000;

        const difference = payDay - startCounting;

        let price = 10;
        if (difference <= 300) {
            price = 5;
        }

        if (user.driverType.currentBalance < price) {
            throw new Error("Недостаточно средств")
        }

        bank.driverType.currentBalance += price;
        user.driverType.currentBalance -= price;
        user.driverType.fine.numberOfUnpaidFines = 0;

        await ctx.stub.putState("User-"+login, Buffer.from(JSON.stringify(user)));
        await ctx.stub.putState("Bank-", Buffer.from(JSON.stringify(bank)));



        return JSON.stringify(user);
    }

    public async changeCategory (ctx: Context, login: string, category: "A" | "B" | "C") {
        const user: User = JSON.parse((await ctx.stub.getState("User-"+login)).toString());

        user.driverType.certificate.category = category as any;

        await ctx.stub.putState("User-"+login, Buffer.from(JSON.stringify(user)));

        return JSON.stringify(user);
    }


    //функции для дпс

    //выписка штрафа
    public async issuanceFine(ctx: Context, num: string) {
        const users: User[] = JSON.parse(await this.getAllUsers(ctx));
        let user: User;
        for (const newUser of users) {
            if (newUser.driverType?.certificate && newUser.driverType.certificate.num === num) {
                user = newUser;
                break;
            }
        }
        if (!user) throw new Error("Такого пользователя не существует")

        const startCounting: number = ctx.stub.getDateTimestamp().getSeconds();

        user.driverType.fine = {
            startCounting: startCounting as any,
            numberOfUnpaidFines: user.driverType.fine.numberOfUnpaidFines + 1,
        }
        await ctx.stub.putState("User-"+user.login, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    //автопроверка запроса на водительского удостоверения
    public async autoCertificateVerification(ctx: Context, num: string, userLogin: string) {
        const user: User = JSON.parse((await ctx.stub.getState("User-"+userLogin)).toString());

        const request_ = JSON.parse((await ctx.stub.getState("request_Add_Certif-"+num)).toString());
        const category = request_.certificate.category;

        const certificate: certificate = JSON.parse((await ctx.stub.getState("certificate"+num+"-")).toString());

        const requestDate = new Date(request_.certificate.certificatePeriod).toISOString().split('T')[0];
        const certificateDate = new Date(certificate.certificatePeriod).toISOString().split('T')[0];

        const allUsers = await this.queryAll<User>(ctx, "User-")
        for (const newUser of allUsers) {
            if (newUser.driverType.certificate && newUser.driverType.certificate.num == num) {
                if (newUser.login != user.login) {
                    throw new Error ("Это удостоверение уже занято")
                }
            }
        }

        if (requestDate == certificateDate && request_.certificate.category == certificate.category) {
            user.driverType.certificate = {
                num: num,
                certificatePeriod: new Date(certificateDate),
                category: category,
            }
            await ctx.stub.putState("User-"+user.login, Buffer.from(JSON.stringify(user)));
        }

        await ctx.stub.deleteState("request_Add_Certif-" + num);

        return JSON.stringify(user);
    }

    //автопроверка запроса на регистрацию транспорта
    public async autoRegVehicle(ctx: Context, userLogin: string) {
        const user: User = JSON.parse((await ctx.stub.getState("User-"+userLogin)).toString());

        const request = JSON.parse((await ctx.stub.getState("request_Reg_Vechile-"+userLogin)).toString());
        const category = request.vehicle.category;
        const marketValue = request.vehicle.marketValue;
        const serviceLife = request.vehicle.serviceLife;

        if (!user.vehicleType) {
            user.vehicleType = {
                category,
                marketValue,
                serviceLife
            }

            await ctx.stub.putState("User-"+user.login, Buffer.from(JSON.stringify(user)));
        } else {
            throw new Error(`Такое транспортное средство уже существует`)
        }

        await ctx.stub.deleteState("request_Reg_Vechile-"+userLogin);

        return JSON.stringify(user);
    }

    //автопроверка запроса на продление водитеского удостоверения
    public async autoExtensionOfRights(ctx: Context, userLogin: string) {
        const request = JSON.parse((await ctx.stub.getState("request_Exten-"+userLogin)).toString());

        const selectedPeriod = Number(request.certificatePeriod);

        const user: User = JSON.parse((await ctx.stub.getState("User-"+userLogin)).toString());
        const category = user.driverType.certificate.category;
        const num = user.driverType.certificate.num;

        const numberOfUnpaidFines = user.driverType.fine.numberOfUnpaidFines;

        const certificatePeriodFinish = new Date(user.driverType.certificate.certificatePeriod);
        const certificatePeriodNow = new Date(Number((ctx.stub.getDateTimestamp()).getSeconds()) * 1000);

        const certificatePeriodStart = new Date(certificatePeriodFinish);
        certificatePeriodStart.setMonth(certificatePeriodStart.getMonth() - 1);

        if (numberOfUnpaidFines == 0 &&
            (certificatePeriodStart <= certificatePeriodNow &&
                certificatePeriodNow <= certificatePeriodFinish)) {
            const futureDate = new Date(certificatePeriodFinish);
            futureDate.setFullYear(futureDate.getFullYear() + selectedPeriod);
            user.driverType.certificate = {
                num: num,
                certificatePeriod: futureDate.toISOString().split('T')[0] as any,
                category: category

            }
            await ctx.stub.putState("User-"+user.login, Buffer.from(JSON.stringify(user)));
        }
        else {
            if (numberOfUnpaidFines != 0) throw new Error("Выплатите штраф!")
            else if (certificatePeriodStart <= certificatePeriodNow &&
                certificatePeriodNow <= certificatePeriodFinish) throw new Error("Продлить срок можно только за месяц до его окончания")
        }

        await ctx.stub.deleteState("request_Exten-"+userLogin);

        return JSON.stringify(user);
    }

    //функции для фронтенда
    public async queryAll<T = string>(ctx:Context, prefix:string): Promise<T[]> {
        const allResults = [];
        for await(const{key,value} of ctx.stub.getStateByRange('','')){
            const strValue = Buffer.from(value).toString('utf-8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (error) {
                console.log(error);
                record = strValue;
            }
            if (key.startsWith(prefix)){
                allResults.push(record as T);
            }
        }
        console.info(allResults);
        return allResults;
    }

    public async getAllUsers(ctx: Context): Promise<string> {
        const users = await this.queryAll<User>(ctx, "User-");
        return JSON.stringify(users);
    }

    public async getAllCertificateRequests(ctx: Context): Promise<string> {
        const requests = await this.queryAll<any>(ctx, "request_Add_Certif-");
        return JSON.stringify(requests);
    }

    public async getAllRequestVehicle(ctx: Context): Promise<string> {
        const requests = await this.queryAll<any>(ctx, "request_Reg_Vechile-");
        return JSON.stringify(requests);
    }

    public async getAllRequestCertificatePeriod(ctx: Context): Promise<string> {
        const requests = await this.queryAll<any>(ctx, "request_Exten-");
        return JSON.stringify(requests);
    }

    public async getCertificates(ctx:Context, num: string) {
        const bytes = await ctx.stub.getState("certificate" + num + "-");
        if (!bytes || bytes.length === 0) {
            throw new Error(`Сертификат №${num} не найден`);
        }
        return bytes.toString();
    }

    public async getBank(ctx: Context) {
        const bytes = await ctx.stub.getState("Bank-");
        if (!bytes || bytes.length === 0) {
            throw new Error("Данные банка не инициализированы");
        }
        return bytes.toString();
    }

    public async getUser(ctx: Context, login: string) {
        const userBytes = await ctx.stub.getState("User-" + login);
        if (!userBytes || userBytes.length === 0) {
            throw new Error(`Пользователь ${login} не найден`);
        }
        return userBytes.toString();
    }

    //запрос на сертификат
    public async getRequestCertificate(ctx: Context, num: string) {
        const bytes = await ctx.stub.getState("request_Add_Certif-" + num);
        if (!bytes || bytes.length === 0) {
            throw new Error(`Запрос на сертификат №${num} не найден`);
        }
        return bytes.toString();
    }

    //запрос на трнаспорт
    public async getRequestVehicle(ctx: Context, login: string) {
        const bytes = await ctx.stub.getState("request_Reg_Vechile-" + login);
        if (!bytes || bytes.length === 0) {
            throw new Error(`Запрос на транспорт для пользователя ${login} не найден`);
        }
        return bytes.toString();
    }

    //запрос на срок
    public async getRequestCertificatePeriod(ctx: Context, login: string) {
        const bytes = await ctx.stub.getState("request_Exten-" + login);
        if (!bytes || bytes.length === 0) {
            throw new Error(`Запрос на продление прав для пользователя ${login} не найден`);
        }
        return bytes.toString();
    }
}
