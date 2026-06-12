import * as React from "react";
import {type ReactNode, useContext, useState} from "react";
import type {Fine, driver, User} from "../types/types.tsx";
import type {typeForProv} from "../types/typesForProv.tsx";
import {
    getUser,
    userRegistration,
    payFine,
    addCertificate,
    vehicleRegistration,
    getRequestVehicle, extensionOfRights, getRequestCertificatePeriod
} from "../api/api.ts";

export const MyContext = React.createContext<typeForProv | null>(null);

export const MyProvider = ({children}: {children?: ReactNode}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [driver, setDriver] = useState<driver>();
    const [stage, setStage] = useState<number>(0);
    const [user, setUser] = useState<User>();

    const userRegistration_ = async (login: string, password: string, role: "driver" | "dps", fio: string) => {
        setLoading(true)
        try {
            const fine_: Fine = {
                numberOfUnpaidFines: 2,
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

    const addCertificate_ = async(num: string, certificatePeriod: Date, category: "A" | "B" | "C") => {
        setLoading(true)
        try {
            await addCertificate(num, certificatePeriod, category)
            console.log("num ", num, "certificatePeriod ", certificatePeriod, "category ", category)

            alert("ЗАЯВКА ОТПРАВЛЕНА")

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
            console.log(getRequestVehicle(login))

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
            console.log(getRequestCertificatePeriod(login))

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

    return (
        <MyContext.Provider value={{
            loading, setLoading,
            driver, setDriver,
            stage, setStage,
            userRegistration_, addCertificate_, payFine_, addVich, addCertifPer,
            user, setUser,
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