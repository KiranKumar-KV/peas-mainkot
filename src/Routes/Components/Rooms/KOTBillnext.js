import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import KOTItemListNext from './KOTItemListNext'
import moment from 'moment-timezone';
import Timer from '../Timer'
let itemListArray = [];

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
                <KOTItemListNext handleCancelOrder={this.handleCancelOrder.bind(this)} order_time={k.order_time} auth_token ={this.props.auth_token} orderid = {this.props.orderid} service_tax={this.props.service_tax} item_accept={k.item_accept} kot_id={this.props.kot_id} tax={this.props.tax} item_status={k.item_status} kotitem_id={k.kotitem_id} itemId={k.item_id} itemName={k.item_name} itemQty={k.quantity} price={k.price} qtype={k.qtytype} q_id={k.q_id} bill_status={k.kot_bill_status} type_name={k.type_name} order_status={this.props.order_status} kitchen_status={this.props.kitchen_status} bill_status={this.props.bill_status} />
                );
        }
        return itemListArray;
    }

    render() {
        let otime = moment(this.props.items[0].order_time).format('YYYY-MM-DD HH:mm:ss');
        let ctime = moment().format('YYYY-MM-DD HH:mm:ss');
        return (
            <Panel >
                <Panel.Heading>
                    <Panel.Title toggle><div style={{ display: "flex" }}>

                        <div>

                            KOT Slip {this.props.index}
                        </div>

                        <div style={{paddingLeft:"12vw"}}>
                            <Timer ordertime={otime}/>
                           {/* {moment(ctime).diff(moment(otime), 'minutes') + ' ' + 'Mnt Ago'} */}
                           </div>
                    </div>
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