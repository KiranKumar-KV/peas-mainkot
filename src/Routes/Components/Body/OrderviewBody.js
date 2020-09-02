import React, { Component } from "react";
import {Table} from "react-bootstrap";
import axios from 'axios';
import OrderViewHeader from "../Headers/OrderViewHeader";
import OrderMenuHeader from "../Headers/OrderMenuHeader";
import OrderItemList from "../list/OrderItemList";
import  SweetAlert from 'react-bootstrap-sweetalert';
import {Tab,Tabs}from 'react-bootstrap';
import OrderHotelHeader from "../Headers/OrderHotelHeader";
import HotelOrderItem from "../list/HotelOrderItem";

const API_URL = process.env.REACT_APP_API_URL;

export default class OrderviewBody extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            orders:[],
            old_orders:[],
            alert_message:'',
            alert_state_danger:false,
            hotelRepo: []
        }
    }

    async componentWillMount()
    {
        try
        {
            const resp = await axios.get(API_URL+'/hms/kot/getAllOrders');
            const hoteldata = await axios.get(API_URL+'/hms/kot/hotel-kot-order-data');
            const { data } = await resp;
            this.setState({
                orders:data,
                old_orders:data,
                hotelRepo: hoteldata.data,
            })
        }
        catch(error)
        {
        }
    }

    handleSearch(e)
    {
    }
    
     handleFilter(eventKey)
    {
        let itemall = this.state.old_orders.filter(function(data)
        {
            if(eventKey==='All')
            {
                return data
            }
            else
            {
                return data.table_number==='Tw';
            }
        });
        this.setState({
            orders:itemall
        })
    }
  
    render()
    {
        return (
            <div>
                <Tabs
                id="controlled-tab-example"
                activeKey={this.state.key}
                onSelect={key => this.setState({ key })}
                >
                    <Tab eventKey="restaurant" title="Restaurant">
                        <OrderMenuHeader 
                            handleSearch={this.handleSearch.bind(this)} 
                            handleFilter={this.handleFilter.bind(this)} 
                        />
                        <div className="foodmenuBody">
                            <Table className="foodmenuTable">
                                <OrderViewHeader />
                                <SweetAlert 
                                    danger title={this.state.alert_message} show={this.state.alert_state_danger} onConfirm={()=>{
                                    this.setState({
                                    alert_state_danger:false
                                    })
                                    }}
                                />
                                <tbody>
                                {
                                    this.state.orders.map((order,index)=>{              
                                        if(order.kot_list!==null)
                                        {
                                            return <OrderItemList
                                                slNo={index+1}
                                                date_time={order.date_time}
                                                kot_list={order.kot_list}
                                                table_number={order.table_number}
                                                total_amount={order.total_amount}
                                                f_id={order.f_id}
                                                service_tax_amount={order.service_tax_amount}
                                                employee_name={order.employee_name}
                                                billing_id={order.billing_id}
                                                tax={order.tax}
                                                tax_amount={order.tax_amount}
                                                billing_amount={order.billing_amount}
                                                food_concession={order.food_concession}
                                                liquor_concession={order.liquor_concession}
                                                food_concession_percent={order.food_concession_percent}
                                                liquor_concession_percent={order.liquor_concession_percent}
                                                service_tax_price={order.service_tax_price}
                                            />
                                        }
                                    })
                                }
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    { <Tab eventKey="hotel" title="Hotel">
                        <div className="foodmenuBody" style={{height:'80vh'}}>
                            <Table className="foodmenuTable">
                                <OrderHotelHeader />
                                <tbody>
                                {
                                    this.state.hotelRepo.map((item,index) => {
                                        if(item) {
                                            let res =item.auth_token.split("@")
                                            let room_no = res[res.length-1]
                                            return <HotelOrderItem
                                                slNo={index+1}
                                                date_time={item.created_date}
                                                kot_id={item.kot_id}
                                                kot_count={item.kotcount}
                                                total_amount={item.total_amount}
                                                room_no={room_no}
                                                hotel_bill_id={item.billing_id}
                                                hotel_tax={item.tax}
                                                hotel_tax_amount={item.tax_amount}
                                                hotel_billing_amount={item.billing_amount}
                                                service_tax_amount={item.service_tax_amount}
                                                food_concession={item.food_concession}
                                                liquor_concession={item.liquor_concession}
                                                food_concession_percent={item.food_concession_percent}
                                                liquor_concession_percent={item.liquor_concession_percent}
                                                service_tax_price={item.service_tax_price}
                                            />
                                        }
                                    })
                                }
                                </tbody>
                            </Table>
                        </div>
                    </Tab> }
                </Tabs>
            </div>
        );
    }
}
