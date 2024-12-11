import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from '../context/AuthProvider';
import { BASE_URL } from "../constants/apiConstants";

const PersistLogin = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [data, setData] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${BASE_URL}/api/auth/refresh`, { withCredentials: true })
            .then(response => {
                const { accessToken, username, designation, empId, empTypeId,branchId} = response?.data;
                setData(username);
                setAuth({ username, accessToken, designation, empId, empTypeId, branchId })
                // navigate("/HomeComponent");
            })
            .catch(error => {
                // handle error
                console.log(error);
                navigate("/Login");
            });
    }, [])

    // if (!data) {
    //     navigate("/Login");
    // }

    return <Outlet />
}

export default PersistLogin;