import "../css/App.css";
import {useState} from "react";
import type {driver, Fine} from "../types.tsx";
import {getUser, userRegistration} from "../api/api.ts";
import * as React from "react";

const registerPage: React.FC<{setLoading: React.Dispatch<React.SetStateAction<boolean>>}> = ({setLoading}) => {

    const [login, setLogin] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [role, setRole] = useState<"driver" | "dps">('driver');
    const [fio, setFio] = useState<string>('');

    const [stage, setStage] = useState<number>(0);

    const [driver, setDriver] = useState<driver>();

    const userRegistration_ = async (login: string, password: string, role: "driver" | "dps", fio: string) => {
        setLoading(true)
        try {
            const fine_: Fine = {
                numberOfUnpaidFines: 0
            }

            const driver_: driver = {
                yearOfCommencementOfInternship: stage,
                fine: fine_,
                currentBalance: 50,
            }

            setDriver(driver_);

            await userRegistration(login, password, role, fio, driver_);

            const newUser = await getUser(login);
            console.log(newUser);
        }
        catch (e) {
            console.log(e);
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Регистрация</h2>

            <input value={login} onChange={(e) => setLogin(e.target.value)} className="input" placeholder="логин"></input> <br/>
            <input value={pass} onChange={(e) => setPass(e.target.value)} className="input" placeholder="пароль"></input> <br/>
            <input value={fio} onChange={(e) => setFio(e.target.value)} className="input" placeholder="ваше фио"></input> <br/>
            <input value={stage} onChange={(e) => setStage(Number(e.target.value))} className="input" placeholder="стаж"></input> <br/>

            <select className="select" value={role} onChange={(e) => setRole(e.target.value as "driver" | "dps")}>
                <option value="driver">Водитель</option>
                <option value="dps">Сотрудник ДПС</option>
            </select> <br/>

            <button className="counter" onClick={() => userRegistration_(login, pass, role, fio)}>зарегистрироваться</button>
        </div>
    )
}
export default registerPage;