import './css/App.css';
import {useEffect, useState} from "react";
import RegisterPage from "./pages/RegisterPage.tsx";

function App() {

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
    }, []);

    return (
        <div>
            <h1>Безопасное дорожное движение</h1>
            <RegisterPage setLoading={setLoading}></RegisterPage>
        </div>
  )
}

export default App
