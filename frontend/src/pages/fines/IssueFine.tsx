import "../../css/App.css";
import {useNavigate} from "react-router";
import {useMyContext} from "../../redux/context.tsx";

const IssueFine = () => {

    const navigate = useNavigate()
    const {issueFine, allUsers, setLoading} = useMyContext();

    const fun = async (num: string) => {
        setLoading(true)
        try {
            await issueFine(num);
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
        <div>
            <h1>Выписать штраф</h1>

            <h2>Выберите номер</h2>

            {allUsers && allUsers.length > 0 ? (
                allUsers.filter(u => u.driverType?.certificate?.num).map(u => (
                    <button style={{backgroundColor: "#AA3BFF4D"}} className="counter" key={u.login} onClick={() => fun(u.driverType.certificate.num)}>выписать штраф: {u.fio} {u.driverType?.certificate?.num}</button>
                ))
            ) : (
                <p>загрузка...</p>
            )}
            <br></br><br></br>

            <button className="counter" onClick={() => {navigate("/mainpage")}}>выйти</button>
        </div>
    )
}
export default IssueFine;