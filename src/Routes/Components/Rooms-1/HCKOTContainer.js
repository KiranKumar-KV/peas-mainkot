import React, { Component } from "react";
import KOTContHeader from "./KOTContHeader";
import KOTContFooter from "./KOTContFooter";
import KOTContBody from "./KOTContBody";
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default class HCKOTContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            slipCount : 1,
            addBtnState:true,
            items:[],
            total_price:0,
            printItems:[],
            bill_id:'',
            bill_date_time:'',
            kot_id_list:[],
            totalamount:0,
            hoteltoken: "",
            order_id :"",
            kotcount: 0
        }
    }
 
    handleRemoveItem(itemName,price,q_id,q_type,itemQty)
    {
        this.props.handleRemoveItem(itemName,price,q_id,q_type,itemQty);
    }

    handleClear(itemName,order_id)
    {
        this.props.handleClear(itemName,order_id);
    }

    handleReduceItem(itemName,price,q_id,q_type,itemQty)
    {
        this.props.handleReduceItem(itemName,price,q_id,q_type,itemQty);
    }

    async componentDidMount() {
        await this.get()
    }

    async get()
    {
        if(this.props.auth_token!=="") {
            let newitems=[];
            let kotid=[]
            let price=0;

            if(this.props.responsedata.length>0)
            {
                this.props.responsedata[0].kot_data.kot_list.map(items=>{
                    if(items) {
                        kotid.push(items.kot_id)
                        items.items.map(item=>{
                            newitems.push(item)
                            price=price+parseFloat(parseInt(item.quantity)*parseInt(item.price))
                        })
                    }
                })
                let items=this.props.responsedata[0].kot_data.kot_list;
                this.setState({
                    items:items,
                    printItems:newitems,
                    kot_id_list:kotid,
                    totalamount:price
                })
            }
        }
    }

    async getPrice()
    {
        await this.get();
        let total_price=0;
        await this.state.items.map((item)=>{
            item.items.map(l=>{
                if(l.item_status==='Cancelled')
                {
                    total_price=total_price+(0*l.quantity) 
                }
                else
                {
                    total_price=total_price+(l.price*l.quantity)
                }
            })
        })
        await this.setState({
            total_price:total_price
        })
    }

    async componentWillReceiveProps()
    {
        this.getPrice();
    }

    componentWillMount()
    {
        this.getPrice();
    }

    async handleCancelOrder(data)
    {
        try{
            let respo=await axios.put(API_URL+'/hms/kot/canceOrder/'+data.item_id,{data});
            this.get();
            this.getPrice();
        }
        catch(error)
        {
            alert("getting");
        }
    }

    render() {
        return (
            <div className="kotContainer">
                <KOTContHeader room_no={this.props.room_no}/>
                <KOTContBody 
                    handleCancelOrder={this.handleCancelOrder.bind(this)} 
                    items={this.state.items} 
                    itemName={this.props.itemName} 
                    price={this.props.price} 
                    id={this.props.id} 
                    q_id={this.props.q_id} 
                    q_type={this.props.q_type} 
                    tax={this.props.tax} 
                    room_no={this.props.room_no}   
                    handleRemoveItem={this.handleRemoveItem.bind(this)} 
                    handleReduceItem={this.handleReduceItem.bind(this)}  
                />
                <KOTContFooter 
                    kotcounts={this.props.kotcounts} 
                    order_id={this.props.orderid} 
                    tax={this.props.tax} 
                    room_no={this.props.room_no} 
                    authtoken={this.props.auth_token} 
                    room_id={this.props.roomid} 
                    bokingid={this.props.bookings_id} 
                    itemName={this.props.itemName} 
                    price={this.props.price} 
                    q_id={this.props.q_id} 
                    id={this.props.id} 
                    itemQty={this.props.itemQty} 
                    auth_token={this.state.hoteltoken} 
                    handleClear={this.handleClear.bind(this)} 
                />
            </div>
        );
    }
}
