import React from "react";
import ReactDOM from "react-dom";
import IndexComponent from "./IndexComponent";
import reducer from './store/reducer';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
const store=createStore(reducer);

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}><IndexComponent /></Provider>
    </BrowserRouter>
    , document.getElementById("root"));
