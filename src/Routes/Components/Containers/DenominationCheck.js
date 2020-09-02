import React, { Component } from "react";
// import Header from "../Headers/Header";
import { Icon } from "react-icons-kit";
// import {ic_mode_edit} from 'react-icons-kit/md/ic_mode_edit'
// import {ic_delete} from 'react-icons-kit/md/ic_delete'
// import FoodMenuFooter from '../Footers/FoodMenuFooter';
// import Switch from 'react-switch';
import { Grid, Row, Col,  Button} from "react-bootstrap";
// import Tabs from "../extra/Tabs";
import axios from 'axios';
// import validator from 'validator';
import  SweetAlert from 'react-bootstrap-sweetalert';
// import { func } from "prop-types";
import {ic_done} from 'react-icons-kit/md/ic_done';
import {ic_close} from 'react-icons-kit/md/ic_close'
import {ic_replay} from 'react-icons-kit/md/ic_replay'
const API_URL = process.env.REACT_APP_API_URL;

export default class DenominationCheck extends Component {
    constructor(props,context)
    {
        super(props,context);
        this.state = {
            denominationData : [],
            alert_message : '',
            alert_state_success : false,
            alert_state_warning : false,
            total_amount : 0,
            amountArray : [],
            start_session : false,
            bill_amount : 0,
            cash_amount :0,
            card_amount : 0,
            total_opening_amount:0,
            roundoff_amount:0,
            // new_session_start:false
        }  
    }

    async componentWillMount(){
        await this.fetchDenomination();
    }

    async fetchDenomination(){
                let etotal = 0;
        let stotal = 0;
        let total = 0;
        let floor_id = sessionStorage.getItem('floor_id')
        await axios.get(API_URL+'/hms/kot/checkForDayStart/'+floor_id)
        .then(async (response)=>{
            console.log("response",response.data)
            if(response.data.length === 0){
                this.setState({
                    start_session :true
                })  
            }
            else{
                this.setState({
                    start_session : false
                })
            }

            if(this.state.start_session === false){
                 await axios.get(API_URL+'/hms/kot/checkForSessionStart/'+floor_id)
                .then((res5)=>{
                    console.log("response data",res5)
                    if(res5.data.length === 0){
                        this.setState({
                            new_session_start :true
                        })  
                    }
                    else{
                        this.setState({
                            new_session_start : false
                        })
                    }
                })

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

                if(this.state.new_session_start === false){
                    await axios.get(API_URL+'/hms/kot/getDenominationData/'+floor_id)
                    .then((response)=>{
                        console.log("denominationdata in if condition",response.data)
                        this.setState({
                            denominationData:response.data
                        },()=>{
                            this.state.denominationData.map((rows,i)=>{
                                rows.nested_type.map((row,j)=>{
                                    row.nested_session.map((ro,k)=>{
                                        if(ro.denomination_entry_point === 'session_start'){
                                            stotal = stotal + ro.nested_quantity[0].total_amount;
                                        }
                                        else{
                                            etotal = etotal + ro.nested_quantity[0].total_amount;
                                        }
                                    })
                                })
                            })
                            // this.state.denominationData.map((d,i)=>{
                            //     d.denomination_price_array.map((r,index)=>{
                            //         // console.log(r)
                            //         if(r.denomination_entry_point === 'session_end'){
                            //             etotal = etotal + r.total_amount;
                            //         }
                            //         else{
                            //             stotal = stotal + r.total_amount;
                            //         }
                            //         // total = total + r.total_amount;
                            //     })
                            // })
                            this.setState({
                                start_total_amount : stotal,
                                end_total_amount : etotal
                            })
                        })
                    })

                    // await axios.get(API_URL+'/hms/kot/getCashAmount/'+floor_id)
                    // .then((res1)=>{
                    //     this.setState({
                    //         cash_amount : res1.data[0].cash_amount,
                    //         card_amount : res1.data[0].card_amount,
                    //         roundoff_amount : res1.data[0].roundoff_amount
                    //     })
                    // })
                }
                else{
                      await axios.get(API_URL+'/hms/kot/getAllDenomination')
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
            }
            else{
                await axios.get(API_URL+'/hms/kot/getAllDenomination')
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
            denomination_check_point:'day_start',
            emp_id :emp_id,
            denominationArray : arrayNew,
            floor_id : sessionStorage.getItem("floor_id")
        }

        axios.post(API_URL+'/hms/kot/add_denomination_collection',{data})
        .then((response)=>{
            if(response.status === 200){
                this.props.history.replace('/home')
            }
        })
    }

    startSession(){
        let {total_amount,total_opening_amount,bill_amount} = this.state;
        // if(total_amount === total_opening_amount+bill_amount){
            let floor_id = 0;
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
                denomination_check_point:'session_start',
                emp_id :emp_id,
                denominationArray : arrayNew,
                floor_id : sessionStorage.getItem('floor_id')
            }

            axios.post(API_URL+'/hms/kot/add_denomination_collection',{data})
            .then(async (response)=>{
                if(response.status === 200){
                    await this.fetchDenomination();
                }   
            })
        // }
        // else{
        //     this.setState({
        //         alert_message:'Wrong denomination entry',
        //         alert_state_warning : true
        //     })
        // }   
    }

    newSessionStart(){
        let floor_id = sessionStorage.getItem('floor_id');
        axios.post(API_URL+'/hms/kot/updateDenominationata/'+floor_id).then((response)=>{
            if(response.status === 200){
               this.props.history.replace('/home') 
            }
        })
    }

    reentrySession(){
        this.props.history.replace('/denominationReentry')
    }

    recoverDenomination(){
        this.props.history.replace('/recovery')
    }

    render() {
        console.log(this.state.start_session,this.state.new_session_start)
        let formIsValid = true;
        // if(this.state.denominationData){
        //     this.state.denominationData.map((rows,index)=>{
        //         rows.denomination_price_array.map((row,i)=>{
        //             if(this.state[rows.denomination_type+row]){
        //                 formIsValid = formIsValid && this.state[rows.denomination_type+row].valid;
        //             }
        //         })
        //     })
        // }

        function toCurrency(numberString) {
            let number = parseFloat(numberString);
            return number.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        return (
            <div className="denominationGrid" style={{overflow:'none'}}>

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
                <div className="denominationHeader">
                    <h1 className="header1">
                        {/* <Icon icon={ic_keyboard_backspace} size={26} style={{float:'left'}}/> */}
                        Denomination
                        {/* <Icon icon={ic_power_settings_new} size={26} style={{float:'right'}}/> */}
                    </h1>
                </div>
                <div className="denominationBody">
                    {(!this.state.start_session && !this.state.new_session_start) &&
                    <>
                        <Row>
                           { this.state.denominationData &&
                                this.state.denominationData.map((rows,index)=>{
                                        console.log(rows)
                                        return (
                                            <Col md={6} key={index} className="denominationDiv">
                                                <Row>
                                                    <Col md={12} mobile={12}>
                                                        <h3 className="typeHeader">{rows.denomination_type}</h3>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        <table className = "denominationTable">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{fontVariant:"small-caps",fontSize:'1.5em',fontStyle: 'oblique'}}>Type</th>
                                                                    <th style={{fontVariant:"small-caps",fontSize:'1.5em',fontStyle: 'oblique'}}>Start</th>
                                                                    <th style={{fontVariant:"small-caps",fontSize:'1.5em',fontStyle: 'oblique'}}>End</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    rows.nested_type &&
                                                                    rows.nested_type.map((row)=>{
                                                                      return ( <tr>
                                                                            <td style={{fontWeight: 'bold'}}>{row.denomination_price}</td>
                                                                            {row.nested_session.map((r,i)=>{
                                                                                return(
                                                                                    <>
                                                                                    {r.denomination_entry_point === 'session_start' && <td>{r.nested_quantity[0].quantity}</td>}
                                                                                    {r.denomination_entry_point === 'session_end' && <td>{r.nested_quantity[0].quantity}</td>}
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </tr>)
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    {
                                                        // rows.denomination_price_array.map((r, i)=>{
                                                        //     return (
                                                        //         <div>
                                                        //         </div>
                                                                // <Row>
                                                                //     <Col xs={2} md={2}>
                                                                //         <span>{r.denomination_entry_point}</span>
                                                                //     </Col>
                                                                //     <Col xs={2} md={2}>
                                                                //         <span>{r.denomination_price}</span>
                                                                //     </Col>

                                                                //     <Col xs={1} md={1}>
                                                                //         <span>X</span>
                                                                //     </Col>

                                                                //     <Col xs={3} md={3}>
                                                                //       <span>{r.quantity}</span>
                                                                //     </Col>

                                                                //     <Col xs={1} md={1}>
                                                                //         <span>=</span>
                                                                //     </Col>

                                                                //     <Col xs={3} md={3}>
                                                                //         <span>
                                                                //         {toCurrency(r.total_amount)}
                                                                //         </span>
                                                                //     </Col>
                                                                // </Row>
                                                            // )
                                                        // })
                                                    }
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )
                                    })
                                } 
                        </Row>
                        <Row style={{marginTop:'0px',textAlign:'left'}}>

                                 <Col md={12} style={{textAlign:'right'}}>
                                    <span >Total denomination amount (previous end session)</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.end_total_amount)}</span>
                                </Col>

                                <Col md={12} style={{textAlign:'right'}}>
                                    <span >Total denomination amount (start session)</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.start_total_amount)}</span>
                                </Col> 
                               

                                <Col md={12}>
                                    <span >Total opening cash amount</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.total_opening_amount)}</span>
                                </Col>

                                {/* <Col md={12}>
                                    <span >Total Cash amount</span>
                                    <span> : </span>
                                    <span>{this.state.cash_amount === null ? 0 : toCurrency(this.state.cash_amount)}</span>
                                    </Col> */}

                                {/* <Col md={12} style={{textAlign:'right'}}>
                                        <span >Total denomination amount to enter</span>
                                        <span> : </span>
                                        <span>{toCurrency(this.state.total_opening_amount+this.state.cash_amount)}</span>
                                    </Col>  */}

                                {/* <Col md={12}>
                                    <span >Total Card amount</span>
                                    <span> : </span>
                                    <span>{this.state.card_amount === null ? 0 : toCurrency(this.state.card_amount)}</span>
                                </Col> */}

                                {/* <Col md={12}>
                                    <span >Total amount</span>
                                    <span> : </span>
                                    <span>{this.state.bill_amount === null ? 0 : toCurrency(this.state.bill_amount)}</span>
                                </Col> */}

                                {/* <Col md={12}>
                                    <span >Total roundoff amount</span>
                                    <span> : </span>
                                    <span>{this.state.roundoff_amount === null ? 0 : toCurrency(this.state.roundoff_amount)}</span>
                                </Col> */}

                                <Col md={12} >
                                    <span >Total bill amount</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.bill_amount+this.state.roundoff_amount)}</span>
                                </Col>
                            </Row>
                            </>
                    }
                     { (this.state.start_session || this.state.new_session_start) &&
                        <>
                            <Row>
                                {
                                     this.state.denominationData.map((rows,index)=>{
                                        return (
                                            <Col md={6} key={index} className="denominationDiv">
                                                <Row >
                                                    <Col md={12}>
                                                        <h3 className="typeHeader">{rows.denomination_type}</h3>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        <>
                                                              {
                                                        rows.denomination_price_array.map((price, i)=>{
                                                            let inputType = rows.denomination_type+price
                                                            return (
                                                                <Row>
                                                                    <Col md={2} style={{textAlign:'center'}}>
                                                                        <span>{price}</span>
                                                                    </Col>

                                                                    <Col md={1}>
                                                                        <span>X</span>
                                                                    </Col>

                                                                    <Col  md={5}>
                                                                        { 
                                                                            this.state[inputType] && 
                                                                            <input type="number"
                                                                                id={rows.denomination_type+price}
                                                                                value={this.state[inputType].value}
                                                                                onChange={this.handleChange.bind(this)}
                                                                                className='denominationInput'
                                                                                min={0}
                                                                            />
                                                                        }
                                                                    </Col>

                                                                    <Col md={1}>
                                                                        <span>=</span>
                                                                    </Col>

                                                                    {   
                                                                        this.state[inputType] && 
                                                                        <Col md={3}>
                                                                            <span>
                                                                                {toCurrency(price*this.state[inputType].value)}
                                                                            </span>
                                                                        </Col>
                                                                    }
                                                                </Row>
                                                            )
                                                        })
                                                    }
                                                        </>
                                                  
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

                                {/* <Col md={12}>
                                    <span >Total Cash amount</span>
                                    <span> : </span>
                                    <span>{this.state.cash_amount === null ? 0 : toCurrency(this.state.cash_amount)}</span>
                                </Col> */}

                                {/* <Col md={12} style={{textAlign:'right'}}>
                                    <span >Total denomination amount to enter</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.total_opening_amount+this.state.cash_amount)}</span>
                                </Col> */}

                                {/* <Col md={12}>
                                    <span >Total Card amount</span>
                                    <span> : </span>
                                    <span>{this.state.card_amount === null ? 0 : toCurrency(this.state.card_amount)}</span>
                                </Col> */}

                                {/* <Col md={12}>
                                    <span >Total amount</span>
                                    <span> : </span>
                                    <span>{this.state.bill_amount === null ? 0 : toCurrency(this.state.bill_amount)}</span>
                                </Col> */}

                                {/* <Col md={12}>
                                    <span >Total roundoff amount</span>
                                    <span> : </span>
                                    <span>{this.state.roundoff_amount === null ? 0 : toCurrency(this.state.roundoff_amount)}</span>
                                </Col> */}

                                <Col md={12} style={{textAlign:'right'}}>
                                    <span >Total bill amount</span>
                                    <span> : </span>
                                    <span>{toCurrency(this.state.bill_amount+this.state.roundoff_amount)}</span>
                                </Col>
                            </Row>
                        </>
                    }
                </div>
                <div className="denominationFooter">
                    { this.state.denominationData.length === 0 && 
                        <Col md={1}>
                            <div>
                                <Button bsStyle="danger" onClick={this.recoverDenomination.bind(this)} disabled={!formIsValid}>
                                    <Icon icon={ic_replay} style={{paddingRight:'10px'}}/>
                                    <span> Recovery </span> 
                                </Button>
                            </div>
                        </Col>
                    }

                     { (!this.state.start_session && !this.state.new_session_start) && this.state.denominationData.length > 0 && 
                        <div>
                            {
                              this.state.start_total_amount != this.state.bill_amount+this.state.total_opening_amount &&  
                                <Button bsStyle="danger" onClick={this.reentrySession.bind(this)} disabled={!formIsValid}>
                                    <Icon icon={ic_close} style={{paddingRight:'10px'}}/>
                                    <span> Re-entry </span> 
                                </Button>
                            }
                            {
                                // this.state.start_total_amount === this.state.bill_amount+this.state.total_opening_amount && 
                                <Button bsStyle="success" style={{float:'right'}} onClick={this.newSessionStart.bind(this)} disabled={!formIsValid}>
                                    <Icon icon={ic_done} />
                                    <span> Start</span>
                                </Button>
                            }
                        </div>
                    }

                    { (!this.state.start_session && this.state.new_session_start) && this.state.denominationData.length > 0 && 
                        <div>
                            {/* <Button bsStyle="danger" onClick={this.reentrySession.bind(this)} disabled={!formIsValid}>
                                <Icon icon={ic_close} style={{paddingRight:'10px'}}/>
                                <span> Re-entry </span> 
                            </Button> */}
                            <Button bsStyle="success" style={{float:'right'}} onClick={this.startSession.bind(this)} disabled={!formIsValid}>
                                <Icon icon={ic_done} />
                                <span> Start Session</span>
                            </Button>
                        </div>
                    }

                    {this.state.start_session && 
                        <Button bsStyle="success" style={{float:'right'}} onClick={this.changeShift.bind(this)} disabled={!formIsValid}>
                            <Icon icon={ic_done} style={{paddingRight:'10px'}}/>
                            <span> Day start</span>
                        </Button>
                    }
                </div>

                {/* <div style={{color:'#34495e'}}>
                    { !this.state.start_session && 
                        <Grid fluid>
                            <Row>
                                {
                                    this.state.denominationData.map((d,i)=>{
                                        return(
                                            <Col md={6} key={i}>

                                                <Row>
                                                    <Col md={12} sm={12} xs={12}>
                                                        <h3 className="typeHeader">{d.denomination_type}</h3>
                                                    </Col>
                                                </Row>

                                                <Row  style={{height:'50vh',overflow:'auto',paddingBottom:'20px'}}>
                                                    <Col md={12} sm={12} xs={12}>
                                                        <table className="denominationTable">
                                                            <tbody>
                                                                { d.denomination_price_array.map((r,i)=>{
                                                                    return  ( 
                                                                        <tr key={i}>
                                                                            <th style={{paddingLeft:'40px',width:'10vw'}}>{r.denomination_price}</th>
                                                                            <th style={{paddingLeft:'20px'}}>X</th>
                                                                            <th style={{paddingLeft:'40px',width:'15vw'}}>
                                                                                {
                                                                                    <span>{r.quantity}</span>
                                                                                }
                                                                            </th>
                                                                            <th>=</th>
                                                                            { <th style={{paddingLeft:'40px',width:'15vw'}}><span>{toCurrency(r.total_amount)}</span></th>}
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
                                {
                                    this.state.denominationData.length === 0 && 
                                    <Row>
                                        <Col md={12}>
                                            <span> You haven't logout properly. Please recover denominations</span>
                                        </Col>
                                    </Row>
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

                            <Row className="footer" style={{marginTop:'0px'}}>
                                { this.state.denominationData.length === 0 && 
                                    <Col md={1}>
                                        <div>
                                            <Button bsStyle="danger" onClick={this.recoverDenomination.bind(this)} disabled={!formIsValid}>
                                                <Icon icon={ic_replay} style={{paddingRight:'10px'}}/>
                                                <span>
                                                Recovery
                                                </span> 
                                            </Button>
                                        </div>
                                    </Col>
                                }
                                {
                                    this.state.denominationData.length > 0 &&
                                    <Col md={1}>
                                    </Col>
                                }

                                <Col md={8}>
                                </Col>
                               { this.state.denominationData.length > 0 && 
                                    <Col md={1} xs={12}>
                                        <div>
                                            <Button bsStyle="warning" onClick={this.reentrySession.bind(this)} disabled={!formIsValid}>
                                                <Icon icon={ic_close} style={{paddingRight:'10px'}}/>
                                                <span>
                                                    Re-entry
                                                </span> 
                                            </Button>
                                        </div>
                                    </Col>
                                }
                                { this.state.denominationData.length <= 0 && 
                                    <Col md={1} xs={12}>
                                    </Col>
                                }

                                <Col md={2} xs={12}>
                                    <div>
                                        <Button bsStyle="success" onClick={this.startSession.bind(this)} disabled={!formIsValid}>
                                            <Icon icon={ic_done} style={{paddingRight:'10px'}}/>
                                            <span>
                                                Start session
                                            </span> 
                                        </Button>
                                    </div>
                                </Col>
                                
                            </Row>

                        </Grid>
                    }
                    { (this.state.start_session || this.state.new_session_start) &&
                        <Grid fluid>


                            <Row >
                                {
                                    this.state.denominationData.map((d,i)=>{
                                        return(
                                            <Col md={6} key={i}>

                                                <Row>
                                                    <Col md={12} sm={12} xs={12}>
                                                        <h3 className="typeHeader">{d.denomination_type}</h3>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={12} sm={12} xs={12} style={{height:'50vh',overflow:'auto',paddingBottom:'20px'}}>
                                                        <table className="denominationTable" >

                                                            <tbody>
                                                                {d.denomination_price_array.map((price,i)=>{
                                                                    let inputType = d.denomination_type+price
                                                                    return  ( 
                                                                        <tr key={i}>
                                                                            <th style={{padding:'10px',width:'10vw'}}>{price}</th>
                                                                            <th>X</th>
                                                                            <th style={{padding:'10px',width:'15vw'}}>
                                                                                {this.state[inputType] && 
                                                                                    <input type="number"
                                                                                        id={d.denomination_type+price}
                                                                                        value={this.state[inputType].value}
                                                                                        onChange={this.handleChange.bind(this)}
                                                                                        className='denominationInput'
                                                                                    />
                                                                                }
                                                                            </th>
                                                                            <th>=</th>
                                                                            { this.state[inputType] && 
                                                                                <th style={{paddingLeft:'10px',width:'15vw'}}>
                                                                                    <span>{price*this.state[inputType].value}</span>
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


                            <Row className="footer" style={{marginTop:'0px'}}>
                                <Col md={9}>
                                </Col>
                                <Col md={3}>
                                    <div>
                                        <Button bsStyle="success" onClick={this.changeShift.bind(this)} disabled={!formIsValid}>
                                            <Icon icon={ic_done} style={{paddingRight:'10px'}}/>
                                            <span>
                                                Start session
                                            </span>   
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                        </Grid>
                    }
                </div> */}
            </div>
        );
    }
}