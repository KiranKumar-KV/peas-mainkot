import React, { Component } from "react";
import KOTContHeader from "../Headers/KOTContHeader";
import KOTContFooter from "../Footers/KOTContFooter";
import KOTContBody from "../Body/KOTContBody";
import axios from 'axios';
import {kotAdd} from '../../../kotAdd';

const API_URL = process.env.REACT_APP_API_URL;

export default class HCKOTContainer extends Component 
{
    constructor()
    {
        super();
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
            data:false,
            current_table_status:'',
            table_status:'',
            new_state:'',
            order_id:0,
            itemsPrepared:true,
            customer_name:''
        }
    }
 
    async get()
    {
        await  this.setState({
            itemsPrepared:false
        })

        const resp= await axios.get(API_URL+'/hms/kot/kot_list/'+this.props.table_id);
       
        let newitems=[];
        let kotid=[];
        let price=0;
        if(resp.data[0])
        {
            this.setState({
                itemsPrepared:true

            })
           if(resp.data[0].kot_data.kot_list!==null)
           {
            await resp.data[0].kot_data.kot_list.map(items=>{
                items.items.map(item=>{
                    if(item.item_status!="Cancelled")
                    {
                        if(item.order_status!=='finish')
                        {
                              this.setState({
                                itemsPrepared:false
                                })
                        }
                    }
                })
            })

            await resp.data[0].kot_data.kot_list.map(items=>{
                kotid.push(items.kot_id)
                items.items.map(item=>{
                    newitems.push(item)
                    price=price+parseFloat(parseInt(item.quantity)*parseInt(item.price))
                })
            })
           }
           

            await this.setState({
                order_id:resp.data[0].kot_data.order_id
            })

          

            let items=resp.data[0].kot_data.kot_list;
            if(items.length > 0)
            { 
                items.map((item)=>{
                    item.items.map((kot)=>{
                        if(kot.customer_name != "" || kot.customer_name != null){
                            this.setState({
                                customer_name : kot.customer_name
                            })
                        }
                    })
                })
            }
            await this.setState({
                items:items,
                bill_id:resp.data[0].kot_data.bill_id,
                bill_date_time:resp.data[0].kot_data.date_time,
                printItems:newitems,
                kot_id_list:kotid,
                totalamount:price,
                table_status:resp.data[0].kot_data.table_status
            })
        }
        // await this.props.handleStateReset(true);
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

    async componentWillMount()
    {
        this.getPrice();
    }
    
    async componentDidMount()
    {
        kotAdd((err, message) => {
            try
            {
                if(message==='orderd'|| message.message==='orderd' || message.message==='ordered')
                {
                this.getPrice();
                }
            }
            catch(error)
            {

            }
        })
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

        }
    }

    tablepass(status)
    {
        this.setState({
            new_state:status
        })
        this.getPrice();
    }

    componentDidUpdate()
    {
      if(this.state.new_state.length>0 && this.state.table_status!=this.state.new_state)
        { 
            this.setState({
                table_status:this.state.new_state
            })
        }
    }
    handleSwapTableNew(table_id){
        this.props.handleSwapTableNew(table_id);
    }
    handleItemSelect(status)
    {
        this.props.handleItemSelect(status);
    }
 
    render() {
        console.log("this",this.state)
         console.log("props",this.props)
        return (
            <div className="kotContainer">
                <KOTContHeader 
                    split_series={this.props.split_series} 
                    table_number={this.props.table_number}
                    table_id={this.props.table_id}
                    f_id = {this.props.f_id}
                    order_id = {this.state.order_id}
                    table_status = {this.state.table_status}
                    disAddButton={this.state.addBtnState}
                    handleSwapTableNew = {this.handleSwapTableNew.bind(this)}
                    customer_name = {this.state.customer_name}
                />
                <KOTContBody  
                    t_status={this.state.current_table_status}  
                    handleCancelOrder={this.handleCancelOrder.bind(this)} 
                    items={this.state.items} 
                    table_status={this.state.table_status} 
                    tax={this.props.tax} 
                    service_tax={this.props.service_tax}
                    table_id={this.props.table_id} 
                    emp_id={this.props.emp_id} 
                    handleItemSelect={this.handleItemSelect.bind(this)}
                />
                <KOTContFooter 
                    tablepass={this.tablepass.bind(this)} 
                    totalamount={parseFloat(this.state.totalamount)} 
                    kot_id_list={this.state.kot_id_list} 
                    bill_id={this.state.bill_id} 
                    bill_date_time={this.state.bill_date_time} 
                    q_id={this.props.q_id} 
                    printItems={this.state.printItems} 
                    itemsPrepared={this.state.itemsPrepared}
                    room_with_name={this.props.room_with_name} 
                    floor_name={this.props.floor_name} 
                    table_status={this.state.table_status}
                    table_split={this.props.table_split}
                    table_number={this.props.table_number} 
                    total_price={this.state.total_price} 
                    order_from={this.props.order_from} 
                    order_to={this.props.order_to} 
                    tax={this.props.tax} 
                    service_tax={this.props.service_tax}
                    table_id={this.props.table_id} 
                    emp_id={this.props.emp_id} 
                    order_id={this.state.order_id} 
                    type={this.props.type}
                    floor_id = {this.props.f_id}
                />
            </div>
        );
    }
}