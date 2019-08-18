import axios from 'axios'
import CustomersAPI from './customersAPI'
import jwtDecode from 'jwt-decode'

function authenticate(credentials) {
    return axios
        .post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // Token storage
            window.localStorage.setItem("authToken", token)

            // Set Authorization header
            setAxiosToken(token)
        })
}

function logout() {
    window.localStorage.removeItem("authToken")
    delete axios.defaults.headers["Authorization"]
}

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token
}

function setUp() {
    const token = window.localStorage.getItem("authToken")
    if(token) {
        const jwtData = jwtDecode(token)
        if(jwtData.exp * 1000 > new Date().getTime()) {
            // Set Authorization header
            setAxiosToken(token)
            console.log("Connexion établie.")
        } 
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken")
    if(token) {
        const jwtData = jwtDecode(token)
        if(jwtData.exp * 1000 > new Date().getTime()) {
            return true
        } 
        return false
    }
    return false
}


export default {
    authenticate,
    logout,
    setUp,
    setAxiosToken,
    isAuthenticated
}