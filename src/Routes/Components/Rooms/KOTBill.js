import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import KOTItemList from './KOTItemList';
import {connect} from 'react-redux';
let itemListArray = [];

class KOTBill extends Component 
 {
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
        // itemListArray = [];
        // let itemList = [];
        // let priceList=[];

        // for(let i = 0; i < this.props.itemName.length; i++)
        // {
        //     let count = 0;
        //     for (let j = 0; j < this.props.itemName.length; j++)
        //     {
        //         if(this.props.itemName[j] == this.props.itemName[i] && this.props.price[j]==this.props.price[i] && this.props.q_id[j]==this.props.q_id[i])
        //         {
        //             count++;
        //         }
        //     }
        //     if(!itemList.includes(this.props.itemName[i]+this.props.price[i]))
        //     {
        //         itemList.push(this.props.itemName[i]+this.props.price[i]);
        //         itemListArray.push
        //         (
        //             <KOTItemList tax={this.props.tax} itemName={this.props.itemName[i]} itemQty={count} price={this.props.price[i]} q_id={this.props.q_id[i]} q_type={this.props.q_type[i]} handleRemoveItem={this.handleRemoveItem.bind(this)} handleReduceItem={this.handleReduceItem.bind(this)}/>
        //         );
        //     }
        // }
        // return itemListArray;

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