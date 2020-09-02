import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";

export default class KOTCancelledList extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            item_id:'',
            item_price:'',
            quantity:'',
            kot_itemid:''
        }
    }

    componentWillMount()
    {
        this.setState({
            item_id:this.props.item_id,
            item_price:this.props.itemName,
            quantity:this.props.itemQty,
            kot_itemid:this.props.kotitem_id
        })
    }

    render()
    {
        return (
            <li className="KOTItem">
                <div className="KOTItemName">
                    <span>{this.props.itemQty}</span>
                    <span> x {this.props.itemName}</span>
                </div>
                <div >
                    <span>{(this.props.price*this.props.itemQty)+(((this.props.price*this.props.itemQty)*this.props.tax)/100)}</span>
                </div>
            </li>
        );
    }
}
