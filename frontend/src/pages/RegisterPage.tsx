import "../css/App.css";
import {useEffect, useState} from "react";
import {useMyContext} from "../redux/context.tsx";
import {useNavigate} from "react-router";
import {getAllUsers, getBank, getUser} from "../api/api.ts";
import type {User} from "../types/types.tsx";

const registerPage = () => {

    const [login, setLogin] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [role, setRole] = useState<"driver" | "dps" | "bank">('driver');
    const [fio, setFio] = useState<string>('');

    const [tab, setTab] = useState<"register" | "login">("register")

    const {stage, setStage, userRegistration_, setLoading, setUser} = useMyContext()

    const navigate = useNavigate();

    const [allUsers, setAllUsers] = useState<User[]>([]);

    const fun = async() => {
        await userRegistration_(login, pass, role, fio);
        await navigate("/mainpage");
    }

    const handleLogin = async (selectedUser: User) => {
        setLoading(true);
        try {
            const userDetails = await getUser(selectedUser.login);
            setUser(userDetails);
            navigate("/mainpage");
        } catch (e) {
            alert("Ошибка входа");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUsers().then(data => setAllUsers(data))
    }, []);

    return (
        <div>
            <div style={{width: "100%"}}>
                <button className="counter" style={{
                    fontWeight: tab === 'register' ? 'bold' : 'normal',
                    color: tab === 'register' ? 'var(--accent)' : '#666'
                }} onClick={() => {setTab("register")}}>Регистриция</button>
                <button className="counter" style={{
                    fontWeight: tab === 'login' ? 'bold' : 'normal',
                    color: tab === 'login' ? 'var(--accent)' : '#666'
                }} onClick={() => {setTab("login")}}>Вход</button>
            </div>

            {tab == "register" ? (
                <div>
                    <h1>Регистрация</h1>

                    <select className="select" value={role} onChange={(e) => setRole(e.target.value as "driver" | "dps" | "bank")}>
                        <option value="driver">Водитель</option>
                        <option value="dps">Сотрудник ДПС</option>
                    </select><br/>

                    <div>
                        <input value={login} onChange={(e) => setLogin(e.target.value)} className="input" placeholder="логин"></input> <br/>
                        <input value={pass} onChange={(e) => setPass(e.target.value)} className="input" placeholder="пароль"></input> <br/>
                        <input value={fio} onChange={(e) => setFio(e.target.value)} className="input" placeholder="ваше фио"></input> <br/>
                        <input value={stage} onChange={(e) => setStage(Number(e.target.value))} className="input" ></input> <br/>
                    </div>

                    <br/><br/>
                    <button className="counter" onClick={() => fun()}>зарегистрироваться</button>
                </div>
            ) : (
                <div>
                    <h1>Вход</h1>

                    <select className="select" value={role} onChange={(e) => setRole(e.target.value as "driver" | "dps" | "bank")}>
                        <option value="driver">Водитель</option>
                        <option value="dps">Сотрудник ДПС</option>
                        <option value="bank">Банк</option>
                    </select><br/>

                    <div>
                        {role === "bank" ? (
                            <button className="counter" onClick={async () => setUser(await getBank())}>войти как Банк</button>
                        ) : (
                            allUsers.filter(u => u.role === role).map((u) => (
                                <div key={u.login} className="counter" onClick={() => handleLogin(u)}>
                                    <p>Войти как<span><br/><strong>{u.fio}</strong><br/></span>Логин: {u.login}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
export default registerPage;