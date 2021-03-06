import React, { Component } from "react";
import Header from "../Headers/Header";
import FoodMenuFooter from '../Footers/FoodMenuFooter';
import FoodMenuBody from '../Body/FoodMenuBody'
import { Grid, Row, Col, Table, Form,FormGroup,FormControl,InputGroup,Glyphicon } from "react-bootstrap";
import Tabs from "../extra/Tabs";

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
                                <FoodMenuBody/>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
