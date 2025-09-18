import { Navigate, Outlet } from "react-router"
import Navbar from "../components/Navbar"

const AuthLayout = () => {


    if (!localStorage.getItem('access_token')) {
        return <Navigate to="/login" />
    }

    return <div>
        <Navbar/>
        <Outlet />
    </div>


}


export default AuthLayout