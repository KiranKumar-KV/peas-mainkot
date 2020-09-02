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
        await kotAdd(async(err, message) => {
            let result1 = await axios.get(API_URL+'/hms/kot/get-active-kot-room-list');
            let result =   await axios.get(API_URL+'/hms/bDetails/get-all-occupied-rooms');
            this.setState({
                bookingData: result.data,
                orderList: result1.data
            })
        })
    }

    render() {
        const {bookingData} = this.state
        let count = 0;

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
                                bookingData.map((item,index) => {
                                    if(this.state.orderList.length>index) {
                                    let res = this.state.orderList[index].auth_token.split("@")
                                    let room_no = res[res.length-1]
                                    if(room_no === item.room_num) {
                                        count = this.state.orderList[index].count
                                    } else {
                                        count =0
                                    }
                                    } else {
                                    count =0
                                    }
                                    return <Col sm={3}><HotelTables items={item} count={count}/></Col>
                                },0)
                            }
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}






