import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/fa/plus";
import {Button,Modal,FormGroup,ControlLabel,FormControl,Row,Col} from 'react-bootstrap';
import Axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default class KOTContHeader extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            table_id:0,
             order_id :0,
            table_status: '',
            f_id :0,
            table_number:0,
            split_series:'',
            show:false,
            tables:{
                table_number:{value:'',valid:false}
            },
            swapTable:false
        }
    }

    componentWillReceiveProps()
    {
        let ss;
        if(this.props.split_series===null)
        {
            ss=''
        }
        else
        {
            ss="-"+this.props.split_series
        }
        this.setState({
            table_id :this.props.table_id,
            table_number:this.props.table_number,
            order_id :this.props.order_id,
            table_status: this.props.table_status,
            f_id :this.props.f_id,
            split_series:ss
        })
    }
    handleClear(){
        this.setState({
            tables:{
                table_number:{value:'',valid:false}
            }
        })
    }

    handleChange(e){
        let valid = this.state.tables[e.target.id].valid;
        let value = e.target.value;
        switch(e.target.id){
            case 'table_number' :
                if(value.length >0){
                    valid = true;
                }
                else{
                    valid = false;
                }
            break;
        }

        let newstate = this.state.tables[e.target.id];
        newstate.value = value;
        newstate.valid = valid;
        this.setState({
            newstate
        })
    }

    handleSwapTable(){
        let data = {
            old_table_id : this.state.table_id,
            order_id : this.state.order_id,
            new_table_id : this.state.tables.table_number.value,
            old_table_status : this.state.table_status,
        }
        Axios.put(API_URL+'/hms/kot/swapTable',{data})
        .then((response)=>{
            this.setState({
                show:false,
                swapTable:true
            })
            this.handleClear()
             this.handleSwapTableNew(response.data[0].table_id); 
        })
        
    }

    handleSwapTableNew(table_id){
        if(this.state.swapTable === true){
            this.props.handleSwapTableNew(table_id);
        }
    }

    handleSwapModal(){
       
        this.setState({
            show:true
        })
        Axios.get(API_URL+'/hms/kot/getTablesForSwap/'+this.state.f_id)
        .then((response)=>{
            let i;
            let t;
            let selectTag = document.querySelector('#table_number');
             for(i=0;i<response.data.length;i++){
                this.option = document.createElement("option");
                this.option.value = response.data[i].table_id;
                if(response.data[i].split_series != null){
                    t = document.createTextNode(response.data[i].table_number+'-'+response.data[i].split_series);
                }
                else{
                    t = document.createTextNode(response.data[i].table_number);
                }
                
                this.option.appendChild(t);
                selectTag.appendChild(this.option);
            }   
        })
    }

    handleCloseNew(){
        this.setState({
            show:false
        })
    }
    
    render() {
        console.log("state",this.state)
        let formIsValid = true;
         for (const field in this.state.tables) {
            if (this.state.tables.hasOwnProperty(field))
            {
                formIsValid = formIsValid && this.state.tables[field].valid;
            }
        }

        return (
            <div className="kotContainerHeader">
                <div className="tableNumDiv">
                    <div>
                        <p>
                            <span style={{float:'left'}}>Table {this.state.table_number+this.state.split_series}</span>
                            { this.state.table_number != 'Tw' &&<span style={{float:'right',textDecoration:'underline',cursor:'pointer'}} onClick={this.handleSwapModal.bind(this)}>Swap</span>}
                            {this.state.table_number == 'Tw' && <span style={{float:"right"}}>{this.props.customer_name}</span>} 
                        </p>
                    </div>
                </div>
                 <Modal show={this.state.show} onHide={this.handleCloseNew.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Swap table</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <FormGroup validationState={this.state.tables.table_number.valid ? 'success': 'error'}>
                                    <ControlLabel>
                                        Select Table  <span className="text-danger">*</span>
                                    </ControlLabel>
                                    <FormControl
                                        componentClass="select"
                                        id="table_number"
                                        name="table_number"
                                        required
                                        value={this.state.tables.table_number.value}
                                        placeholder = "select Table"
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        <option value=''>Choose table</option>
                                    </FormControl>
                                    <FormControl.Feedback />
                                </FormGroup> 
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle='success' disabled={!formIsValid} onClick={this.handleSwapTable.bind(this)}>Change</Button>
                        <Button bsStyle='danger' onClick={this.handleCloseNew.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
