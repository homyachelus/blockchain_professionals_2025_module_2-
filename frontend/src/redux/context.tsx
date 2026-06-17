import * as React from "react";
import {type ReactNode, useContext, useEffect, useState} from "react";
import type {Fine, driver, User} from "../types/types.tsx";
import type {typeForProv} from "../types/typesForProv.tsx";
import {
    getUser,
    userRegistration,
    payFine,
    issuanceFine,
    addCertificate,
    vehicleRegistration,
    getRequestVehicle,
    extensionOfRights,
    getRequestCertificatePeriod,
    getAllUsers,
    getBank,
    autoCertificateVerification,
    getAllCertificateRequests, autoRegVehicle, getAllRequestVehicle, autoExtensionOfRights,
    getAllRequestCertificatePeriod, addCategory
} from "../api/api.ts";

export const MyContext = React.createContext<typeForProv | null>(null);

export const MyProvider = ({children}: {children?: ReactNode}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [driver, setDriver] = useState<driver>();
    const [stage, setStage] = useState();
    const [user, setUser] = useState<User | undefined>(
        () => {const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    return JSON.parse(savedUser);
                } catch (e) {
                    return undefined;
                }
            }
            return undefined;
    });
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [bank, setBank] = useState<User>();
    const [certRequests, setCertRequests] = useState<any[]>([]);

    const userRegistration_ = async (login: string, password: string, role: "driver" | "dps", fio: string) => {
        setLoading(true)
        try {
            const fine_: Fine = {
                numberOfUnpaidFines: 0,
                startCounting: new Date()
            }

            const driver_: driver = {
                yearOfCommencementOfInternship: stage,
                fine: fine_,
                currentBalance: 50,
            }

            setDriver(driver_);

            await userRegistration(login, password, role, fio, driver_);
            console.log(await getUser(login))
            const user_ = await getUser(login);
            localStorage.setItem('currentUser', JSON.stringify(user_));
            setUser(user_);
        }
        catch (e) {
            console.log(e);
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const payFine_ = async(login: string) => {
        setLoading(true)
        try {
            const newUs = await payFine(login);

            setUser(newUs)

            localStorage.setItem('currentUser', JSON.stringify(newUs));
            alert("ШТРАФЫ ОПЛАЧЕНЫ")
        }
        catch (e) {
            console.log(e);
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const addCertificate_ = async(login: string, num: string, certificatePeriod: Date, category: "A" | "B" | "C") => {
        setLoading(true)
        try {
            await addCertificate(login, num, certificatePeriod, category)
            console.log("num ", num, "certificatePeriod ", certificatePeriod, "category ", category)

            const reUs = await getUser(login);
            setUser(reUs);
            localStorage.setItem('currentUser', JSON.stringify(reUs));

            alert("ЗАЯВКА ОТПРАВЛЕНА")

            await autoCertificateVerification_(num, login)
        }
        catch (e) {
            console.log(e);
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const addVich = async(category: "A" | "B" | "C", marketValue: number, serviceLife: number, login: string) => {
        setLoading(true)
        try {
            await vehicleRegistration(category, marketValue, serviceLife, login);
            console.log(await getRequestVehicle(login))

            await autoRegVehic(login)

            const user_ = await getUser(login);
            localStorage.setItem('currentUser', JSON.stringify(user_));

            alert("ЗАЯВКА ОТПРАВЛЕНА")
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const addCertifPer = async(selectedPeriod: number, login: string) => {
        setLoading(true)
        try {
            await extensionOfRights(selectedPeriod, login)
            console.log(await getRequestCertificatePeriod(login))

            const user_ = await getUser(login);
            localStorage.setItem('currentUser', JSON.stringify(user_));

            alert("ЗАЯВКА ОТПРАВЛЕНА")
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const issueFine = async(num: string) => {
        setLoading(true)
        try{
            await issuanceFine(num);

            const data = await getAllUsers();
            setAllUsers(data);

            alert("ШТРАФ ВЫПИСАН")
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    const autoCertificateVerification_ = async (num: string, userLogin: string) => {
        setLoading(true)
        try {
            await autoCertificateVerification(num, userLogin);

            const updatedUsers = await getAllUsers();
            setAllUsers(updatedUsers);
            const updatedRequests = await getAllCertificateRequests();
            setCertRequests(updatedRequests);

            console.log(updatedUsers)

            console.log(user.driverType.certificate)

            alert("ЗАЯВКА ПРИНЯТА");
        } catch (e) {
            const cleanMessage = e.message.includes("peer=peer0.org2.example.com:9051, status=500, message=Это удостоверение уже занято\n" +
                "    peer=peer0.org1.example.com:7051, status=500, message=")
                ? e.message.split("peer=peer0.org2.example.com:9051, status=500, message=Это удостоверение уже занято\n" +
                    "    peer=peer0.org1.example.com:7051, status=500, message=")[1]
                : e.message;

            alert(cleanMessage);

            console.log(e)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const [vehReq, setVehReq] = useState<any[]>([]);

    const autoRegVehic = async(userLogin: string) => {
        setLoading(true)
        try {
            await autoRegVehicle(userLogin);

            const updatedUsers = await getAllUsers();
            setAllUsers(updatedUsers);
            const updatedRequests = await getAllRequestVehicle();
            setVehReq(updatedRequests);

            console.log(updatedUsers)

            console.log(user.vehicleType)

            alert("ЗАЯВКА ПРИНЯТА");
        } catch (e) {
            console.log(e)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const [extenReq, setExtenReq] = useState<any[]>([]);

    const autoExtensionOfRights_ = async(userLogin: string) => {
        setLoading(true)
        try {
            await autoExtensionOfRights(userLogin);

            const updatedUsers = await getAllUsers();
            setAllUsers(updatedUsers);
            const updatedRequests = await getAllRequestCertificatePeriod();
            setExtenReq(updatedRequests);

            console.log(updatedUsers)

            console.log(user)
            console.log(user.driverType)
            console.log(user.driverType.certificate)
            console.log(user.driverType.certificate.certificatePeriod)

            alert("ЗАЯВКА ПРИНЯТА");
        } catch (e) {
            console.log(e)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const addCategory_ = async(login: string, category: "A" | "B" | "C") => {
        setLoading(true)
        try {
            const updatedUser = await addCategory(login, category);

            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            console.log(updatedUser.driverType.certificate.category)

            const updatedUsers = await getAllUsers();
            setAllUsers(updatedUsers);

            alert("КАТЕГОРИЯ ДОБАВЛЕНА");
        } catch (e) {
            console.log(e)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fun = async () => {
            try {
                const allUs = await getAllUsers();
                setAllUsers(allUs);
                const bank_ = await getBank();
                setBank(bank_)
                const reqCert = await getAllCertificateRequests();
                setCertRequests(reqCert);
                const vehReq_ = await getAllRequestVehicle();
                setVehReq(vehReq_);
                const certPerReq_ = await getAllRequestCertificatePeriod();
                setExtenReq(certPerReq_);

                console.log(user.driverType.certificate)
            } catch (e) {
                console.log(e)
            }
        }
        fun()
    }, [user]);

    return (
        <MyContext.Provider value={{
            loading, setLoading,
            driver, setDriver,
            stage, setStage,
            userRegistration_, addCertificate_, payFine_, addVich, addCertifPer, autoCertificateVerification_, autoRegVehic, autoExtensionOfRights_,
            issueFine, addCategory_,
            user, setUser, allUsers, bank,
            certRequests, vehReq, extenReq
        }}>
            {children}
        </MyContext.Provider>
    )
}

export const useMyContext = () => {
    const context = useContext(MyContext);
    if (!context) throw new Error("хук должен использоватся внутри useMyContext");
    return context;
}