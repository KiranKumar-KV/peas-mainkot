import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import ReactTooltip from 'react-tooltip';
import { NavLink } from "react-router-dom";

export default class Tab extends Component {
    render() {
        let className = "sidebarTab";
        return (
            <NavLink to={this.props.path}>
                <div className={className} data-tip data-for={this.props.name}>
                    <ReactTooltip id={this.props.name} type='info' effect='solid' place='right'>
                        <span style={{color:'white',fontWeight:'bold',fontVariant:'small-caps'}}>{this.props.name}</span>
                    </ReactTooltip>
                    <Icon size={21} icon={this.props.label}  />
                </div>
            </NavLink>
        );
    }
}
