import React, {useState, useEffect} from "react"
import axios from "axios"
import jwt_decode from "jwt-decode";
import { Content, Sidebar, Footer, Header } from '../components/dashboardLayout/index.js'

const Dashboard = () => {
    // const [name, setName] = useState('')
    // const [token, setToken] = useState('')
    // const [expire, setExpire] = useState()
    // const [user, setUser] = useState([])

    // useEffect(() => {
    //     refreshToken()
    // }, [])
    // const navigate = useNavigate()

    // const refreshToken = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/token')
    //         setToken(response.data.accessToken)
    //         const decoded = jwt_decode(response.data.accessToken)
    //         setUser(decoded)
    //         setName(decoded.name)
    //         setExpire(decoded.exp)
    //     } catch (error) {
    //         if (error.response) {
    //             navigate('/')
    //         }
    //     }
    // }

    // const axiosJWT = axios.create()
    // axiosJWT.interceptors.request.use(async(config) => {
    //     const currentDate = new Date()
    //     if (expire * 1000 < currentDate.getTime()) {
    //         const response = await axiosJWT.get('http://localhost:5000/token')
    //         setToken(response.data.accessToken)
    //         const decoded = jwt_decode(response.data.accessToken)
    //         setName(decoded.name)
    //         setExpire(decoded.exp)
    //     }
    //     return config
    // }, (error) => {
    //     return Promise.reject(error)
    // })
    
    return (
        <div>
            <Sidebar/>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <Header />
                <div className="body flex-grow-1 px-3">
                <Content />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Dashboard