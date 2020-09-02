import React, { Component } from "react";
import {Table,Radio,Glyphicon} from "react-bootstrap";
import axios from 'axios';
import MenuViewHeader from "../Headers/MenuViewHeader";
import MenuHeader from "../Headers/MenuHeader";
import MenuViewItemList from "../list/MenuViewItemList";
import  SweetAlert from 'react-bootstrap-sweetalert';
import {glass} from 'react-icons-kit/fa/glass'
import { Icon } from "react-icons-kit";
import {kotAdd} from '../../../kotAdd';
const API_URL = process.env.REACT_APP_API_URL;
let m=[];

export default class menuViewBody extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            menu:[],
            items:[],
            old_items:[],
            t:true,
            d:false,
            keys:false,
            itt_id:[],
            alert_message:'',
            alert_state_danger:false,
            alert_state_success:false,
            filter_drop:'All',
            filter_search:''
        }
    }

    async componentWillMount()
    {
        this.get();
    }

    async componentDidMount()
    {
        kotAdd(async (err, message) => {
            if(message=='updateMenuStatus')
            {
               await this.get();
               await this.setState({
                   alert_message:"Success.!",
                   alert_state_success:true
               })
            }
        })
    }

    async get()
    {
        try
        {
            let list=await axios.get(API_URL+'/hms/kot/getMenuList');
            this.setState({
            menu:list.data
            })
            m=list.data;
            const res = await axios.get(API_URL+'/hms/kot/viewItems');
            const { data } = await res;
            this.setState({
                items:data,
                old_items:data
            })

            this.handleSearch(this.state.filter_search,this.state.filter_drop);
        }
        catch(error)
        {
            this.setState({
                alert_message:"Server Error.!",
                alert_state_danger:true
            })
        }
    }

   async handleSearch(e,eventKey)
    {
        await this.setState({
            filter_search:e,
            filter_drop:eventKey,
            items:[]
        })
        if(e.length>0)
        {
            let ordersall =await  this.state.old_items.filter(function(data)
            {
                if(data.itemname.toLowerCase().includes(e.toLowerCase()))
                {
                    if(eventKey!=='All')
                    {
                    return data.itemtype===eventKey
                    }
                    else
                    {
                    return data
                    }
                }
            });
           await this.setState({
                items:ordersall
            })
        }
        else
        {
           await this.setState({
                items:this.state.old_items
            })
        }
     
    }

    async handleFilter(eventKey)
    {
        await this.setState({
            filter_drop:eventKey,
            items:[]
        })
        if(eventKey=='All')
        {
           await this.setState({
                items:this.state.old_items
            })
        }
        else
        {
            let itemall =await this.state.old_items.filter(function(data)
            {
                if(eventKey!=='All')
                {
                return data.itemtype===eventKey
                }
                else
                {
                return data
                }
            });
            await this.setState({
                items:itemall
            })
        }
       
    }

    renderIcon(type)
    {
        if(type==='Hotdrink')
        {
            return(
                <td className="center">
                    <Icon size={12} className='Hotdrink' icon={glass}/>
                </td>
            )
        }
        else
        {
            return(
                <td className="center">
                    <Glyphicon glyph="stop" className={type+"Item"}/>
                </td>
            )
        }
    }
    async handleCheckboxheader(id,state)
    {
        let data={
            state:state
        };
        const res = await axios.put(API_URL+'/hms/kot/selectAllItem/'+id,{data});
        await this.get();
        
        await this.setState({
            alert_message:'Success.!',
            alert_state_success:true
        })
       
    }
    render()
    {
    
        return (
            <div>
                <MenuHeader  handleSearch={this.handleSearch.bind(this)}  
                    handleFilter={this.handleFilter.bind(this)} 
                />
                <div className="foodmenuBody">
                    <Table className="foodmenuTable">
                        <MenuViewHeader handleCheckboxheader={this.handleCheckboxheader.bind(this)} menu={this.state.menu} items={this.state.items}/>
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
                            success title={this.state.alert_message} 
                            show={this.state.alert_state_success} 
                            onConfirm={()=>{
                                this.setState({
                                alert_state_success:false
                                })
                            }}
                        />
                        <tbody>
                        {
                            this.state.items.map((items,index)=>{
                                return(
                                    <tr>
                                        <td className="left">{index+1}</td>
                                            {this.renderIcon(items.itemtype)}
                                        <td className="center">{items.itemname}</td>
                                        {
                                            Object.keys(items).map(function(key, index)
                                            {
                                                let id=items["itt_id"];
                                                if(key!="bool" && key!="item_status" && 
                                                    key!="itemmaincategory" &&
                                                    key!="itemnumber" && key!="itemsubcategory" &&  
                                                    key!="itemtype" &&
                                                    key!="itt_id" && key!="menu_id" && 
                                                    key!="price_list" && key!="itemname" &&  key!="counter_id" && key!="most_sold_count" &&
                                                    key!="itemcode")
                                                {
                                                    return(
                                                        <td style={{textAlign:"right"}} >
                                                            <MenuViewItemList
                                                                keys={key}
                                                                value={items[key]}
                                                                item_id={id}
                                                            />
                                                        </td>
                                                    )
                                                    // if(item[key])
                                                    // {
                                                    //     return(
                                                    //         <td className="center" >
                                                    //             <MenuViewItemList
                                                    //                 keys={key}
                                                    //                 value={item[key]}
                                                    //                 item_id={id}
                                                    //             />
                                                    //         </td>
                                                    //     )
                                                    // }
                                                    // else
                                                    // {
                                                    //     return(
                                                    //         <td className="center">                                      
                                                    //             <MenuViewItemList
                                                    //                 keys={key}
                                                    //                 value={item[key]}
                                                    //                 item_id={id}
                                                    //             />
                                                    //         </td>
                                                    //     )
                                                    // }
                                                }
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}
