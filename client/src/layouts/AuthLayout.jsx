import { Navigate, Outlet } from "react-router"
import Navbar from "../components/Navbar"

const AuthLayout = () => {


    if (!localStorage.getItem('access_token')) {
        return <Navigate to="/login" />
    }

    return <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-x-hidden font-inter">
        <Navbar/>
        <Outlet />
    </div>


}


export default AuthLayout