import React, { Component } from 'react'
import Switch from "react-switch";
import axios from 'axios';
import { Button } from "react-bootstrap";
import moment  from 'moment-timezone';
import {ic_print} from 'react-icons-kit/md/ic_print'
import { Icon } from "react-icons-kit";
import SweetAlert from 'react-bootstrap-sweetalert';
const API_URL = process.env.REACT_APP_API_URL;
let stax=0;

export default class HotelOrderI extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            item_switch:false,
            item_status:'notavailable',
            item_id:0,
            alert_state_warning:false,
            alert_message:''
        }
    }

    async printBill()
    {
        this.setState({
            alert_message:'Please Contact Admin.!',
            alert_state_warning:true
        })
        
        // let data={
        //     bill_id:this.props.hotel_bill_id,
        //     table_number:this.props.room_no,
        //     employee:'',
        //     tax:this.props.hotel_tax,
        //     tax_amount:this.props.hotel_tax_amount,
        //     billing_amount:this.props.hotel_billing_amount,
        //     kot_list:this.props.kot_list,
        //     kot_id: this.props.kot_id,
        //     total_amount:this.props.total_amount,
        //     service_tax_amount:this.props.service_tax_amount,
        //     f_id:0,
        //     from:'room',
        //     food_concession:this.props.food_concession,
        //     liquor_concession:this.props.liquor_concession,
        //     food_concession_percent:this.props.food_concession_percent,
        //     liquor_concession_percent:this.props.liquor_concession_percent,
        //     service_tax_price:this.props.service_tax_price
        // }
        // await axios.post(API_URL+'/hms/kot/printOrder',{data});
    }

    render()
    {
        return(
            <tr >
                <td className="center">{this.props.slNo}</td>
                <td className="center">{moment(this.props.date_time).format('MMM Do YY')}</td>
                <td className="center">{this.props.kot_count}</td>
                <td className="center">{this.props.kot_id}</td>
                <td className="center">{this.props.room_no}</td>
                <td   className="center">{Math.round(this.props.total_amount)}</td>
                <td  className="center">
                    <button className="printOrder" onClick={this.printBill.bind(this)}> <Icon size={21} icon={ic_print} /></button>
                </td> 
                <SweetAlert
                        warning title={this.state.alert_message}
                        show={this.state.alert_state_warning}
                        onConfirm={() => {
                            this.setState({
                                alert_state_warning: false
                            })
                        }}
                    />
            </tr>
        )
    }
}
