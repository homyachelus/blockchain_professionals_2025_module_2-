import {useNavigate} from "react-router";
import "../../css/App.css";
import {useMyContext} from "../../redux/context.tsx";
import {useState} from "react";

const AddCertifPeriod = () => {

    const navigate = useNavigate();
    const {addCertifPer, user, setLoading} = useMyContext();

    const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

    const fun = async () => {
        setLoading(true)
        try {
            await addCertifPer(selectedPeriod, user.login);
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Продление срока лицензии</h1>

            <h3>на сколько лет</h3>
            <input className="input" value={selectedPeriod} onChange={(e) => {setSelectedPeriod(Number(e.target.value))}}></input><br/>
            <button className="counter" onClick={fun}>подать заявку</button> <br/><br/>


            <button className="counter" onClick={() => {navigate("/mainpage")}}>выйти</button>
        </div>
    )
}

export default AddCertifPeriod