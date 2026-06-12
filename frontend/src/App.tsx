import './css/App.css';
import {useEffect} from "react";
import RegisterPage from "./pages/RegisterPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import {BrowserRouter, Routes, Route} from "react-router";
import {useMyContext} from "./redux/context.tsx";
import PayFine from "./pages/PayFine.tsx";
import AddCertificPage from "./pages/AddCertificPage.tsx";
import AddVehic from "./pages/AddVehic.tsx";
import AddCertifPeriod from "./pages/AddCertifPeriod.tsx";

function App() {

    const {setLoading} = useMyContext();

    useEffect(() => {
        setLoading(true)
    }, []);

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RegisterPage/>} />
                    <Route path="/mainpage" element={<MainPage/>}/>
                    <Route path="/payfine" element={<PayFine/>} />
                    <Route path="/addcertific" element={<AddCertificPage/>} />
                    <Route path="/addvich" element={<AddVehic/>} />
                    <Route path="/addcertifperiod" element={<AddCertifPeriod/>} />
                </Routes>
            </BrowserRouter>
        </div>
  )
}

export default App
