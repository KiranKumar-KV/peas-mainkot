import React, { Component } from "react";
import {withRouter} from 'react-router-dom'
// import Header from "../Headers/Header";
import { Icon } from "react-icons-kit";
// import {ic_mode_edit} from 'react-icons-kit/md/ic_mode_edit'
// import {ic_delete} from 'react-icons-kit/md/ic_delete'
// import FoodMenuFooter from '../Footers/FoodMenuFooter';
// import Switch from 'react-switch';
import { Grid, Row, Col, Button} from "react-bootstrap";
// import Tabs from "../extra/Tabs";
import axios from 'axios';
// import validator from 'validator';
import  SweetAlert from 'react-bootstrap-sweetalert';
// import { func } from "prop-types";
// import {ic_arrow_back} from 'react-icons-kit/md/ic_arrow_back'
import {ic_keyboard_backspace} from 'react-icons-kit/md/ic_keyboard_backspace'

const API_URL = process.env.REACT_APP_API_URL;

class ChangeShift extends Component {
    constructor(props,context)
    {
        super(props,context);
        this.state={
            denominationData:[],
            alert_message:'',
            alert_state_success:false,
            alert_state_warning:false,
            alert_message_show:false,
            total_amount : 0,
            amountArray:[],
            bill_amount : 0,
            cash_amount :0,
            card_amount : 0,
            total_opening_amount:0,
            roundoff_amount:0,
        }  
    }

    async componentWillMount(){
        let floor_id = sessionStorage.getItem('floor_id')
        await axios.get(API_URL+'/hms/kot/getBillAmount/'+floor_id)
        .then((res)=>{
            let sum_amount = res.data[0].sum;
            this.setState({
                bill_amount : sum_amount
            })
        })

        await axios.get(API_URL+'/hms/kot/getCashAmount/'+floor_id)
        .then((res1)=>{
            this.setState({
                cash_amount : res1.data[0].cash_amount,
                card_amount : res1.data[0].card_amount,
                roundoff_amount : res1.data[0].roundoff_amount
            })
        })

        await axios.get(API_URL+'/hms/kot/getOpeningAmount/'+floor_id)
        .then((res1)=>{
            this.setState({
                total_opening_amount : res1.data[0].opening_amount,
            })
        })

        await  axios.get(API_URL+'/hms/kot/getAllDenomination')
        .then((response)=>{
            this.setState({
                denominationData:response.data
            },()=>{
                this.state.denominationData.map((d,i)=>{
                    d.denomination_price_array.map((price,index)=>{
                        let d_state = d.denomination_type+price;
                        this.setState({
                            [d_state] :{type:d.denomination_type,price:price,value:'',valid:false,sum:0}
                        })
                    })
                })
            })
        })
    }

    handleChange(e){
        let id = e.target.id;
        var num = id.match(/\d+/g);
        var letr=  id.match(/[a-zA-Z]+/g);
        let valid = this.state[e.target.id].valid;
        let value = e.target.value;

        if(value >=0 && value.length > 0){
            valid = true;
        }
        else{
            valid = false;
        }

        let sum = Number(num[0]) * Number(value);
        let type = e.target.id;
        let array1 = this.state.amountArray;

        if(array1.length === 0){
            array1.push({"type":type,"sum":sum});
        }
        else{
            array1.map((r,i)=>{
                if(r.type === e.target.id){
                    array1.splice(i,1)
                }
                else{
                }
            })
             array1.push({"type":type,"sum":sum});
        }

        let total = 0;

        array1.map((d,i)=>{
            total = total + d.sum
        })
        this.setState({
            amountArray:array1
        })

        let newstate = this.state[e.target.id];
        newstate.type = letr[0];
        newstate.price = Number(num[0]);
        newstate.valid = valid;
        newstate.value = value;
        newstate.sum = sum;

        this.setState({
            newstate,
            total_amount:total
        })
    }

    changeShift(){
        let newobject={};
        let arrayNew = [];
        let emp_id = sessionStorage.getItem('employee_id');
        let type='';
        let price=0;
        let quantity=0;
        let total_amount=0;

        this.state.denominationData.map((rows,index)=>{
            rows.denomination_price_array.map((row,i)=>{
                type = this.state[rows.denomination_type+row].type;
                price = this.state[rows.denomination_type+row].price;
                quantity = this.state[rows.denomination_type+row].value;
                total_amount = this.state[rows.denomination_type+row].sum;
                newobject = {"denomination_type":type,"denomination_price":price,"quantity":quantity,"total_amount":total_amount}
                arrayNew.push(newobject)
            })
        })

        let data = {
            denomination_check_point:'session_end',
            emp_id :emp_id,
            floor_id : sessionStorage.getItem('floor_id'),
            denominationArray : arrayNew,
        }

        axios.post(API_URL+'/hms/kot/add_denomination_collection',{data})
        .then((response)=>{
            this.handleLogout()    
        })
    }

    handleLogout()
    {
        let login_id = sessionStorage.getItem('login_id')

        axios.put(API_URL+'/hms/kot/logout/'+login_id)
        .then((response)=>{
            if(response.status === 200){ 
                 sessionStorage.removeItem('floor_id')
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('login');
                sessionStorage.removeItem('login_id');
                this.props.history.replace('/')
            }
        })
        .catch((e)=>{
        })
    }

    handleBack(){
        this.props.history.replace('/home')
    }

    handleDayEnd = () =>{
         this.setState({
             alert_message_show :true
         })
    }

    onCancelDelete =()=>{
        this.setState({
            alert_message_show :false
        })
    }

    dayFinish = () => {
        let {total_amount,bill_amount,total_opening_amount} = this.state;

            console.log(total_amount,bill_amount,total_opening_amount)
            // if(total_amount === bill_amount+total_opening_amount){
                let newobject={};
                let arrayNew = [];
                let emp_id = sessionStorage.getItem('emp_id');
                let type='';
                let price=0;
                let quantity=0;
                // let total_amount=0;

                this.state.denominationData.map((rows,index)=>{
                    rows.denomination_price_array.map((row,i)=>{
                        type = this.state[rows.denomination_type+row].type;
                        price = this.state[rows.denomination_type+row].price;
                        quantity = this.state[rows.denomination_type+row].value;
                        total_amount = this.state[rows.denomination_type+row].sum;
                        newobject = {"denomination_type":type,"denomination_price":price,"quantity":quantity,"total_amount":total_amount}
                        arrayNew.push(newobject)
                    })
                })

                let data = {
                    denomination_check_point:'day_end',
                    emp_id :emp_id,
                    floor_id : sessionStorage.getItem('floor_id'),
                    denominationArray : arrayNew,
                }

                axios.post(API_URL+'/hms/kot/add_denomination_collection',{data})
                .then((response)=>{
                    this.handleLogout()    
                })
            // }
            // else{
                // this.setState({
                //     alert_message:'Wrong denomination entry',
                //     alert_state_danger:true
                // })
            // }
    }

    render() {
        console.log("state",this.state)
        let formIsValid = true;

        if(this.state.denominationData){
            this.state.denominationData.map((rows,index)=>{
                rows.denomination_price_array.map((row,i)=>{
                    if(this.state[rows.denomination_type+row]){
                        formIsValid = formIsValid && this.state[rows.denomination_type+row].valid;

                    }
                })
            })
        }

        function toCurrency(numberString) {
            let number = parseFloat(numberString);
            return number.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        return (
            <div className="denominationGrid" style={{overflow:'auto'}}>

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

                <SweetAlert 
                    show={this.state.alert_message_show}
                    warning
                    showCancel
                    confirmBtnText="Yes, finish it..!"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title="Are you sure...?"
                    onConfirm={this.dayFinish}
                    onCancel={this.onCancelDelete}
                >
                    You will not be able to recover this imaginary file!
                </SweetAlert>
                        
                <div style={{color:'#34495e'}}>

                     <Grid fluid>

                        <Row className="denominationHeader">
                            <h1 className = 'header1'>
                                <Icon icon={ic_keyboard_backspace}
                                    size={28} className="backButton"
                                    onClick={this.handleBack.bind(this)}
                                />
                                <span>
                                    Denomination
                                </span>
                            </h1>
                        </Row>

                        <Row>
                            {
                                this.state.denominationData.map((d,i)=>{
                                    return(
                                        <Col md={6} key={i}>

                                            <Row>
                                                <Col md={12} sm={12}>
                                                    <h3 className="typeHeader">{d.denomination_type}</h3>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={12} sm={12} style={{height:'50vh',overflow:'hidden',overflowY:"auto",paddingBottom:'20px'}}>
                                                    <table className="denominationTable">
                                                        <tbody>
                                                            {d.denomination_price_array.map((price,i)=>{
                                                                let inputType = d.denomination_type+price
                                                                return  ( 
                                                                    <tr key={i}>
                                                                        <th style={{padding:'10px',width:'10vw'}}>{price}</th>
                                                                        <th>X</th>
                                                                        <th style={{padding:'10px',width:'15vw'}}>
                                                                            { 
                                                                                this.state[inputType] && 
                                                                                <input type="number"
                                                                                    id={d.denomination_type+price}
                                                                                    value={this.state[inputType].value}
                                                                                    onChange={this.handleChange.bind(this)}
                                                                                    className='denominationInput'
                                                                                />
                                                                            }
                                                                        </th>
                                                                        <th>=</th>
                                                                        {   
                                                                            this.state[inputType] && 
                                                                            <th style={{paddingLeft:'40px',width:'15vw'}}>
                                                                                <span>
                                                                                    {toCurrency(price*this.state[inputType].value)}
                                                                                </span>
                                                                            </th>
                                                                        }
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        <Row style={{marginTop:'0px',textAlign:'left'}}>
                            <Col md={12} style={{textAlign:'right'}}>
                                <span >Total denomination amount</span>
                                <span> : </span>
                                <span>{toCurrency(this.state.total_amount)}</span>
                            </Col>  
                            <Col md={12}>
                                <span >Total opening cash amount</span>
                                <span> : </span>
                                <span>{toCurrency(this.state.total_opening_amount)}</span>
                            </Col>     
                            <Col md={12}>
                                <span >Total Cash amount</span>
                                <span> : </span>
                                <span>{this.state.cash_amount === null ? 0 : toCurrency(this.state.cash_amount)}</span>
                            </Col>
                             <Col md={12} style={{textAlign:'right'}}>
                                    <span >Total denomination amount to enter</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.total_opening_amount+this.state.cash_amount)}</span>
                                </Col> 
                            <Col md={12}>
                                <span >Total Card amount</span>
                                <span> : </span>
                                <span>{this.state.card_amount === null ? 0 : toCurrency(this.state.card_amount)}</span>
                            </Col>
                            <Col md={12}>
                                <span >Total amount</span>
                                <span> : </span>
                                <span>{this.state.bill_amount === null ? 0 : toCurrency(this.state.bill_amount)}</span>
                            </Col>
                             <Col md={12}>
                                <span >Total roundoff amount</span>
                                <span> : </span>
                                <span>{this.state.roundoff_amount === null ? 0 : toCurrency(this.state.roundoff_amount)}</span>
                            </Col>
                            <Col md={12} style={{textAlign:'right'}}>
                                <span >Total bill amount</span>
                                <span> : </span>
                                <span>{toCurrency(this.state.bill_amount+this.state.roundoff_amount)}</span>
                            </Col>
                        </Row>
                        <Row className="footer"  style={{marginTop:'0px'}}>
                            <Col md={2}>
                                 <div>
                                    <Button bsStyle="warning" onClick={this.handleDayEnd} disabled={!formIsValid}>
                                        Day End
                                    </Button>
                                </div>
                            </Col>
                            <Col md={7}></Col>
                            <Col md={3}>
                                <div>
                                    <Button bsStyle="success" onClick={this.changeShift.bind(this)} disabled={!formIsValid}>
                                        Change Shift
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withRouter(ChangeShift);