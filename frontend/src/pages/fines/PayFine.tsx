import {useNavigate} from "react-router";
import {useMyContext} from "../../redux/context.tsx";

const PayFine = () => {

    const navigate = useNavigate();
    const {user, payFine_, loading} = useMyContext();

    const fun = async () => {
        console.log(user.driverType.fine.numberOfUnpaidFines)
        console.log(user.login)

        await payFine_(user.login);
    }
    return (
        <div>
            {loading ? (
                <h3>загрузка...</h3>
            ) : (
                <div>
                    <h1>Оплата штрафа</h1>

                    <h2>
                        Ваше ФИО: <span style={{color: "var(--accent)"}}>{user.fio}</span><br/>
                        Аккаунт: <span style={{color: "var(--accent)"}}>{user.role}</span><br/>
                        Количество штрафов: <span style={{color: "var(--accent)"}}>{user.driverType.fine.numberOfUnpaidFines}</span><br/>
                        Баланс: <span style={{color: "var(--accent)"}}>{user.driverType.currentBalance}</span>
                    </h2>

                    <button className="counter" onClick={fun}>оплатить все штрафы</button><br/><br/>

                    <button className="counter" onClick={() => {navigate("/mainpage")}}>выйти</button>
                </div>
            )}
        </div>
    )
}

export default PayFine;