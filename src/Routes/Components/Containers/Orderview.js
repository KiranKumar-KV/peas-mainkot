import React, { Component } from "react";
import Header from "../Headers/Header";
import FoodMenuFooter from '../Footers/FoodMenuFooter';
import { Grid, Row, Col, Table, Form,FormGroup,FormControl,InputGroup,Glyphicon } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import OrderviewBody from "../Body/OrderviewBody";

export default class FoodMenu extends Component {
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
                            <div className="foodmenuOuterDiv">
                                <OrderviewBody/>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
