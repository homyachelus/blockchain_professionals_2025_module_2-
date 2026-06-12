import {useNavigate} from "react-router";
import {useMyContext} from "../redux/context.tsx";
import "../css/App.css";
import {useState} from "react";
import {getRequestCertificate} from "../api/api.ts";

const AddCertificPage = () => {

    const navigate = useNavigate();
    const {setLoading, addCertificate_, loading} = useMyContext();

    const [num, setNum] = useState<number>(0);
    const [certificatePeriod, setCertificatePeriod] = useState<Date>();
    const [category, setCategory] = useState<"A" | "B" | "C">("A");

    const fun = async() => {
        setLoading(true);
        try {
            const dateStr = certificatePeriod.toISOString().split('T')[0];

            await addCertificate_(num.toString(), certificatePeriod, category)
            console.log(dateStr)
            console.log(certificatePeriod)

            console.log(await getRequestCertificate(num.toString()))
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

                    <input className="input" placeholder="напишите номер" onChange={(e) => {setNum(Number(e.target.value))}}></input> <br/>
                    <input className="input" type="date" onChange={(e) => {setCertificatePeriod((new Date(e.target.value)))}}></input><br/>

                    <select className="select" value={category} onChange={(e) => setCategory(e.target.value as "A" | "B" | "C")}>
                        <option value="A">категория A</option>
                        <option value="B">категория B</option>
                        <option value="C">категория C</option>
                    </select><br/>

                    <button className="counter" onClick={fun}>отправить заявку</button>

                    <br/><br/>
                    <button className="counter" onClick={() => navigate("/mainpage")}>выйти</button>
                </div>
            )}
        </div>
    )
}

export default AddCertificPage;