import React from 'react';
import ReactDOM from "react-dom";
// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Webpack Encore allow');

const App = () => {
    return <h1>Homepage title</h1>
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);