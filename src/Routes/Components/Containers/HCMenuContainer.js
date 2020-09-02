import React, { Component } from "react";
import MenuContBody from '../Body/MenuContBody';
import MenuContFooter from '../Footers/MenuContFooter';

export default class HCMenuContainer extends Component 
{
    handleItemSelect()
    {
        this.props.handleItemSelect();
    }
    
    render() {
        return (
            <div className="menuContainer">
                <MenuContBody floor_charge={this.props.floor_charge} floor_id={this.props.floor_id} handleItemSelect={this.handleItemSelect.bind(this)}/>
            </div>
        );
    }
}
