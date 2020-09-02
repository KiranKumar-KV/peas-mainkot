import React, { Component } from "react";
import { Grid, Row, Col, Table, Button,FormGroup,FormControl,Form,InputGroup,Glyphicon ,Modal} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import  SweetAlert from 'react-bootstrap-sweetalert';
import axios from'axios';
import { Icon } from "react-icons-kit";
import validator from 'validator';
import {ic_send} from 'react-icons-kit/md/ic_send'
import Select from 'react-select';
import ReactToPrint from "react-to-print";
import moment  from 'moment-timezone';
import Billing from './Billing';
import {connect} from 'react-redux';
let p=0;
let items=[]
const API_URL = process.env.REACT_APP_API_URL;
let arr=[]

class KOTContFooter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bill_show:true,
            itemlist: [],
            bill_id: "",
            alert_state_warning: false,
            total_amount:0,
            printMessage: false,
            tax_amount:0,
            errorMessage: false,
            bill_amount: 0,
            bill_date_time:"",
            order_id:0,
            alertMessage: false,
            resp_kotList:[{
                items:[]
            }]
        }
    }

    printCall(e) {
        this.submitData('waiting')
    }

    printRender() {
    }
    async Order() {
        let data = {
            auth_token:this.props.authtoken,
            booking_id: this.props.bokingid,
            room_id: this.props.room_id,
        }
        let result = await axios.post(API_URL+'/hms/bDetails/store-food-service-detail',{data})
        if(result.data.length>0) 
        {
            try {
                if(this.props.selectedItems.length>0) {
                    const data  = {
                        itemArray:this.props.selectedItems,
                        token: this.props.authtoken
                    }
                    console.log("data",data.itemArray)
                    let result = await axios.post(API_URL+'/hms/kot/hotel-guest-order-details',data)
                    let order_id=  await result.data[0].order_id
                    this.setState({
                        order_id:order_id
                    })
                    if(result.status===200) {
                        this.setState({
                            alert_message:"Order Success..!",
                            alertMessage: true,
                            alert_state_success:true,
                            bill_show:false
                        })
                        this.props.select();
                    } 
                   
                }
                else  {
                    this.setState({
                        alert_message:"Please Select items..!",
                        alert_state_warning:true,
                        alertMessage: true
                    })
                }
            }catch(error){
                if(error) {

                    this.setState({
                        alert_message:"Order Not Done..!",
                        alert_state_warning:true,
                        errorMessage: true
                    })
                } else {

                    if (error.response.status === 500) {
                
                        this.setState({
                            alert_message:"Order Not Done..!",
                            alert_state_warning:true,
                            errorMessage: true
                        })
                    }
               
                }
              
               
               
            }
        }
    }

    async submitData(status) {
        try {
            let data_tax= {
                tax:this.props.tax,
                billstatus: status,
                token: this.props.authtoken,
                order_id: this.props.order_id,
                employee_id:sessionStorage.getItem('employee_id')
            }
            const resp= await axios.post(API_URL+'/hms/kot/hotelbill',{data_tax});
            await this.setState({
                itemlist: resp.data[0].result,
                bill_id: resp.data[0].bill_id,
                bill_amount: resp.data[0].billing_amount,
                total_amount: resp.data[0].total,
                tax_amount: resp.data[0].tax_amount,
                bill_date_time: resp.data[0].billing_date,

            })
                this.props.select();
                } 
        catch(e) {
        }
    }

    printItem = async() => {
        await this.setState({
            printMessage: true,
            alert_state_success:true,
            alert_message: "There is no available item to print"
        })
    }
 
    render(){
        return (
            <div className="kotContainerFooterRooms">
                <div className="orderTicketButtonRooms">
                    <Button  onClick={this.Order.bind(this)} >Order</Button>
                </div>
                {this.state.alertMessage &&
                    <SweetAlert success 
                        title={this.state.alert_message} 
                        show={this.state.alert_state_success}
                        onConfirm={()=>{
                            this.setState({
                                alert_state_success:false,
                                alertMessage: false
                            })
                        }}
                    />
                
                }
                 {this.state.alertMessage &&   <SweetAlert warning 
                    title={this.state.alert_message} 
                    show={this.state.alert_state_warning}
                    onConfirm={()=>{
                        this.setState({
                            alert_state_warning:false,
                            alertMessage: false
                        })
                    }}
                />}
                                
{this.state.errorMessage &&
    <SweetAlert warning 
        title={this.state.alert_message} 
        show={this.state.alert_state_warning}
        onConfirm={()=>{
            this.setState({
                alert_state_warning:false,
                
                errorMessage: false
            })
        }}
    />

}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        selectedItems:state.selectedItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        select:()=>{
            dispatch({type:'select',selectedItems:[]})
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(KOTContFooter))