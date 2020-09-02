import React, { Component } from 'react'
import MenuBodyRow from './MenuBodyRow'
import axios from'axios';
import {kotAdd} from '../../../kotAdd'
import MenuContHeader from '../Headers/MenuContHeader';
import  SweetAlert from 'react-bootstrap-sweetalert';

let items=[];
const API_URL = process.env.REACT_APP_API_URL;

export default class MenuContBody extends Component 
{
    constructor(props)
    {
        super(props);
        this.state={
            items:[],
            old_items:[],
            menu:[],
            alert_message:'',
            alert_state_danger:false,
            alert_state_warnig:false,
            filter_search:'',
            filter:'All',
            f_id:0
        }
    }

    handleItemSelect()
    {
        this.props.handleItemSelect();
    }

    async componentWillMount()
    {
        this.get()
    }


    async componentDidMount() {
        kotAdd((err, message) =>{
            if(message==='itemupdate')
            {
                this.get();
            }
        })
    }

    async get()
    {
        try
        {
            const res = await axios.get(API_URL+'/hms/kot/viewItems');
            const { data } = await res;
            if(res.status==200)
            {
                let list=await axios.get(API_URL+'/hms/kot/getMenuList');

                this.setState({
                    menu:list.data
                })
                let itemhold=[];
    
                data.map(item=>{
                    this.state.menu.map(m=>{
                        if(item[m.menu_name])
                        {
                            if(m.mbool)
                            {
                                itemhold.push(item);
                            }
                        }
                    })
                })
                
                let items_unique = itemhold.filter(function(item, index)
                {
                    if(item.item_status==='available')
                    {
                    return itemhold.indexOf(item) >= index;
                    }
                });
    
                await this.setState({
                    items:items_unique,
                    old_items:items_unique
                })
    
                this.handleSearch(this.state.filter_search,this.state.filter);
            }
            else if(res.status==201)
            {
                this.setState({
                    alert_message:"Please Add Items.!",
                    alert_state_warnig:true
                })
            }
         
        }

        catch(error)
        {
            this.setState({
                alert_message:"Server Error.!",
                alert_state_danger:true
            })
        }
    }
  
   async handleSearch(e,filterItem)
    {

        await this.setState({
            filter_search:e,
            filter:'All',
            items:[]
        })
        let itemall = this.state.old_items.filter(function(data)
        {
            if(data.itemname.toLowerCase().includes(e.toLowerCase()) ||
                data.itemmaincategory.toLowerCase().includes(e.toLowerCase()) ||
                data.itemsubcategory.toLowerCase().includes(e.toLowerCase()) ||
                data.itemtype.toLowerCase().includes(e.toLowerCase()) ||
                data.itemcode.toLowerCase().toString().includes(e.toLowerCase().toString())
            )
            {
                return data
                // if(filterItem!=='All')
                // {
                //     return data.itemtype===filterItem
                // }
                // else
                // {
                //     return data
                // }
            }
        });
       await this.setState({
            items:itemall
        })
    }

    async handleFilter(eventKey)
    {
        await this.setState({
            items:[]
        })
        let itemall = this.state.old_items.filter(function(data)
        {
            if(eventKey==='All')
            {
                return data.table_status!==''
            }
            else
            {
                return data.itemsubcategory===eventKey.toLowerCase() || data.itemmaincategory===eventKey.toLowerCase();
            }
        });
        
         this.setState({
            items:itemall
        })
    }

    render() 
    {
        
        let j=0;
        let i=0;
        return (
            <div className="menuBody">
                <SweetAlert 
                    danger title={this.state.alert_message} 
                    show={this.state.alert_state_danger} 
                    onConfirm={()=>{
                        this.setState({
                            alert_state_danger:false
                        })
                    }}
                />

                 <SweetAlert 
                    warning title={this.state.alert_message} 
                    show={this.state.alert_state_warnig} 
                    onConfirm={()=>{
                        this.setState({
                            alert_state_warnig:false
                        })
                    }}
                />
                <MenuContHeader 
                    handleFilter={this.handleFilter.bind(this)} 
                    handleSearch={this.handleSearch.bind(this)}
                />
                <div className="menuBodyRows">
                    {
                        this.state.items.map((item,index)=>{
                            i=j;
                            j=j+3;
                            if(this.state.items.length>j-3)
                            {
                                return(
                                    <MenuBodyRow floor_id = {this.props.floor_id} floor_charge={this.props.floor_charge} handleItemSelect={this.handleItemSelect.bind(this)}  
                                        elements={this.state.items.slice(i, j)}
                                    />
                                )
                            }
                        })
                    }
                </div> 
            </div>
        )
    }
}
