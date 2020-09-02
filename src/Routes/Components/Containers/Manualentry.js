import React, { Component } from "react";
import Header from "../Headers/Header";
import { Grid, Row, Col,Panel,FormControl,FormGroup,Glyphicon,InputGroup} from "react-bootstrap";
import Tabs from "../extra/Tabs";
import axios from 'axios';
import  SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {kotAdd} from '../../../kotAdd'

const API_URL = process.env.REACT_APP_API_URL;
let data;

export default class AddMenuContainer extends Component {
    constructor(props,context)
    {
        super(props,context);
        this.state={
            data:[],
            endbottle:[],
            endml:0,
            alert_message:'',
            alert_state_warning:false,
            alert_state_success:false,
            items:[{
            }],
            itemsNew:{},
            search:'',
            propName:'',
        }
    }

    async handleSubmit(e)
    {
        let totalitem = 0;
        let totalquantity=0;
        let instock=e.original.instockbottle
        let id = e.original.instock_id;

        if(Object.keys(this.state.items).length >0)
        {
            if( this.state.items[e.original.id] == undefined ||this.state.itemsNew[e.original.indexvalue] == undefined){
                await this.setState({
                    alert_message:"information.!",
                    alert_state_warning:true,         
                })
            }
            else{
                totalitem =parseInt(this.state.items[e.original.id].value);
                totalquantity=parseInt(this.state.itemsNew[e.original.indexvalue].value);
                if(totalitem==NaN||isNaN(totalitem) ||totalquantity==NaN||isNaN(totalquantity))
                {
                    await this.setState({     
                        alert_message:"Taken value should be >0 and must be a Number!",
                        alert_state_warning:true,
                    })
                    this.get()
                }
                else
                {
                    if(totalitem>instock ){
                        await this.setState({     
                            alert_message:"item cannot  be greater  than instock",
                            alert_state_warning:true,
                        })
                    }
                    else if(totalitem==instock && totalquantity>e.original.instockml){
                        await this.setState({     
                            alert_message:"item cannot  be greater  than instock",
                            alert_state_warning:true,
                        })
                    }
                    else{
                        const datavalue={
                            "data": {
                                instock_id:id,
                                total_item:totalitem,
                                total_quantity:totalquantity
                            }
                        }
                        try{
                            let res= await axios.post(API_URL+'/hms/inventory/dailyentry',datavalue)
                            if(res.data.message=="done")
                            {
                                await this.setState({
                                    alert_message:"added.!",
                                    alert_state_success:true,
                                    value:''
                                })
                                await this.state.data.map(items=>{
                                    this.setState({
                                    [items.id]:'',
                                    [items.indexvalue]:''
                                    })
                                })
                                this.get()
                            }
                            else if(res.data.message=="updated")
                            {
                                await this.setState({
                                    alert_message:"updated!",
                                    alert_state_success:true,
                                })
                                await this.state.data.map(items=>{
                                    this.setState({
                                    [items.id]:'',
                                    [items.indexvalue]:''
                                    })
                                })
                                this.get()
                            }
                        }
                        catch(error){
                        }
                    }
                }
            }
        }
        else{
            await this.setState({
                alert_message:"Add Correct information.!",
                alert_state_warning:true,          
            })
        }   
    }

    async get()
    {
        let list=await axios.get(API_URL+'/hms/inventory/manualentrylist')
        let list1=await axios.get(API_URL+'/hms/inventory/endentry')
        await list.data.map(item=>{
            var index=list.data.indexOf(item);
            list.data[index].indexvalue=(index+"A").toString()
        })

        var res = list.data.filter(item1 => 
            !list1.data.some(item2 => (item2.item_id === item1.item_id && item2.qty_id === item1.qty_id))
        )
        await this.setState({
            data:res
        })
    }

    async componentWillMount()
    {
        await this.get();
        this.state.data.map(items=>{
            this.setState({
                [items.item_name]:'',
                [items.item_id]:''
            })
        })
   
    }

    componentDidMount()
    {
        kotAdd((err,message)=>{
            if(message==='revertaccess')
            {
                this.get();
                this.state.data.map(items=>{
                    this.setState({
                        [items.item_name]:'',
                        [items.item_id]:''
                    })
                })
            }
        })
    }

    render() {
        data = this.state.data;

        if (this.state.search) 
        {
            data = data.filter(row => {
                return row.item_name.toLowerCase().includes(this.state.search.toLowerCase()) 
            })
        }
        console.log(data);
       return (
            <div className="App">
                <SweetAlert 
                    warning title={this.state.alert_message} show={this.state.alert_state_warning} onConfirm={()=>{
                    this.setState({
                    alert_state_warning:false
                    })
                }}/>

                <SweetAlert 
                    success title={this.state.alert_message} show={this.state.alert_state_success} onConfirm={()=>{
                    this.setState({
                        alert_state_success:false
                    })
                }}/>

                <Grid fluid>
                    <Row className="headerRow">
                        <Header />
                    </Row>
                    <Row>
                        <Tabs />
                        <Col sm={11}>
                            <Panel.Body>
                                <div className="row" style={{height:'0px'}}>
                                    <div className="col-md-9"></div>
                                    <div className="col-md-3" >
                                       {/* <input 
                                        placeholder="Search..."
                                            value={this.state.search}
                                            onChange={e => this.setState({search: e.target.value})}
                                        /> */}
                                                  <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Search..."
                value={this.state.search}
                onChange={e => this.setState({search: e.target.value})}

                // onChange={this.handleSearch.bind(this)}
              />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:'35px',height:'0px'}}>
                                    <div className="col-lg-12">
                                        <ReactTable 
                                            data = {data}
                                            columns ={[{
                                                Header:'Daily Details',
                                                columns:[{
                                                    Header:'Item name',
                                                    id:'Item_name',
                                                    accessor:'item_name',
                                                    className:'cellAlign',
                                                },
                                                {
                                                    Header:'Item_qty',
                                                    id:"qty_name",
                                                    accessor:'qty_name',
                                                    className:'cellAlign',
                                                },
                                                {
                                                    Header:'In Stock',
                                                    id:"instockbottle",
                                                    accessor:'instockbottle',
                                                    className:'cellAlign',
                                                },
                                                {
                                                    Header:'Instock Ml',
                                                    id:"instockml",
                                                    accessor:'instockml',
                                                    className:'cellAlign',
                                                },
                                                {
                                                    Header:'Today Taken',
                                                    id:"todaytaken",
                                                    accessor:'todaytaken',
                                                    className:'cellAlign',
                                                },  
                                            ]
                                            },
                                            {
                                                Header:'Entry',
                                                columns:[
                                                    {
                                                    Header:'End Entry',
                                                    accessor:'id',
                                                    className:'cellAlign',
                                                    filterable:false,
                                                    Cell : props => <div>
                                                            
                                                            <input  type="number" style={{width:"113px"}} value={this.state[props.value]} onChange={(e)=>{
                                                                this.setState({
                                                                    items:{
                                                                        [props.value]:{
                                                                        value:e.target.value
                                                                    }
                                                                },
                                                                [props.value]:e.target.value
                                                                },()=>{
                                                                })
                                                            }}/>
                                                        </div>,
                                                    width:120
                                                },
                                                {
                                                    Header:'End Ml',
                                                    accessor:'indexvalue',
                                                    className:'cellAlign',
                                                    filterable:false,
                                                    Cell : props => <div>
                                                            
                                                            <input type="number" style={{width:"113px"}} value={this.state[props.value]} onChange={(e)=>{
                                                                this.setState({
                                                                    itemsNew:{
                                                                        [props.value]:{
                                                                        value:e.target.value
                                                                    }},
                                                                    [props.value]:e.target.value
                                                        
                                                                },()=>{
                                                                })
                                                            }}/>
                                                        </div>,
                                                    width:120
                                                },
                                                {
                                                    Header:'Submit',
                                                    accessor:'data',
                                                    className:'cellAlign',
                                                    filterable:false, 
                                                    Cell : props => <div>
                                                            <button className='btn btn-success' style={{cursor : 'pointer',float:'unset'}} onClick={()=>this.handleSubmit(props)}>
                                                            Submit
                                                            </button>
                                                            </div>,
                                                    width:80
                                                }]
                                            }]}
                                            defaultPageSize={10}
                                            pageSizeOptions={[10, 20, 25, 50, 100]}
                                            style={{
                                                height: "70vh" // This will force the table body to overflow and scroll, since there is not enough room
                                            }}
                                        />
                                    </div>
                                </div>
                            </Panel.Body>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}