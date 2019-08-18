import React, {useState} from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import { HashRouter, Switch, Route, withRouter } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI'

require('../css/app.css');


AuthAPI.setUp() 

console.log('Webpack Encore allow');

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated())

    const NavbarWithRouter = withRouter(Navbar)

    return <>
        <HashRouter>
            <NavbarWithRouter 
                isAuthenticated={isAuthenticated} 
                onLogout={setIsAuthenticated}
            />

            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage}/>
                    <Route path="/customers" component={CustomersPage}/>
                    <Route 
                        path="/login" 
                        render={props => (
                            <LoginPage
                                onLogin={setIsAuthenticated}
                                {...props}
                            /> 
                        )}
                    />
                    <Route path="/" component={Homepage}/>
                </Switch>
            </main>
        </HashRouter>
    </>
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);