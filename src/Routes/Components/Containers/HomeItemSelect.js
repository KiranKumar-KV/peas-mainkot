import React, { Component } from "react";
import Header from "../Headers/Header";
import HCMenuContainer from './HCMenuContainer';
import HCKOTContainer from './HCKOTContainer';
import { Grid, Row, Col } from "react-bootstrap";
import Tabs from "../extra/Tabs";
// import {browserHistory} from 'react-router'
import axios from 'axios';
import { connect } from 'react-redux';
import Axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
let a = 0;

class HomeItemSelect extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            itemName: [],
            price:[],
            id:[],
            itemQty:[],
            tax:0,
            table_id:0,
            emp_id:0,
            table_number:0,
            table_split:0,
            split_series:'',
            table_status:'',
            floor_name:'',
            room_with_name:[],
            q_id:[],
            q_type:[],
            f_id:0,
            service_tax:0,
            note:[],
            triger:false,
            floor_charge:0,
            type:''
        };
    }

    async componentWillMount()
    {
        const {table_id} = this.props.location.state
        const {emp_id} = this.props.location.state
        const {table_number}=this.props.location.state
        const {table_split}=this.props.location.state
        const {split_series}=this.props.location.state
        const {table_status}=this.props.location.state  
        const {floor_name}=this.props.location.state;
        const {room_with_name}=this.props.location.state;
        const {fid}=this.props.location.state;
        const {floor_charge}=this.props.location.state;
        const {type}=this.props.location.state;
       

        this.setState({
            table_id:table_id,
            emp_id:emp_id,
            table_number:table_number,
            table_split:table_split,
            split_series:split_series,
            table_status:table_status,
            floor_name:floor_name,
            room_with_name:room_with_name,
            f_id:fid,
            floor_charge:floor_charge,
            type:type
        })
        await this.get();
        await this.props.selectPass([]);
    }

    async get()
    {
        try
        {
            const res = await axios.get(API_URL+'/hms/kot/tax/'+this.state.f_id);
            const {data}  = await res;
            if(data[0])
            {
                this.setState({
                    tax:data[0].item_tax,
                    service_tax:data[0].service_tax
                })
            }

            const note_option=await axios.get(API_URL+'/hms/kot/getNote');
            if(note_option.data[0])
            {
                this.props.saveNote(note_option.data);
            }
        }
        catch(err)
        {
            
        }
    }

    // componentDidUpdate()
    // {
    //     if(this.state.tax===0)
    //     {
    //         this.get();
    //     }
    // }

    componentDidMount()
    {
        if(this.state.tax===0)
        {
            this.get();
        }
    }

   
    // handleTextAreaChange(note)
    // {
    //     let notes=this.state.note.concat(note);

    //      this.setState({
    //         note:notes
    //     });

    //     // this.props.handleTextAreaChange(note);
    // }
 handleItemSelect()
 {
    this.setState({
        triger:true
    })
 }

    async handleSwapTableNew(table_id){
        Axios.get(API_URL+'/hms/kot/getSwappedData/'+table_id)
        .then(async (response)=>{
            this.setState({
                table_id:response.data[0].table_id,
                emp_id:response.data[0].emp_id,
                table_number:response.data[0].table_number,
                table_split:response.data[0].table_split,
                split_series:response.data[0].split_series,
                table_status:response.data[0].table_status,
                floor_name:response.data[0].floor_name,
                f_id:response.data[0].fid,
                floor_charge:response.data[0].floor_charge,
            })
            await this.get();
             this.props.history.replace({
                pathname: '/itemselect',
                state: {
                    table_id:this.state.table_id,
                    emp_id:this.state.emp_id,
                    table_number:this.state.table_number,
                    table_split:this.state.table_split,
                    split_series:this.state.split_series,
                    table_status:this.state.table_status,
                    floor_name:this.state.floor_name,
                    room_with_name:this.state.room_with_name,
                    fid:this.state.f_id,
                    floor_charge:this.state.floor_charge,
                    type:this.state.type
                }
            });
            // await this.props.selectPass([]);
        })
    }


    render() {
        console.log("new props", this.props)
        const{itemArray,priceArray,idArray,quantityArray,qidArray,qtypeArray}=this.props
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
                                        <HCMenuContainer floor_charge={this.state.floor_charge} floor_id={this.state.f_id} handleItemSelect={this.handleItemSelect.bind(this)}/>
                                    </Col>
                                    <Col xs={4} className="kotContOuterDiv">
                                        <HCKOTContainer
                                            tax={this.state.tax}
                                            service_tax={this.state.service_tax}
                                            order_from="Restaurant"
                                            order_to="Kitchen"
                                            table_id={this.state.table_id}
                                            table_split={this.state.table_split}
                                            table_number={this.state.table_number}
                                            table_status={this.state.table_status} 
                                            split_series={this.state.split_series}
                                            room_with_name={this.state.room_with_name}
                                            floor_name={this.state.floor_name}
                                            emp_id={this.state.emp_id}
                                            f_id = {this.state.f_id}
                                            type={this.props.location.state.type}
                                            handleSwapTableNew = {this.handleSwapTableNew.bind(this)}
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
            dispatch({type:'select',selectedItems:itemsAll})},
        saveNote:(note)=>{
            dispatch({type:'note_save',note:note})
        }
    }
}

export default connect(null,mapDispatchToProps)(HomeItemSelect)