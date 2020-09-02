import React, { Component } from "react";
import HotelTables from "./HotelTables";
import { Grid,Col, Row } from "react-bootstrap";
import Header from '../Headers/Header';
import Tabs from '../extra/Tabs';
import axios from "axios";
import {kotAdd} from '../../../kotAdd'

const API_URL = process.env.REACT_APP_API_URL;

export default class HCBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bookingData: [],
            orderList: []
        }
    }

    async componentDidMount() {
        await kotAdd(async(err, message) => 
        {
            if(message==='orderd'|| message.message==='orderd' || message==='occupy')
            {
                let result1 = await axios.get(API_URL+'/hms/kot/get-active-kot-room-list');
                let result =   await axios.get(API_URL+'/hms/bDetails/get-all-occupied-rooms');
                this.setState({
                    bookingData: result.data,
                    orderList: result1.data
                })
            }
        })
    }

    async componentWillMount()
    {
        let result1 = await axios.get(API_URL+'/hms/kot/get-active-kot-room-list');
        let result =   await axios.get(API_URL+'/hms/bDetails/get-all-occupied-rooms');
        this.setState({
            bookingData: result.data,
            orderList: result1.data
        })
    }

    render() {
        const {bookingData} = this.state
        let count = 0
        return (
            <Grid fluid>
                <Row className="headerRow">
                    <Header />
                </Row>
                <Row>
                    <Tabs />
                    <Col xs={11} className="tabContainer">
                        <div>
                            <Row>
                            {
                                    bookingData.map((item) => {
                                        const listindex = this.state.orderList.findIndex(e => e.auth_token.split("@")[1] === item.room_num)
                                        listindex>=0 ?  count = this.state.orderList[listindex].count : count=0
                                        return <Col sm={3}><HotelTables items={item} count={count}/></Col>
                                    })
                            }
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}






