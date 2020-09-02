import React, { Component } from "react";
import axios from 'axios'
import Header from "../Headers/Header";
import HCMenuContainer from '../Containers/HCMenuContainer';
import HCKOTContainer from './HCKOTContainer';
import { Grid, Row, Col } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import {RoomSocket} from './RoomSocket';

const API_URL = process.env.REACT_APP_API_URL;

export default class HomeItemSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tax: 0,
            service_tax: 0,
            itemName: [],
            price:[],
            id:[],
            itemQty:[],
            q_id:[],
            q_type:[],
            kotcount: 0,
            responses: [],
            hoteltoken:""
        }
    }

    componentWillMount()
    {
    }


    async handleItemSelect (itemname,itemnumber,price,q_id,q_type,itemQty)
    {
        let newItemName = this.state.itemName.concat(itemname);
        let newPrice = this.state.price.concat(price);
        let ids= this.state.id.concat(itemnumber);
        let quantity=this.state.itemQty.concat(itemQty);
        let qid=this.state.q_id.concat(q_id);
        let qtype=this.state.q_type.concat(q_type);

        await this.setState({
            itemName: newItemName,
            price:newPrice,
            id:ids,
            itemQty:quantity,
            q_id:qid,
            q_type:qtype
        });
    }

    async handleReduceItem(itemName,price,q_id,q_type,itemQty)
    {
        let itemNameArray = this.state.itemName;
        let priceArray=this.state.price;
        let quantity_array=this.state.itemQty;
        let quantity_id_array=this.state.q_id;
        let quantity_type_array=this.state.q_type;
        let newArray=[];
        let indexs;

        await itemNameArray.filter((list,index)=>{
            priceArray.filter((data,index1)=>{
                quantity_id_array.filter(item=>{
                    quantity_type_array.filter(i=>{
                        if(data==price && list==itemName && index===index1 && item==q_id && i==q_type)
                        {
                            indexs=index;
                        }
                    })
                })
            })
        })
    
        if (indexs > -1)
        {
            quantity_array.splice(indexs,1);
            itemNameArray.splice(indexs,1);
            priceArray.splice(indexs,1);
            quantity_id_array.splice(indexs,1);
        }
              
        this.setState({
            itemName: itemNameArray,
            price: priceArray,
            itemQty:quantity_array,
            q_id: quantity_id_array
        });
    }

    async handleClear(itemName,order_id)
    {
        this.getActiveKotList(order_id)
        this.getRoomInfo()
        let itemNameArray = [];
        let price=[];
        let ids=[];
        let quantity=[];
        this.setState({
            itemName: itemNameArray,
            price:price,
            id:ids,
            itemQty:quantity
        });
    }

    async handleRemoveItem(itemName,prices,q_id,q_type,itemQty)
    {
        let itemNameArray = this.state.itemName;
        let price=this.state.price;
        let ids=this.state.id;
        let quantity=this.state.itemQty;
        let quantity_id_array=this.state.q_id;
        let quantity_type_array=this.state.q_type;
        let newItemArray=[];
        let newPrice=[];
        let newQid=[];
        let newQtype=[];

        for(let i=0;i<itemNameArray.length;i++)
        {
            if(itemNameArray[i]!=itemName || quantity_id_array[i]!=q_id || prices!=price[i])
            {
                newItemArray.push(itemNameArray[i]);
                newPrice.push(price[i]);
                newQid.push(quantity_id_array[i]);
                newQtype.push(quantity_type_array[i])
            }
        }
    
        await this.setState({
            itemName: newItemArray,
            price:newPrice,
            id:ids,
            itemQty:quantity,
            tax:0,
            q_id:newQid,
            q_type:newQtype
        });
    }

    getRoomInfo = async() => {
        let roomid = this.props.location.state.room_id
        let roomno = this.props.location.state.room_no
        let roomauthtoken =   await axios.get(API_URL+'/hms/bDetails/get-guest-order-id-from-room/',{params:{rooms_id: roomid,room_no: roomno}});
    
        if(roomauthtoken.data.length>0) {
            this.setState({
                hoteltoken: roomauthtoken.data[0].hotel_auth_token
            })
        }
        if(this.state.hoteltoken!=="") {
            let resp= await axios.get(API_URL+'/hms/kot/get-guest-order-list/'+this.state.hoteltoken);

            await this.setState({
                responses: resp.data
            })
        
            if(resp.data.length>0) {
                await this.setState({
                order_id: resp.data[0].kot_data.order_id
                })
            }
        }
    }

    async get()
    {
        try
        {
            let f_id = 0
            const res = await axios.get(API_URL+'/hms/kot/tax/'+f_id);
            const {data}  = await res;
            if(data[0])
            {
                this.setState({
                    tax:data[0].item_tax,
                    service_tax:data[0].service_tax
                })
            }
        }
        catch(err)
        {
        }
    }

    async componentDidUpdate()
    {
        if(this.state.tax===0)
        {
            this.get();
        }
    }

    async componentDidMount()
    {
        await this.getRoomInfo()
        RoomSocket(async(err, message) => {
            await this.getRoomInfo()
            await this.getActiveKotList(this.state.order_id)
        })
        if(this.state.tax===0)
        {
            this.get();
        }
    }
 
    getActiveKotList = async(order_id) => {
        if(order_id!=="" && (typeof(order_id)!=='undefined')) {
            let resp1= await axios.get(API_URL+'/hms/kot/get-active-kot-list/'+order_id);
            await this.setState({
                kotcount: resp1.data[0].kot_count
            })
            this.handleStateReset(true);
        }
    }

    handleStateReset(status)
    {
        if(this.state.q_type.length>0  || 
            this.state.itemName.length>0  || 
            this.state.price.length>0  || 
            this.state.id.length>0 || 
            this.state.itemQty.length>0 || 
            this.state.q_id.length>0 
        )
        {
            this.setState({
            itemName: [],
            price:[],
            id:[],
            itemQty:[],
            q_id:[],
            q_type:[]
            });
        }
    }

    render() {
        let {room_id,room_no,bookingid} =  this.props.location.state
        return (
            <div className="App">
                <Grid fluid>
                    <Row className="headerRow">
                        <Header />
                    </Row>
                    <Row>
                        <Tabs />
                        <Col xs={11} className="tabContainer">
                            <div className="homeItemSelect">
                                <Row>
                                    <Col xs={8} className="menuContOuterDiv">
                                        <HCMenuContainer handleItemSelect={this.handleItemSelect.bind(this)}/>
                                    </Col>
                                    <Col xs={4} className="kotContOuterDiv">
                                        <HCKOTContainer 
                                            auth_token ={this.state.hoteltoken} 
                                            responsedata = {this.state.responses}
                                            orderid = {this.state.order_id}
                                            price={this.state.price}
                                            id={this.state.id}
                                            itemQty={this.state.itemQty}
                                            q_id={this.state.q_id}
                                            q_type={this.state.q_type}
                                            itemName={this.state.itemName} 
                                            roomid={room_id} 
                                            tax={this.state.tax} 
                                            room_no={room_no} 
                                            bookings_id={bookingid}
                                            kotcounts={this.state.kotcount}
                                            service_tax={this.state.service_tax}
                                            handleStateReset={this.handleStateReset.bind(this)}
                                            handleRemoveItem={this.handleRemoveItem.bind(this)}
                                            handleClear={this.handleClear.bind(this)}
                                            handleReduceItem={this.handleReduceItem.bind(this)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
