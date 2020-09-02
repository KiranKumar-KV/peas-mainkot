import React, { Component } from "react";
import { PanelGroup } from "react-bootstrap";
import KOTBill from "./KOTBill";
import KOTBillnext from "./KOTBillnext";
import KOTBillnextCancelled from "../bill/KOTBillnextCancelled";
import KOTItemList from "../list//KOTItemList";

export default class KOTContBody extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {
            activeKey: "1",
            t:false
        };
    }

    handleSelect(activeKey,orderStatus)
    {
        this.setState({ activeKey });
    }
    
    handleCancelOrder(data)
    {
        this.props.handleCancelOrder(data)
    }

    handleReduceItem()
    {
        this.setState({
            t:true
        })
    }

    handleRemoveItem()
    {
        this.setState({
            t:true
        })
    }
    
    render() {
        return (
            <div>
                <div className="kotContainerBody">
                    <PanelGroup
                        accordion
                        id="accordion-controlled"
                        className="kotList"
                        activeKey={this.state.activeKey}
                        onSelect={this.handleSelect}
                    >
                        <KOTBill 
                            eventKey={""}
                            key={"a"} 
                            tax={this.props.tax} 
                         
                            handleRemoveItem={this.handleRemoveItem.bind(this)} 
                            handleReduceItem={this.handleReduceItem.bind(this)}
                        />
                        { 
                            this.props.items.map((i,index)=>{
                                return(
                                    <KOTBillnext handleCancelOrder={this.handleCancelOrder.bind(this)} auth_token ={this.props.auth_token} orderid = {this.props.orderid} service_tax={this.props.service_tax} tax={this.props.tax} kot_id={i.kot_id} items={i.items} index={this.props.items.length-index} order_status={i.order_status} kitchen_status={i.kitchen_order_status} bill_status={i.kot_bill_status}/>
                                )
                            })
                        }
                    </PanelGroup>
                </div>
            </div>
        );
    }
}