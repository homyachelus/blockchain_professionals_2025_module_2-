import "../css/App.css";
import {useNavigate} from "react-router";
import {useMyContext} from "../redux/context.tsx";

const MainPage = () => {

    const navigate = useNavigate();

    const {user} = useMyContext();

    return (
        <div>
            {user.role == "driver" ? (
                <div>
                    <h1>Главная страница</h1>

                    <h2>
                        Ваше ФИО: <span style={{color: "var(--accent)"}}>{user.fio}</span><br/>
                        Аккаунт: <span style={{color: "var(--accent)"}}>{user.role}</span><br/>
                        Количество штрафов: <span style={{color: "var(--accent)"}}>{user.driverType.fine.numberOfUnpaidFines}</span><br/>
                        Баланс: <span style={{color: "var(--accent)"}}>{user.driverType.currentBalance}</span>
                    </h2>

                    <div style={{backgroundColor: "#AA3BFF4D"}}>
                        <button className="counter" onClick={() => navigate("/addcertific")}>добавить водительское удостоверение</button>
                        <button className="counter" onClick={() => navigate("/addvich")}>добавить транспортное средство</button>
                        <button className="counter" onClick={() => navigate("/payfine")}>оплатить штраф</button>
                        <button className="counter" onClick={() => navigate("/addcertifperiod")}>продлить срок лицензии</button>
                    </div>

                    <br/> <br/>
                    <button className="counter" onClick={() => navigate("/")}>выйти из системы</button>
                </div>
            ) : user.role == "dps" ? (
                <div>
                    вы в акке дпс

                    <br/> <br/>
                    <button className="counter" onClick={() => navigate("/")}>выйти из системы</button>
                </div>
            ) : (
                <div>
                    вы в акке банка

                    <br/> <br/>
                    <button className="counter" onClick={() => navigate("/")}>выйти из системы</button>
                </div>
            )}
        </div>
    )
}
export default MainPage;