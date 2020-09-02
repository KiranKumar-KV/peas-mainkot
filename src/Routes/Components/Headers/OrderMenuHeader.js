import React, { Component } from 'react';
import { Icon } from "react-icons-kit";
import { filter } from "react-icons-kit/fa/filter";
import {
    MenuItem,
    Form,
    FormGroup,
    FormControl,
    InputGroup,
    Glyphicon,
    ButtonToolbar,
    DropdownButton
  } from "react-bootstrap";

export default class OrderMenuHeader extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            search_item:'',
            filter_item:'All'
        }
        this.handleSearch.bind(this)
    }

    handleSearch(e) 
    {
        let value = e.target.value;
        this.setState({
            search_item:value
        })
        this.props.handleSearch(value);
    }

    handleFilter(eventKey)
    {
        this.props.handleFilter(eventKey);
        this.setState({
            filter_item:eventKey
        })
    }

    render() {
        return (
            <div className="menuHeader">
                <div className="menuHeaderLeft">
                    <div className="filterButton">
                        <ButtonToolbar>
                            <DropdownButton
                            bsStyle="default"
                            noCaret
                            id="dropdown-no-caret"
                            title={
                                <div>
                                    <Icon size={18} icon={filter} />
                                    <span> {this.state.filter_item} </span>
                                </div>
                            }
                            >
                                <MenuItem eventKey="All" onSelect={this.handleFilter.bind(this)}  >All</MenuItem>
                                <MenuItem eventKey="takeout" onSelect={this.handleFilter.bind(this)}>takeout</MenuItem>
                                {/* <MenuItem eventKey="hotel" onSelect={this.handleFilter.bind(this)}>hotel</MenuItem> */}
                            </DropdownButton>
                        </ButtonToolbar>
                    </div>
                </div>
            </div>
        )
    }
}
