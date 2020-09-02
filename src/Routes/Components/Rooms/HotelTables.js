import React, { Component } from "react";
import { ticket } from "react-icons-kit/entypo/ticket";
import { Icon } from "react-icons-kit";
import { Panel } from "react-bootstrap";
import {Link} from 'react-router-dom';

class HotelTables extends Component {
    handleTableSelect(){
    }
    
    render() {
        const {booking_status,room_num,rooms_id,booking_id,customer_fname,customer_lname} = this.props.items
        return (
            <Link to={{pathname: '/roomitemselect',state:{room_id: rooms_id,room_no:room_num,bookingid: booking_id}}}  onClick={this.handleTableSelect.bind(this)}>
                <div>
                    <Panel>
                        <Panel.Body>
                            <div className="hotelTable">
                                <div className="tableHead">
                                    <div className="tableNum">
                                        <div className={"booking" + booking_status}>
                                            <h1  className={"roomStatus "+booking_status}>{room_num}</h1>
                                            <span className="grey"><Icon icon={ticket}/><span>{this.props.count}</span></span>
                                        </div>
                                    </div>
                                    <div className>
                                        <h4 style={{marginTop:"30px"}}>{customer_fname+" "+customer_lname}</h4>
                                        <div className="tableTime">
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </Panel.Body>
                    </Panel>
                </div>
            </Link>
        );
    }
}

export default HotelTables;
