import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import KOTItemList from '../list/KOTItemList';
import {connect} from 'react-redux';
let itemListArray = [];

 class KOTBill extends Component 
{
  constructor(props)
  {
      super(props);
      this.state={
      }
  }
    handleRemoveItem(state)
    {
        this.props.selectPass(state);
        this.props.handleRemoveItem();
    }

    handleReduceItem(state)
    {
        this.props.selectPass(state);
        this.props.handleReduceItem();

    }
   
    addTOKOTItem()
    {
        itemListArray = [];
        this.props.selectedItems.map(item=>{
            itemListArray.push
            (
                <KOTItemList handleRemoveItem={this.handleRemoveItem.bind(this)} handleReduceItem={this.handleReduceItem.bind(this)}  tax={this.props.tax}  service_tax={this.props.service_tax} item_id={item.id} itemName={item.item_name} itemQty={item.quantity} price={item.item_price} q_id={item.q_id} q_type={item.q_type}  /**//>
            );
        })
        return itemListArray;
    }
    render() 
    {
        return (
            <Panel eventKey={this.props.eventKey}>
                <Panel.Heading>
                    <Panel.Title toggle>KOT Slip {this.props.eventKey}</Panel.Title>
                </Panel.Heading>
                <Panel.Body className="panelbodynew" >
                    <ul className="KOTList">
                        {this.addTOKOTItem()}
                    </ul>
                </Panel.Body>
            </Panel>
        );
    }
}


const mapStateToProps=(state)=>{
    return{
        selectedItems:state.selectedItems,
     }
  }

    const mapDispatchToProps=(dispatch)=>{
      return{
         selectPass:(itemsAll)=>{
            dispatch({type:'select',selectedItems:itemsAll})}
      }
    }


export default connect(mapStateToProps,mapDispatchToProps)(KOTBill)