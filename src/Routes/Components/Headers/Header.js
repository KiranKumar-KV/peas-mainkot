import React, { Component } from "react";
import { Col, Label } from "react-bootstrap";
import {Icon} from 'react-icons-kit'
import {powerOff} from 'react-icons-kit/fa/powerOff'
import LoginIcon from "../assets/images/sign-out-alt-solid.svg";
import {withRouter} from 'react-router-dom';
import { ToastContainer, toast,Slide,Bounce,Zoom, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
import ReactTooltip from 'react-tooltip';
import {kotAdd} from '../../../kotAdd';
import { Offline, Online,Detector } from "react-detect-offline";
import Notifications, { notify } from 'react-notify-toast';
import { ic_fiber_manual_record } from 'react-icons-kit/md/ic_fiber_manual_record'
import {ic_signal_wifi_off} from 'react-icons-kit/md/ic_signal_wifi_off'
import {u1F628} from 'react-icons-kit/noto_emoji_regular/u1F628'
import {leaf} from 'react-icons-kit/icomoon/leaf'
import {ic_supervisor_account} from 'react-icons-kit/md/ic_supervisor_account'
import IsOnline from 'react-is-online';
// let printer = require( 'node-thermal-printer' ); 
var PrintTemplate = require ('react-print');
const API_URL = process.env.REACT_APP_API_URL;

class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
            total_kot:0
        }
        // this.handleLogout = this.handleLogout.bind(this)
        this.handleChangeShift = this.handleChangeShift.bind(this);
    }

    handleChangeShift(){
        console.log("shift vahnge")
        this.props.history.replace('/changeshift')
    }


    // handleLogout(e)
    // {
    //     e.preventDefault();
    //     let login_id = sessionStorage.getItem('login_id')
    //     Axios.put(API_URL+'/hms/kot/logout/'+login_id)
    //     .then((response)=>{
    //         if(response.status === 200){ 
    //             sessionStorage.removeItem('token');
    //             sessionStorage.removeItem('role');
    //             sessionStorage.removeItem('id');
    //             sessionStorage.removeItem('login');
    //             sessionStorage.removeItem('login_id');
    //             this.props.history.replace('/')
    //         }
    //     })
    //     .catch((e)=>{
    //     })
    // }

    componentWillMount()
    {
        
        kotAdd((err, message) => {
            if(message === null)
            {
            }
            else
            {
                if(message.message === 'orderd')
                {
                  this.get();
                }
                else
                {
                }
            }
        })
        this.get();
    }

    async get()
    {
        Axios.get(API_URL+'/hms/waiter/kotcount')
        .then((response)=>{
            this.setState({
                total_kot : response.data[0].total_kots
            })
        })
    }
   
    internetdetector()
    {
        console.log("callede");
        alert("connection_state");
    }
   
    render() {
      
        return (
            <div >
                <Col lg={2} xs={3} className="outerHeadingDiv">
                    <div className="headingDiv">
                        
                        <h4> <Icon icon={leaf}/> PeasPOS</h4>
                    </div>
                </Col>
                <Col lg={1} lgOffset={9} xs={3} xsOffset={6}>
                    <Label   
                        style={{ background: '#008DDD',position:'absolute',right:'100px',margin:'8px',fontSize:'14px',padding:'10px'}}
                    >
                        Un-billed KOT : {this.state.total_kot}
                    </Label>
                    <div className="loginButtonDiv">
                        <Label className="logoutButton" onClick={this.handleChangeShift.bind(this)} data-tip='Shift change'>
                            <ReactTooltip type='info' effect='float' place='bottom'></ReactTooltip>
                            <Icon icon={ic_supervisor_account} size={30} className="loginIcon" style={{color:'#465cd8'}}/>
                        </Label>
                    </div>
                    <div>
                        <Online>
                        </Online>
                        <Offline className="off"
                            polling={{url:'', enabled: true, interval: 1000000, timeout: 1000000 }}>
                            <div className="offlineDiv">
                            <p style={{ paddingTop: "10px" }}>
                            <span>
                                <Icon style={{color:"#FF3A00",marginRight:"10px"}} size={20} icon={ic_signal_wifi_off} />
                            </span>No Internet Connection..!</p>
                            </div>
                        </Offline>
                    </div>
                </Col>
            </div>
        );
    }
}
 
export default withRouter(Header)