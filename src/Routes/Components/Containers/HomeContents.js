import React, { Component } from "react";
import HCBody from "../Body/HCBody";
import Header from "../Headers/Header";
import { Grid, Row, Col } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import {connect} from 'react-redux';
 class HomeContents extends Component {
     constructor(props)
     {
         super(props);
         this.state={
             type:''
         }
     }
    componentWillMount()
    {
        this.props.selectPass([]);
    }
    componentWillReceiveProps()
    {
        if(this.state.type!==this.props.type && this.props.type.length>0)
        {
                this.props.routePass(this.props.type);
        }
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
                            <div>
                                <HCBody type={this.props.type}/>
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
            dispatch({type:'select',selectedItems:itemsAll})
        },
        routePass:(data)=>{
            dispatch({type:'rtype',rtype:data})
        }
    }
}

export default connect(null,mapDispatchToProps)(HomeContents)