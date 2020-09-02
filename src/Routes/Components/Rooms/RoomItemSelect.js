import React, { Component } from "react";
import axios from 'axios'
import Header from "../Headers/Header";
import HCMenuContainer from '../Containers/HCMenuContainer';
import HCKOTContainer from './HCKOTContainer';
import { Grid, Row, Col } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import {RoomSocket} from './RoomSocket'
import {connect} from 'react-redux';
const API_URL = process.env.REACT_APP_API_URL;

class HomeItemSelect extends Component {
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
            hoteltoken:"",
            temp_tax:0,
            triger:false,
            f_id:0,
            floor_charge:0
        }
    }

    async componentWillMount()
    {
        await this.props.selectPass([]);
        await this.setFloor();
        await this.get();
    }

   async setFloor()
    {
        const floor=await axios.get(API_URL+'/hms/kot/getFloor_id_room');
        await this.setState({
            f_id:floor.data[0].floor_id,
            floor_charge:floor.data[0].floor_charge
        })
    }
    async handleItemSelect()
    {
       this.setState({
           triger:true
       })
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
            let f_id = 0;
            const res = await axios.get(API_URL+'/hms/kot/tax/'+this.state.f_id);
            const {data}  = await res;
            if(data[0])
            {
                this.setState({
                    tax:data[0].item_tax,
                    service_tax:data[0].service_tax,
                    temp_tax:data[0].item_tax
                })
            }
        }
        catch(err)
        {

        }
    }

    async componentDidUpdate()
    {
        if(this.state.temp_tax!==this.state.tax)
        {
            this.get();
        }
    }

    async componentDidMount()
    {
        await this.getRoomInfo();
        RoomSocket(async(err, message) => {
            await this.getRoomInfo()
            await this.getActiveKotList(this.state.order_id)
        })
    }
 
    getActiveKotList = async(order_id) => {
        if(order_id!=="" && (typeof(order_id)!=='undefined')) {
            let resp1= await axios.get(API_URL+'/hms/kot/get-active-kot-list/'+order_id);
            await this.setState({
                kotcount: resp1.data[0].kot_count
            })
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
                                        <HCMenuContainer floor_charge={this.state.floor_charge} floor_id={this.state.f_id} handleItemSelect={this.handleItemSelect.bind(this)}/>
                                    </Col>
                                    <Col xs={4} className="kotContOuterDiv">
                                        <HCKOTContainer 
                                        auth_token ={this.state.hoteltoken} 
                                        responsedata = {this.state.responses}
                                        orderid = {this.state.order_id}
                                        roomid={room_id}
                                        tax={this.state.tax} 
                                        room_no={room_no} 
                                        bookings_id={bookingid}
                                        kotcounts={this.state.kotcount}
                                        service_tax={this.state.service_tax}
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

const mapDispatchToProps = (dispatch) => {
    return {
        selectPass:(itemsAll)=>{
            dispatch({type:'select',selectedItems:itemsAll})}
    }
}

export default connect(null,mapDispatchToProps)(HomeItemSelect)