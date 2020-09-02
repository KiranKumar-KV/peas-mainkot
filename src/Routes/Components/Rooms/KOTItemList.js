import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import {connect} from 'react-redux';
 class KOTItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qty: 0,
            dropdown: "hide",
            note:''
        }
    }
   async handleRemoveItem(itemName, price,q_id, q_type, itemQty,itemId) 
    {
      await   this.props.selectedItems.filter((item,index)=>{
            if(item.item_name==itemName && item.item_price==price && item.id==itemId && item.q_id==q_id)
            {
                this.props.selectedItems.splice(index,1)
            }
        })
       await  this.props.selectPass(this.props.selectedItems);
       await this.props.handleRemoveItem(this.props.selectedItems);
    }

    async handleReduceItem(itemName, price, q_id, q_type, itemQty,itemId) 
    {
       await  this.props.selectedItems.filter((item,index)=>{
            if(item.item_name==itemName && item.item_price==price && item.id==itemId && item.q_id==q_id)
            {
                if(item.quantity==1)
                {
                    this.props.selectedItems.splice(index,1)
                }
                else
                {
                    item.quantity=item.quantity-1
                }
            }
        })
       await  this.props.selectPass(this.props.selectedItems);

         await this.props.handleReduceItem(this.props.selectedItems);
    }

    getDropdownClass() {
        return this.state.dropdown === "hide" ? " hide" : "";
    }
    handleReturnButton = () => {
        let dropdown = this.state.dropdown === "hide" ? "show" : "hide";
        this.setState({ dropdown });

          this.props.selectedItems.filter((item,index)=>{
            if(item.item_name==this.props.itemName && item.item_price==this.props.price && item.id==this.props.item_id && item.q_id==this.props.q_id)
            {
                    item.note=this.state.note
            }
        })
    }

    handleTextAreaChange(e) 
    {
        if(e.target.value.length<=200)
        {
            this.setState({
                note:e.target.value
            })
        }
    }

    render() {
        return (
            <li className="KOTItem">
                <div className="KOTItemName">
                    <span>{this.props.itemQty}</span>
                    <span> x {this.props.itemName}-{this.props.q_type}</span>
                </div>
                <div style={{ textAlign: "left",width:"10%" }}>
        <span>{(this.props.price * this.props.itemQty) /*+ (((this.props.price * this.props.itemQty) * this.props.tax) / 100)*/}</span>
                </div>
                <div className="KOTItemButton">
                    <span onClick={this.handleReduceItem.bind(this, this.props.itemName, this.props.price, this.props.q_id, this.props.q_type, this.props.itemQty,this.props.item_id)}>
                        <Glyphicon glyph="minus-sign" />
                    </span>
                    <span onClick={this.handleRemoveItem.bind(this, this.props.itemName, this.props.price, this.props.q_id, this.props.q_type, this.props.itemQty,this.props.item_id)}>
                        <Glyphicon glyph="trash" />
                    </span>
                    <span>
                        <div>
                            <span className="return-button"  style={{color: "blue"}}>
                                {this.state.dropdown === "hide" ?
                                    <Glyphicon glyph="edit"  tabIndex={"0"} onClick={this.handleReturnButton}  /> :
                                    <Glyphicon glyph="remove" onClick={this.handleReturnButton} />
                                }
                                <div className={"div-dropdown" + this.getDropdownClass()}>
                                    <span style={{ marginLeft: "10px" }}>
                                        Note:
                                    </span>
                                    <textarea id="reason" value={this.state.note} onChange={this.handleTextAreaChange.bind(this)} />

                                    <button className="subBtn btn btn-primary" onClick={this.handleReturnButton}>Save</button>
                                </div>
                            </span>

                        </div>
                    </span>
                </div>
            </li>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        noteAll: state.noteAll,
        selectedItems:state.selectedItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        note: (note) => {
            dispatch({ type: 'note', note:note })
        },
        selectPass:(itemsAll)=>{
            dispatch({type:'select',selectedItems:itemsAll})}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(KOTItemList)