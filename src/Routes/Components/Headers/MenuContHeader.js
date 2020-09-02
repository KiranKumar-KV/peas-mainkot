import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import { filter } from "react-icons-kit/fa/filter";
import { close } from "react-icons-kit/fa/close";
import axios from 'axios';


import {
  Form,
  FormGroup,
  FormControl,
  InputGroup,
  Glyphicon,
  ButtonToolbar,
  DropdownButton,
  MenuItem,Row,Col
} from "react-bootstrap";
const API_URL=process.env.REACT_APP_API_URL;
export default class MenuContHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_item: "",
      filter_item: "All",
      dropdown: "hide",
      fiterDataItem:[]
    };
    this.handleSearch.bind(this);
  }
  componentWillMount(){
      console.log("component will mount")
    document.addEventListener("click",this.handleReturnButton,false)
  
  }
  async getSubCategory(){
        axios.get(API_URL+'/hms/waiter/get-sub-cat-menu')
        .then((response)=>{
            console.log(response)
            this.setState({
                fiterDataItem  : response.data
            })
        })
    }
  componentWillMount(){
    document.removeEventListener("click",this.handleReturnButton,false)
  }
  componentDidMount(){
    this.getSubCategory();
  }
  handleSearch(e) {
    let value = e.target.value;
    this.setState({
      search_item: value
    });
    this.props.handleSearch(value, this.state.filter_item);
  }

  handleFilter(eventKey) {
    this.props.handleFilter(eventKey.target.id);
    this.setState({
      filter_item: eventKey.target.id
    });
  }
  getDropdownClass() {
    return this.state.dropdown === "hide" ? " hide" : "";
  }
  handleReturnButton = (e) => {


      let dropdown = this.state.dropdown === "hide" ? "show" : "hide";
      this.setState({ dropdown });
    
    // this.handleOut();
  };
  render() {
    return (
      <div className="menuHeader">
        <div className="menuHeaderLeft">
          <div className="filterButton">
            <ButtonToolbar>
              <button
                
                // onFocus={this.filterSelect.bind(this)}
                // onClick={this.filterSelect.bind(this)}
                onClick={this.handleReturnButton}
                className={"button-dropdown"}
              >
                <div>
                  {this.state.dropdown === "show" ? <Icon size={18} icon={close} />
                   : <div><Icon size={18} icon={filter} /><span> {this.state.filter_item} </span></div>}
                </div>
                <div className={`div-dropdown` + this.getDropdownClass()}>
                    <Row>
                        <Col xs={3} id="All" eventKey="All" onClick={this.handleFilter.bind(this)}>
                            All
                        </Col>
                        {this.state.fiterDataItem.length >0 && 
                            this.state.fiterDataItem.map((filterdata)=>{
                                // console.log(filterdata)
                                return(
                                    <Col xs={3} id={filterdata.sub_catname} eventKey={filterdata.sub_catname} onClick={this.handleFilter.bind(this)}>
                                        {filterdata.sub_catname}
                                    </Col>
                                )
                            })
                        }
                    </Row>
                  {/* <div style={{ width: "33.33%" }}>
                    <li
                      id="All"
                      //   onClick={this.handleClick}
                      eventKey="All"
                      onClick={this.handleFilter.bind(this)}
                    >
                      All
                    </li>
                    <li
                      eventKey="Soups"
                      id="Soups"
                      onClick={this.handleFilter.bind(this)}
                    >
                      Soups
                    </li>

                      <li
                      eventKey="ShortEat"
                      id="ShortEat"
                      onClick={this.handleFilter.bind(this)}
                    >
                      ShortEat
                    </li>
                    <li
                      eventKey="Sea Food Delicacies"
                      id="Sea Food Delicacies"
                      onClick={this.handleFilter.bind(this)}
                    >
                      Sea Food Delicacies
                    </li>

                    <li
                      eventKey="Coastal Delicious"
                      id="Coastal Delicious"
                      onClick={this.handleFilter.bind(this)}
                    >
                     Coastal Delicious
                    </li>

                 
                  
                  </div>
                  <div style={{ width: "33.33%" }}>
                  <li
                      eventKey="Tandoor Aur Kebabs"
                      id="Tandoor Aur Kebabs"
                      onClick={this.handleFilter.bind(this)}
                    >
                     Tandoor Aur Kebabs
                    </li>

                     <li
                      eventKey="Tandoor Ki Rotis"
                      id="Tandoor Ki Rotis"
                      onClick={this.handleFilter.bind(this)}
                    >
                     Tandoor Ki Rotis
                    </li>
                    <li
                      eventKey="Indian Main Course"
                      id="Indian Main Course"
                      onClick={this.handleFilter.bind(this)}
                    >
                     Indian Main Course
                    </li>

                    <li
                      eventKey="International Cuisine"
                      id="International Cuisine"
                      onClick={this.handleFilter.bind(this)}
                    >
                    International Cuisine
                    </li>
                   
                  </div>

                  <div style={{ width: "33.33%" }}>
                  <li
                      eventKey="Desserts"
                      id="Desserts"
                      onClick={this.handleFilter.bind(this)}
                    >
                        Desserts
                    </li>
                    <li
                      eventKey="Thandai"
                      id="Thandai"
                      onClick={this.handleFilter.bind(this)}
                    >
                        Thandai
                    </li>

                     <li
                      eventKey="Hotdrink"
                      id="Hotdrink"
                      onClick={this.handleFilter.bind(this)}
                    >
                        Hotdrink
                    </li>
                     <li
                      eventKey="Beverages"
                      id="Beverages"
                      onClick={this.handleFilter.bind(this)}
                    >
                        Beverages
                    </li>
                    <li
                      eventKey="Extra"
                      id="Extra"
                      onClick={this.handleFilter.bind(this)}
                    >
                        Extra
                    </li>
                  </div> */}
                </div>
                {/* <MenuItem eventKey="Nonveg" onSelect={this.handleFilter.bind(this)}>Nonveg</MenuItem>
                                <MenuItem eventKey="Hotdrink" onSelect={this.handleFilter.bind(this)}>Hotdrink</MenuItem> */}
              </button>
            </ButtonToolbar>
          </div>
        </div>
        <div className="menuHeaderRight">
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Search Item"
                maxLength="50"
                id="search_item"
                name="search_item"
                ref="search_item"
                value={this.state.search_item}
                onChange={this.handleSearch.bind(this)}
              />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </div>
      </div>
    );
  }
}
