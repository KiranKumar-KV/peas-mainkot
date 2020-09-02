import React,{Component} from 'react';
//import {BrowserRouter as Router,Route,Link,Redirect,withRouter} from "react-router-dom";
  
import Login from './Routes/Login';
import IndexRoute from './Routes';


class IndexComponent extends Component{
    render(){
        let token = sessionStorage.getItem('token');
        if(!token || token === '')
        {
            return(<Login/>)
        }
        else{
            return(<IndexRoute/>)
        }
    }
} 

export default IndexComponent;