import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import KOTItemListNext from '../list/KOTItemListNext';
import moment from 'moment-timezone';
import Timer from '../Timer';
let itemListArray = [];
let ctime = moment().tz('Asia/Kolkata').format("YYYY-MM-DD h:mm:ss a");

export default class KOTBillnext extends Component {
    handleRemoveItem(itemName, itemQty) {
        this.props.handleRemoveItem(itemName, itemQty);
    }

    handleReduceItem(itemName) {
        this.props.handleReduceItem(itemName);
    }

    handleCancelOrder(data) {
        this.props.handleCancelOrder(data);
    }

    addTOKOTItem() {
        itemListArray = [];
        let itemList = [];
        for (let i = 0; i < this.props.items.length; i++) {
            let k = this.props.items[i];
            itemListArray.push
                (
                    <KOTItemListNext t_status={this.props.t_status} table_status={this.props.table_status} handleCancelOrder={this.handleCancelOrder.bind(this)} type_name={k.type_name} sub_catname={k.sub_catname} item_accept={k.item_accept} order_status={k.order_status} kitchen_order_status={k.kitchen_order_status} kot_id={this.props.kot_id} tax={this.props.tax} item_status={k.item_status} kotitem_id={k.kotitem_id} itemId={k.item_id} itemName={k.item_name} itemQty={k.quantity} price={k.price} qtype={k.qtytype} q_id={k.q_id} />
                );
        }
        return itemListArray;
    }

    render() {
        let otime = moment(this.props.items[0].order_time).format('YYYY-MM-DD HH:mm:ss');
        let ctime = moment(ctime).format('YYYY-MM-DD HH:mm:ss');
        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title toggle>
                      
                            <span>
                                KOT Slip {this.props.index}
                            </span>
                            <span className="toggle">
                                <Timer ordertime={otime}/>
                                {/* {moment(ctime).diff(moment(otime), 'minutes') + ' ' + 'Minute Ago'} */}
                            </span>
                        
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                    <ul className="KOTList">
                        {this.addTOKOTItem()}
                    </ul>
                </Panel.Body>
            </Panel>
        );
    }
}