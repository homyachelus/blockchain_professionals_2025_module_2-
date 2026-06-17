import {useNavigate} from "react-router";
import {useMyContext} from "../../redux/context.tsx";
import "../../css/App.css";
import {useState} from "react";

const AddCertificPage = () => {

    const navigate = useNavigate();
    const {setLoading, addCertificate_, loading, user, addCategory_} = useMyContext();

    const [num, setNum] = useState<number>(0);
    const [certificatePeriod, setCertificatePeriod] = useState<Date>();
    const [category, setCategory] = useState<"A" | "B" | "C">("A");

    const [category1, setCategory1] = useState<"A" | "B" | "C">("A");

    const fun = async() => {
        setLoading(true);
        try {
            const dateStr = certificatePeriod.toISOString().split('T')[0];

            await addCertificate_(user.login, num.toString(), certificatePeriod, category)
            console.log(dateStr)
            console.log(certificatePeriod)
        }
        catch (e) {
            console.log(e);
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {loading ? (
                <h3>загрузка...</h3>
            ) : (
                <div>
                    <h1>Добавление лицензии</h1>

                    <h3>номер удостоверения</h3>
                    <input className="input" placeholder="напишите номер" onChange={(e) => {setNum(Number(e.target.value))}}></input> <br/>
                    <h3>дата окончания</h3>
                    <input className="input" type="date" onChange={(e) => {setCertificatePeriod((new Date(e.target.value)))}}></input><br/>

                    <h3>категория удостоверения</h3>
                    <select className="select" value={category} onChange={(e) => setCategory(e.target.value as "A" | "B" | "C")}>
                        <option value="A">категория A</option>
                        <option value="B">категория B</option>
                        <option value="C">категория C</option>
                    </select><br/>

                    <button className="counter" onClick={fun}>отправить заявку</button><br></br>

                    <h1>Добавление категории</h1>

                    <h3>новая категория удостоверения</h3>
                    <select className="select" value={category1} onChange={(e) => setCategory1(e.target.value as "A" | "B" | "C")}>
                        <option value="A">категория A</option>
                        <option value="B">категория B</option>
                        <option value="C">категория C</option>
                    </select><br></br>

                    <button className="counter" onClick={() => addCategory_(user.login, category1)}>добавить</button>

                    <br/><br/>
                    <button className="counter" onClick={() => {navigate("/mainpage")}}>выйти</button>
                </div>
            )}
        </div>
    )
}

export default AddCertificPage;