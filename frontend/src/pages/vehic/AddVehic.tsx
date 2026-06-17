import "../../css/App.css";
import {useNavigate} from "react-router";
import {useMyContext} from "../../redux/context.tsx";
import {useState} from "react";

const AddVehic = () => {

    const navigate = useNavigate();
    const {setLoading, addVich, user} = useMyContext();

    const [category, setCategory] = useState<"A" | "B" | "C">("A");
    const [marketValue, setMarketValue] = useState<number>(0); // рыноч цена
    const [serviceLife, setServiceLife] = useState<number>(0); // срок эксплуат

    const fun = async () => {
        setLoading(true)
        try {
            await addVich(category, marketValue, serviceLife, user.login)
        } catch (e) {
            setLoading(false)
            console.log(e)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div>
                <h1>Добавление транспорта</h1>

                <h3>рыночная стоимоть</h3>
                <input className="input" value={marketValue} onChange={(e) => {setMarketValue(Number(e.target.value))}}></input><br/>
                <h3>срок эксплуатации</h3>
                <input className="input" value={serviceLife} onChange={(e) => {setServiceLife(Number(e.target.value))}}></input><br/>

                <h3>категория транспорта</h3>
                <select className="select" value={category} onChange={(e) => {setCategory(e.target.value as "A" | "B" | "C")}}>
                    <option value="A">категория A</option>
                    <option value="B">категория B</option>
                    <option value="C">категория C</option>
                </select><br/>

                <button className="counter" onClick={fun}>отправить заявку</button> <br/><br/>

                <button className="counter" onClick={() => {navigate("/mainpage")}}>выйти</button>
            </div>
        </div>
    )
}

export default AddVehic;