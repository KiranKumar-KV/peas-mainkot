import React, { Component } from "react";
import Header from "../Headers/Header";
import HCMenuContainer from "./HCMenuContainer";
import TOKOTContainer from "./TOKOTContainer";
import { Grid, Row, Col } from "react-bootstrap";
import axios from 'axios';
import Tabs from "../extra/Tabs";
import {connect} from 'react-redux';
const API_URL = process.env.REACT_APP_API_URL;
 class TakeoutItemSelect extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            itemName: [],
            price:[],
            id:[],
            itemQty:[],
            tax:0,
            q_id:[],
            q_type:[],
            f_id:0,
            floor_charge:0,
            service_tax:0,
            triger:false
        };
    }

    handleItemSelect() 
    {
        this.setState({
            triger:true
        })
    }

 
    async get()
    {
        try
        {
            let fid=0;
            const floor=await axios.get(API_URL+'/hms/kot/getFloor_id');
            await this.setState({
                f_id:floor.data[0].floor_id,
                floor_charge:floor.data[0].floor_charge
            })
            const res = await axios.get(API_URL+'/hms/kot/tax/'+floor.data[0].floor_id);
            const {data}  = await res;
            if(data[0])
            {
                this.setState({
                    tax:data[0].item_tax,
                    service_tax:data[0].service_tax
                })
            }
            else
            {
                this.setState({
                    tax:0,
                    service_tax:0
                })
            }
        }
        catch(err)
        {
            
        }
    }

    componentWillUpdate()
    {
        // if(this.state.tax===0)
        // {
        //     this.get();
        // }
    }

    async componentWillMount()
    {
        await this.get();
        await this.props.selectPass([]);
    }

    render() {
        return (
            <div className="App">
                <Grid fluid>
                    <Row className="headerRow">
                        <Header />
                    </Row>
                    <Row>
                        <Tabs />
                        <Col xs={11} className="tabContainer">
                            <div className="homeItemSelect">
                                <Row>
                                    <Col xs={8} className="menuContOuterDiv">
                                        <HCMenuContainer floor_charge={this.state.floor_charge} floor_id={this.state.f_id}
                                           handleItemSelect={this.handleItemSelect.bind(this)}
                                        />
                                    </Col>
                                    <Col xs={4} className="kotContOuterDiv">
                                        <TOKOTContainer
                                            tax={this.state.tax}
                                            service_tax={this.state.service_tax}
                                            q_id={this.state.q_id}
                                            q_type={this.state.q_type}
                                            order_from="Restaurant"
                                            order_to="Kitchen"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        selectPass:(itemsAll)=>{
            dispatch({type:'select',selectedItems:itemsAll})}
    }
}

export default connect(null,mapDispatchToProps)(TakeoutItemSelect)