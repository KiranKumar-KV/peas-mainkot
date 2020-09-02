import React, { Component } from "react";
import MenuItemList from "../list/MenuItemList";

export default class MenuBodyRow extends Component {
    handleItemSelect() 
    {
        this.props.handleItemSelect();
    }
  
    render() 
    {
        return (
            <div className="menuBodyRow">
                {
                    this.props.elements.map(element => {
                        let {price_list} = element;
                        for(var i = price_list.length-1;i >= 0;i--){
                             if(price_list[i].floor_id != this.props.floor_id){
                                price_list.splice(i,1)
                            }
                        }

                        if(price_list.length > 0){
                             return(
                            <MenuItemList
                                floor_id = {this.props.floor_id}
                                floor_charge={this.props.floor_charge}
                                itemnumber={element.itemnumber}
                                itt_id={element.itt_id}
                                counter_id={element.counter_id}
                                itemname={element.itemname}
                                itemcategory={element.itemmaincategory + " > " + element.itemsubcategory}
                                itemtype={element.itemtype}
                                price_list={price_list}
                                handleItemSelect={this.handleItemSelect.bind(this)}
                                itemsubcategory={element.itemsubcategory}
                            />
                        )
                        }
                       
                    })
                }
            </div>
        );
    }
}
