import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import { Icon } from "react-icons-kit";
import { close } from 'react-icons-kit/fa/close'
import { share } from 'react-icons-kit/fa/share'
import { plusCircle } from 'react-icons-kit/fa/plusCircle';
import { minusCircle } from 'react-icons-kit/fa/minusCircle';
import { FormControl } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

let itemsPrepared = false;

export default class KOTItemListNext extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item_id: '',
            item_price: '',
            quantity: '',
            kot_itemid: '',
            itemsPrepared: false,
            dropdown: "hide",
            itemCount: 0,
            reason: "",
            alert_message:'',
            alert_state_warning:false
        }
    }

    componentWillMount() {
        this.setState({
            item_id: this.props.item_id,
            item_price: this.props.itemName,
            quantity: this.props.itemQty,
            kot_itemid: this.props.kotitem_id
        })
    }

    handleCancelOrder() {
        let data = {
            item_id: this.props.itemId,
            item_price: this.props.price,
            quantity: this.props.itemQty - 1,
            kot_itemid: this.props.kotitem_id,
            kot_id: this.props.kot_id,
            q_id: this.props.q_id,
            option: 'cancel',
            item_return:false,
            return_reason:'',
            return_diff:0
        }
        this.props.handleCancelOrder(data);
    }
    handleReturnButton = () => {
        let dropdown = this.state.dropdown === "hide" ? "show" : "hide";
        this.setState({ dropdown });
    }
    getDropdownClass() {
        return this.state.dropdown === "hide" ? " hide" : "";
    }

    handleDeleteOrder() {
        let data = {
            item_id: this.props.itemId,
            item_price: this.props.price,
            quantity: this.props.itemQty,
            kot_itemid: this.props.kotitem_id,
            kot_id: this.props.kot_id,
            q_id: this.props.q_id,
            option: 'delete',
            item_return:false,
            return_reason:'',
            return_diff:0
        }
        this.props.handleCancelOrder(data);
    }

    addOptions() 
    {
        if (this.props.item_status === 'Cancelled') {
            return (
                <div className="KOTItemButton">
                    <label className="deleteicons">Cancelled</label>
                </div>
            )
        }
        else if(this.props.type_name !== 'Hotdrink' && this.props.table_status !== 'Billed' && !this.props.item_accept) {
            return (
                <div className="KOTItemButton">
                    <span onClick={this.handleCancelOrder.bind(this)}>
                        <Glyphicon glyph="minus-sign" />
                    </span>
                    <span style={{color:"red",paddingLeft:"20px"}} onClick={this.handleDeleteOrder.bind(this)}>
                        <Glyphicon glyph="trash" />
                    </span>
                </div>
            )
        }
        else if(this.props.type_name === 'Hotdrink' &&  this.props.table_status !== 'Billed' && !this.props.item_accept) {
            return (
                <div className="KOTItemButton">
                    <span onClick={this.handleCancelOrder.bind(this)}>
                        <Glyphicon glyph="minus-sign" />
                    </span>
                    <span style={{color:"red",paddingLeft:"20px"}} onClick={this.handleDeleteOrder.bind(this)}/*onClick={this.handleRemoveItem.bind(this,this.props.itemName,this.props.itemQty)}*/>
                        <Glyphicon glyph="trash" />
                    </span>
                </div>
            )
        }
        else {
            if(this.props.item_accept)
            {
            return (
                <div className="KOTItemButtonReturn"  >
                    <span className="return-button" >
                        {this.state.dropdown === "hide" ? <Icon icon={share} tabIndex={"0"} onClick={this.handleReturnButton} /> : <Icon icon={close} tabIndex={"0"} onClick={this.handleReturnButton} />}
                        <div className={"div-dropdown" + this.getDropdownClass()}>
                            {this.renderMinus()}
                            {this.state.itemCount}
                            {this.renderPlus()}
                            <span style={{ marginLeft: "10px" }}>
                                {this.props.itemName}
                            </span>
                            <textarea id="reason" value={this.state.reason} onChange={this.handleTextAreaChange.bind(this)} />

                            <button className="subBtn btn btn-success" onClick={this.submitReturn.bind(this)}>Cancel</button>
                        </div>
                    </span>

                </div>
            )
            }
        }
    }
    async submitReturn()
    {
        let data=[];
        if(this.state.reason.length>0)
        {
            if(this.state.itemCount===this.props.itemQty)
            {
                 data = {
                    item_id: this.props.itemId,
                    item_price: this.props.price,
                    quantity: this.props.itemQty,
                    kot_itemid: this.props.kotitem_id,
                    kot_id: this.props.kot_id,
                    q_id: this.props.q_id,
                    option: 'delete',
                    item_return:true,
                    return_reason:this.state.reason,
                    return_diff:this.state.itemCount
                } 
               await this.props.handleCancelOrder(data);
               await this.setState({
                   itemCount:0,
                   dropdown:"hide",
                   reason:''
               })
            }
            else
            {
                 data = {
                    item_id: this.props.itemId,
                    item_price: this.props.price,
                    quantity: this.props.itemQty-this.state.itemCount,
                    kot_itemid: this.props.kotitem_id,
                    kot_id: this.props.kot_id,
                    q_id: this.props.q_id,
                    option: 'cancel',
                    item_return:true,
                    return_reason:this.state.reason,
                    return_diff:this.state.itemCount
                }
               await this.props.handleCancelOrder(data);
               await this.setState({
                itemCount:0,
                dropdown:"hide",
                reason:''
            })
            }
        }
        else
        {
            this.setState({
                alert_message:"Please Enter Cancel Reason.!",
                alert_state_warning:true
            })
        }
        
    }

    handleTextAreaChange(e) {
            if(e.target.value.length<=200)
            {
                this.setState({
                    reason:e.target.value
                })
            }
    }
    renderMinus() {
        if (this.props.itemQty > 1) {
            return (
                <Icon icon={minusCircle} onClick={this.returnActionMinus.bind(this)} className="returnButtonMinus" />
            )
        }
    }
    renderPlus() {
        if (this.props.itemQty > 1) {
            return (
                <Icon icon={plusCircle} onClick={this.returnActionPlus.bind(this)} className="returnButtonPlus" />
            )
        }
    }
    returnActionPlus() {
        if (this.state.itemCount < this.props.itemQty) {
            this.setState({
                itemCount: this.state.itemCount + 1
            })
        }
    }
    returnActionMinus() {
        if (this.state.itemCount > 1) {
            this.setState({
                itemCount: this.state.itemCount - 1
            })
        }
    }


    componentWillReceiveProps() {
        if (this.props.itemQty !== this.state.itemCount) {
            this.setState({
                itemCount: this.props.itemQty
            })
        }
    }

    render() {
        return (
            <li className="KOTItem">
                <div className="KOTItemName">
                    <span>{this.props.itemQty}</span>
                    <span style={{fontSize:"14px"}}> x {this.props.itemName}-{this.props.qtype}</span>
                </div>
                <div className="KOTprice">
        <span style={{fontSize:"14px"}}>{(this.props.price * this.props.itemQty) /*+ (((this.props.price * this.props.itemQty) * this.props.tax) / 100)*/}</span>
                </div>
                <SweetAlert
                        warning title={this.state.alert_message}
                        show={this.state.alert_state_warning}
                        onConfirm={() => {
                            this.setState({
                                alert_state_warning: false
                            })
                        }}
                    />
                {
                    this.addOptions()
                }
            </li>
        );
    }
}
