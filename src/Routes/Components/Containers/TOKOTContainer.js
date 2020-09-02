import React, { Component } from "react";
import TOKOTContHeader from "../Headers/TOKOTContHeader";
import TOKOTContFooter from "../Footers/TOKOTContFooter";
import TOKOTContBody from "../Body/TOKOTContBody";

export default class TOKOTContainer extends Component
{
    render()
    {
        return(
            <div className="kotContainer">
                <TOKOTContHeader />
                <TOKOTContBody q_id={this.props.q_id} q_type={this.props.q_type} itemName={this.props.itemName} price={this.props.price} id={this.props.id} tax={this.props.tax} />
                <TOKOTContFooter service_tax={this.props.service_tax} q_id={this.props.q_id} q_type={this.props.q_type} itemName={this.props.itemName} price={this.props.price} id={this.props.id} itemQty={this.props.itemQty} order_from={this.props.order_from} order_to={this.props.order_to} tax={this.props.tax} />
            </div>
        );
    }
}
