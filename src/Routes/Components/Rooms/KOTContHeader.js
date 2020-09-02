import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/fa/plus";

export default class KOTContHeader extends Component {
    addKOTSlip(){
        this.props.addKOTSlip();
    }

    render() {
        return (
            <div className="kotContainerHeader">
                <div className="tableNumDiv">
                    <div>
                        <p>ROOM:{this.props.room_no}</p>
                    </div>
                </div>
            </div>
        );
    }
}
