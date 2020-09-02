import React, { Component } from 'react'
import {Well,Glyphicon,Button} from 'react-bootstrap';
import { Icon } from "react-icons-kit";
import {glass} from 'react-icons-kit/fa/glass'
import {connect} from 'react-redux';
 class MenuItemList extends Component {
    constructor(props)
    {
        super(props);
        this.props.price_list.map(list=>{
            this.state={
                [list.quantitytype]:true,
                price:0,
                q_id:0,
                q_type:'',
                click:true,
                qSelect:false
            }
        })
    }

    async handleItemSelect()
    {
        const checkExist = obj =>obj.item_name ==this.props.itemname  && obj.id==this.props.itt_id && obj.q_id==this.state.q_id;

        if(this.props.selectedItems.some(checkExist))
        {
                this.props.selectedItems.filter((item,index)=>{
                            if(item.item_name==this.props.itemname  && item.id==this.props.itt_id && item.q_id==this.state.q_id)
                            {
                                item.quantity=item.quantity+1
                            }
                        })
        }
        else
        {
                this.props.selectedItems.push({
                        "item_name": this.props.itemname,
                        "item_price": this.state.price-Math.round((this.state.price*this.props.floor_charge)/100),
                        "id": parseInt(this.props.itt_id),
                        "q_id": this.state.q_id,
                        "q_type":this.state.q_type,
                        "quantity":1,
                        "note":'',
                        "subcategory":this.props.itemsubcategory
                    });
        }
        await this.props.handleItemSelect();
        await this.props.selectPass(this.props.selectedItems);
    }

    typeRender()
    {
        if(this.props.itemtype==='Hotdrink')
        {
            return(
                <Icon size={12} className='Hotdrink' icon={glass}/>
            )
        }
        else
        {
            return(
                <Glyphicon glyph="stop" className={this.props.itemtype+"Item"}/>
            )
        }
    }

    quntitySelect(e)
    {
        this.setState({
            qSelect:true
        })
        if(this.props.price_list.length>1)
        {
            this.props.price_list.map(async list=>{
                this.setState({
                    [list.quantitytype]:false,
                })
            })
            if(this.state[e.target.id])
            {
                this.setState({
                    [e.target.id]:true
                })
            }
            else
            {
                this.setState({
                    [e.target.id]:true,
                })
            }
            this.props.price_list.filter(list=>{
                if(list.quantitytype==[e.target.id])
                {
                    this.setState({
                        price:list.price,
                        q_id:list.quantity_id,
                        q_type:list.quantitytype
                    })
                }
            })
            this.setState({
                click:false
            })
        }
    }

    componentWillMount()
    {
        this.props.price_list.map(list=>{
            if(this.state[list.quantitytype])
            {
                this.props.price_list.map(list=>{
                    this.setState({
                        [list.quantitytype]:false,
                        q_id:list.quantity_id,
                        q_type:list.quantitytype
                    })
                })
                this.setState({
                    price:list.price,
                })
                this.setState({
                    [list.quantitytype]:true
                })
            }
        })
    }

    componentDidUpdate()
    {
       if(this.state.click && !this.state.qSelect)
       {
        this.props.price_list.map(list=>{
            if(this.state[list.quantitytype])
            {
                this.props.price_list.map(list=>{
                    this.setState({
                        [list.quantitytype]:false,
                        q_id:list.quantity_id,
                        q_type:list.quantitytype
                    })
                })
                this.setState({
                    price:list.price,
                })
                this.setState({
                    [list.quantitytype]:true,
                    click:false
                })
            }
        })
       }
    }

   componentWillReceiveProps()
   {
    if(!this.state.qSelect)
    {
        this.props.price_list.map(list=>{
            if(this.state[list.quantitytype])
            {
                this.props.price_list.map(list=>{
                    this.setState({
                        [list.quantitytype]:true,
                        q_id:list.quantity_id,
                        q_type:list.quantitytype
                    })
                })
                this.setState({
                    price:list.price,
                })
                this.setState({
                    click:true
                })
            }
        })
     }
   }
   
    renderButton()
    {
        return(
            this.props.price_list.map((list,index)=>{
                if(this.state[list.quantitytype]==true || this.state[list.quantitytype]==false)
                {
                    return(
                        <Button onClick={this.quntitySelect.bind(this)}  id={list.quantitytype} name={list.quantitytype} className={"buttonSelect"+" "+this.state[list.quantitytype]}>{list.quantitytype}</Button>
                    )
                }
                else
                {
                    if(this.props.price_list.length!=(index+1))
                    {
                        return(
                            <Button onClick={this.quntitySelect.bind(this)}  id={list.quantitytype} name={list.quantitytype} className={"buttonSelect"+" "+false}>{list.quantitytype}</Button>
                        )
                    }
                    else
                    {
                        return(
                            <Button onClick={this.quntitySelect.bind(this)}  id={list.quantitytype} name={list.quantitytype} className={"buttonSelect"+" "+true}>{list.quantitytype}</Button>
                        )
                    }
                }
            })
        )
    }

    render() 
    {
        // console.log(this.state)
        return (
            <>
            { this.props.price_list.length > 0 && 
            <Well bsSize="small">
              
                <span onClick={this.handleItemSelect.bind(this)}>
                    <p>{this.props.itemname.charAt(0).toUpperCase() + this.props.itemname.slice(1)}</p>
                    <div className="itemSection">
                        <p>{this.props.itemcategory}</p>
                    </div>
                    <div className="itemDetails">
                        <div className="itemPrice">
                            ₹{this.state.price-Math.round((this.state.price*this.props.floor_charge)/100)}
                        </div>
                        <div  className="itemCategory">
                            {this.typeRender()}
                        </div>
                    </div>
                </span>
                <div className="quantityClass">
                    {
                        this.renderButton()
                    }
                </div>
            </Well>}
            </>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        selectedItems:state.selectedItems,
     }
    }

    const mapDispatchToProps=(dispatch)=>{
      return{
         selectPass:(itemsAll)=>{
            dispatch({type:'select',selectedItems:itemsAll})}
      }
    }


export default connect(mapStateToProps,mapDispatchToProps)(MenuItemList)