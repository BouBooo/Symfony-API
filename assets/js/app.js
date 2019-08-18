import React, {useState, useContext} from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import { HashRouter, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI'
import AuthContext from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

require('../css/app.css');


AuthAPI.setUp() 

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated())

    const NavbarWithRouter = withRouter(Navbar)


    return <>
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <PrivateRoute 
                            path="/invoices" 
                            component={InvoicesPage} 
                        />

                        <PrivateRoute
                            path="/customers" 
                            component={CustomersPage} 
                        />

                        <Route 
                            path="/login" 
                            component={LoginPage}
                        />
                        <Route 
                            path="/" 
                            component={Homepage}
                        />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    </>
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);