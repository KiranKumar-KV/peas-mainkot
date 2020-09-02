import React, { Component } from "react";
import {withRouter } from "react-router-dom";
import Axios from 'axios';
import  SweetAlert from 'react-bootstrap-sweetalert';
import { Grid, Row, Col } from "react-bootstrap";
import Images from '../Untitled-5.png';

const API_URL = process.env.REACT_APP_API_URL;

class Login extends Component {
     constructor(props){
        super(props);
        this.state = {
            uname : {valid : false,value : ''},
            password : {valid : false,value : ''},
            floor:{valid:false,value:''},
            username : '',
            pword : '',
            alert_message : '',
            alert_state_danger : false,
            alert_state_warning : false,
            alert_state_success : false,
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    componentWillMount(){
        Axios.get(API_URL+'/hms/kot/getFloorForLogin')
        .then((response)=>{
            let i;
            let rtypeSelect = document.querySelector('#floor');        
            for(i=0;i<response.data.length;i++){
                this.option = document.createElement("option");
                this.option.value = response.data[i].floor_id;
                let t = document.createTextNode(response.data[i].floor_name);
                this.option.appendChild(t);
                rtypeSelect.appendChild(this.option);
            }
            this.setState({
                floor:{
                    value:response.data[0].floor_id,
                    valid:true
                }
            })
        })
    }

    handleEnter(e){
        if(e.keyCode === 13){
            this.handleLogin(e)
        }
    }

    handleLogin(e){
        e.preventDefault();
        if(this.state.uname.valid === true && this.state.password.valid === true){
            let username = this.state.uname.value;
            let pin = this.state.password.value;
            let data={
                username:username.toLowerCase(),
                pin:pin
            }
            Axios.post(API_URL+'/hms/kot/login',{data})
            .then((response)=>{
                if(response.status === 200){
                    sessionStorage.setItem('floor_id',this.state.floor.value);
                    sessionStorage.setItem('token',response.data.token);
                    sessionStorage.setItem('role',response.data.role);
                    sessionStorage.setItem('id',response.data.id);
                    sessionStorage.setItem('login',response.data.login);
                    sessionStorage.setItem('login_id',response.data.login_id);
                    sessionStorage.setItem('employee_id',response.data.employee_id);
                    if(this.props.location.pathname === '/'){
                        this.props.history.replace('/denominationCheck');
                    }
                    else{
                        this.props.history.replace('/mainkot/denominationCheck');
                    }
                }
                else if(response.status === 201)
                {
                    this.setState({
                        alert_message:"Password mismatch...!",
                        alert_state_danger:true
                    })
                }
            })
            .catch((e)=>{
                if(e.response.status === 500){
                    this.setState({
                        alert_message:"Username does not exists.!",
                        alert_state_danger:true
                    })
                }
                else{
                    this.setState({
                        alert_message:"Server Error.!",
                        alert_state_danger:true
                    })
                }
            })
        }
        else if(this.state.uname.valid === true && this.state.password.valid === false){
            this.setState({
                username:'',
                pword:'Please enter 4 digit pin'
            })
        }
        else if(this.state.uname.valid === false && this.state.password.valid === true){
            this.setState({
                username:'Please enter username',
                pword:''
            })
        }
        else{
            this.setState({
                username:'Please enter username',
                pword:'Please ender 4 digit pin'
            })
        }
    }

    handleChange(e){
        let valid = this.state[e.target.name].valid;
        e.preventDefault();
        let value = e.target.value
        switch(e.target.name){
            case 'uname':
                if (/^[A-Za-z]+$/.test(value)) {
                    valid = true;
                    this.setState({
                    username:''
                    })
                } else {
                    valid = false;
                    this.setState({
                    username:'Username is not valid'
                    })
                }
                break;
            case 'password':
                if(/^[0-9]+$/.test(value)){
                    valid =true;
                    this.setState({
                    pword:''
                    })
                } else {
                    valid = false;
                    this.setState({
                    pword:'Password is not valid'
                    })
                }
                break;
            case 'floor':
                if(value.length >0){
                    valid = true;
                }
                else{
                    valid = false;
                }
                break;
        }
        this.setState({
            [e.target.name]:{value:e.target.value,valid:valid},
        })
    }

    render() {
        return (
            <div className="outerGrid">
                <SweetAlert 
                    danger title={this.state.alert_message} 
                    show={this.state.alert_state_danger} 
                    onConfirm={()=>{
                        this.setState({
                            alert_state_danger:false
                        })
                    }}
                />
                <SweetAlert 
                    warning title={this.state.alert_message} 
                    show={this.state.alert_state_warning} 
                    onConfirm={()=>{
                        this.setState({
                            alert_state_warning:false
                        })
                    }}
                />
                <SweetAlert 
                    success title={this.state.alert_message} 
                    show={this.state.alert_state_success} 
                    onConfirm={()=>{
                        this.setState({
                            alert_state_success:false
                        })
                    }}
                />
                <Grid>
                    <Row>
                        <h1 style={{color:"white"}}>Main KOT</h1>
                    </Row>
                    <Row>
                        <Col>
                            <div className="panelOuterDiv">
                                <div className="panelDiv">
                                    <h4>Sign In</h4>
                                    <p>Welcome back! please sign-in</p>
                                    <input type="text" 
                                        placeholder="Username" 
                                        name="uname" 
                                        value={this.state.uname.value} 
                                        onChange={this.handleChange.bind(this)}
                                        onKeyDown = {this.handleEnter}
                                        autoFocus={true}
                                    /><br/>
                                    <span id="username" 
                                        style={{color:'red',fontSize:'12px'}}
                                    >
                                        {this.state.username}
                                    </span>
                                    <br/>
                                    <input type="password" 
                                        placeholder="Password" 
                                        name="password" 
                                        value={this.state.password.value} 
                                        onChange={this.handleChange.bind(this)} 
                                        onKeyDown = {this.handleEnter}
                                    />
                                    <br/>
                                    <span id="pword" 
                                        style={{color:'red',fontSize:'12px'}}
                                    >
                                        {this.state.pword}
                                    </span>                                    
                                    <br/>
                                    <select 
                                        name="floor"
                                        id="floor" 
                                        value={this.state.floor.value} 
                                        onChange={this.handleChange.bind(this)} 
                                    >
                                        {/* <option value=''>Choose floor</option> */}
                                    </select>
                                    <br/>
                                    <button className="loginButton" onClick={this.handleLogin}>
                                        <span>Sign In</span>
                                    </button>              
                                    <div className="infoLed">
                                        <h1><a>VRV <span>Info Led</span></a></h1>
                                    </div>
                                    <div className="divImage">
                                        <img src={Images} alt=""/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
export default withRouter(Login);