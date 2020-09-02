import React, { Component } from "react";
import { PanelGroup } from "react-bootstrap";
import KOTBill from "../bill/KOTBill";
import KOTBillnext from "../bill/KOTBillnext";
import KOTBillnextCancelled from "../bill/KOTBillnextCancelled";
import KOTItemList from "../list/KOTItemList";

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

    hanleBill(state)
    {
        this.props.hanleBill(state);
    }
    handleItemSelect()
    {
        this.props.handleItemSelect();
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
                        <KOTBill eventKey={""} 
                            key={"a"} 
                            tax={this.props.tax} 
                            service_tax={this.props.service_tax}
                            handleSelect={this.handleItemSelect.bind(this)}
                            handleRemoveItem={this.handleRemoveItem.bind(this)}
                            handleReduceItem={this.handleReduceItem.bind(this)}
                        />
                        { 
                            this.props.items.map((i,index)=>{
                                return(
                                    <KOTBillnext t_status={this.props.t_status}  
                                        handleCancelOrder={this.handleCancelOrder.bind(this)} 
                                        table_status={this.props.table_status} 
                                        tax={this.props.tax} 
                                        kot_id={i.kot_id} 
                                        items={i.items} 
                                        index={this.props.items.length-index}
                                    />
                                )
                            })
                        }
                    </PanelGroup>
                </div>
            </div>
        );
    }
}