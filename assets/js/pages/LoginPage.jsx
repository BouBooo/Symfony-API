import React, {useState} from 'react'
import axios from 'axios' 
import customersAPI from '../services/customersAPI';
import AuthAPI from '../services/authAPI';

const LoginPage = ({onLogin, history}) => {

    const [credentials, setCredentials] = useState({
        username : "",
        password : ""
    })

    const [error, setError] = useState("")

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget
        setCredentials({...credentials, [name] : value})
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            await AuthAPI.authenticate(credentials)
            setError("")
            onLogin(true)
            history.replace("/customers")
        } catch(error) {
            setError("Cet email ne correspond à aucun compte.")
        }
    }

    return (
        <>
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        className={"form-control" + (error && " is-invalid")} 
                        placeholder="monadresse@email.com" 
                        id="username" 
                        name="username"/>
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange}
                        type="password" 
                        className="form-control" 
                        placeholder="Mot de passe" 
                        id="password" 
                        name="password"/>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Me connecter
                    </button>
                </div>
            </form>
        </>
    )
}

export default LoginPage