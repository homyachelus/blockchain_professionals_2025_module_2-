import "../css/App.css";
import {useNavigate} from "react-router";
import {useMyContext} from "../redux/context.tsx";

const MainPage = () => {

    const navigate = useNavigate();

    const {user, bank} = useMyContext();

    return (
        <div>
            {!user ? (
                <p>загрузка пользователя...</p>
            ) : (
                <div>
                    {user.role == "driver" ? (
                        <div>
                            <h1>Главная страница ВОДИТЕЛЯ</h1>

                            <h2>
                                Ваше ФИО: <span style={{color: "var(--accent)"}}>{user.fio}</span><br/>
                                Аккаунт: <span style={{color: "var(--accent)"}}>{user.role}</span><br/>
                                Количество штрафов: <span style={{color: "var(--accent)"}}>{user.driverType.fine.numberOfUnpaidFines}</span><br/>
                                Баланс: <span style={{color: "var(--accent)"}}>{user.driverType.currentBalance}</span><br/><br/>
                            </h2>

                            <div style={{backgroundColor: "#AA3BFF4D"}}>
                                <button className="counter" onClick={() => navigate("/addcertific")}>добавить водительское удостоверение</button>
                                <button className="counter" onClick={() => navigate("/addvich")}>добавить транспортное средство</button>
                                <button className="counter" onClick={() => navigate("/payfine")}>оплатить штраф</button>
                                <button className="counter" onClick={() => navigate("/addcertifperiod")}>продлить срок лицензии</button>
                            </div> <br></br>

                            <h2>Ваши лицензии</h2>

                            {user.driverType.certificate ? (
                                <h3 style={{backgroundColor: "#AA3BFF4D"}}>
                                    Номер: {user.driverType.certificate.num}<br></br>
                                    Срок: {(user.driverType.certificate.certificatePeriod).toString().split('T')[0]}<br></br>
                                    Категория: {Array.isArray(user.driverType.certificate.category)
                                        ? user.driverType.certificate.category.join(", ")
                                        : user.driverType.certificate.category}
                                </h3>
                            ) : (
                                <p>лицензий нет</p>
                            )}

                            <h2>Ваш транспорт</h2>

                            {user.vehicleType ? (
                                <h3 style={{backgroundColor: "#AA3BFF4D"}}>
                                    Категория: {user.vehicleType.category}<br></br>
                                    Рыночная стоимость: {user.vehicleType.marketValue}<br></br>
                                    Категория: {user.vehicleType.serviceLife}
                                </h3>
                            ) : (
                                <p>транспорта нет</p>
                            )}

                            <br/> <br/>
                            <button className="counter" onClick={() => {navigate("/")}}>выйти из системы</button>
                        </div>
                    ) : user.role == "dps" ? (
                        <div>
                            <h1>Главная страница СОТРУДНИКА ДПС</h1>
                            <h2>
                                Ваше ФИО: <span style={{color: "var(--accent)"}}>{user.fio}</span><br/>
                                Аккаунт: <span style={{color: "var(--accent)"}}>{user.role}</span><br/><br/>
                            </h2>

                            <button className="counter" onClick={() => navigate("/issuefine")}>выписать штраф</button>

                            <br/> <br/>
                            <button className="counter" onClick={() => {navigate("/")}}>выйти из системы</button>
                        </div>
                    ) : (
                        <div>
                            <h1>Главная страница БАНКА</h1>
                            <h2>Баланс: {bank.driverType.currentBalance}</h2>

                            <br/> <br/>
                            <button className="counter" onClick={() => {navigate("/")}}>выйти из системы</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default MainPage;