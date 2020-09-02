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
            bill_amount: 0,
            bill_date_time:"",
            order_id:0,
            alertMessage: false,
            resp_kotList:[{
                items:[]
            }]
        }
    }

    componentDidMount() {
    }

    componentDidUpdate()
    {
        let item_name=this.props.itemName;
        let item_price=this.props.price;
        let item_id=this.props.id;
        let q_id=this.props.q_id;
        p=this.props.price;
        let f=0;
        let allitems=[];

        for(var i=0;i<item_name.length;i++)
        {
            allitems.push({
                "item_name": item_name[i],
                "item_price": item_price[i],
                "id":item_id[i],
                "q_id":q_id[i]
            });
        }

        var temp = [];
        var newhh = [];
      
        for(var i=0;i<allitems.length;i++)
        {
            if(temp.indexOf(allitems[i].item_name+allitems[i].item_price) == -1)
            {
                temp.push(allitems[i].item_name+allitems[i].item_price);
                var _data = {};
                _data.it_id = allitems[i].id;
                _data.price = allitems[i].item_price;
                _data.q_id = allitems[i].q_id;
                _data.note = '';
                _data.quantity = 1;
                newhh.push(_data);
            }
            else
            {
                for(var j=0;j<newhh.length;j++)
                {
                    if(newhh[j].it_id === allitems[i].id && newhh[j].price === allitems[i].item_price )
                    {
                        var _x = parseInt(newhh[j].quantity) + 1;
                        newhh[j].quantity = _x;
                    }
                }
            }
        }

        items=newhh;
        let prices = [this.props.price];
        let sum = 0;
        let k=sum;

        for (var i = 0; i < prices[0].length; i++)
        {
          sum += prices[0][i]
        }

        if(sum!==this.state.total_price)
        {
            this.setState({
                total_price:sum
            })
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
        if(result.data.length>0) {
            try {
                if(items.length>0) {
                    const data  = {
                        itemArray:items,
                        token: this.props.authtoken
                    }

                    let result = await axios.post(API_URL+'/hms/kot/hotel-guest-order-details',data)
                    let order_id=  await result.data[0].order_id;

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
                        this.props.handleClear(this.props.itemName,this.state.order_id)
                    } 
                    else  {
                        this.setState({
                            alert_message:"Order Not Done..!",
                            alert_state_danger:true
                        })
                    }
                } 
                else  {
                    this.setState({
                        alert_message:"Please Select items..!",
                        alert_state_success:true,
                        alertMessage: true
                    })
                }
            }
            catch(error)
            {
                this.setState({
                alert_message:"Order Not Done..!",
                alert_state_warning:true
                })
            }
        }
    }

    async submitData(status) {
        try {
            let data_tax= {
                tax:this.props.tax,
                billstatus: status,
                token: this.props.authtoken,
                order_id: this.props.order_id
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
            this.props.handleClear(this.props.itemName,this.state.order_id)
        } 
        catch(e) {
            console.error(e)
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
            </div>
        );
    }
}

export default withRouter(KOTContFooter);
