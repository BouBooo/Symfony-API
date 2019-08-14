import React from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import { HashRouter, Switch, Route } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';

require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Webpack Encore allow');

const App = () => {
    return <>
        <HashRouter>
            <Navbar/>

            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage}/>
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/" component={Homepage}/>
                </Switch>
            </main>
        </HashRouter>
    </>
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);