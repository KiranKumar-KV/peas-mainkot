import React, { Component } from 'react'
import Checkbox from '@material-ui/core/Checkbox';

export default class OrderViewHeader extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            menu:[],
        }
    }
  
    async componentWillMount()
    {
        await  this.setState({
            menu:this.props.menu
        })
    }
    componentDidUpdate()
    {
        
    }
   async  componentWillReceiveProps()
    {
        await  this.setState({
            menu:this.props.menu
        })
    }
   async handleCheckboxheader(e)
    {
         if(this.state[e.target.id]===true)
         {
            this.setState({
                [e.target.id]:false
            })
            await this.props.handleCheckboxheader(e.target.id,false);
         }
         else
         {
            this.setState({
                [e.target.id]:true
            })
            await this.props.handleCheckboxheader(e.target.id,true);
         }
    }
  componentDidMount()
  {
  }
    render() {
        
        return (
            <thead>
                <tr>
                    <th style={{position:"relative",bottom:"15px"}} className="">#</th>
                    <th style={{position:"relative",bottom:"15px"}} className="">Type</th>
                    <th style={{position:"relative",bottom:"15px",textAlign:"center"}} className="">Item Name</th>
                    {
                        this.props.menu.map(menu=>{
                            return(
                                <th style={{textAlign:"right"}}>{menu.menu_name}
                                <Checkbox
                                id={menu.menu_name}
                                name="all"
                                color="primary"
                                checked={this.state[menu.menu_name]}
                                onChange={this.handleCheckboxheader.bind(this)}
                            />
                            </th>
                            )
                        })
                    }
                </tr>
            </thead>
        )
    }
}
