import React, { Component } from 'react';
import Switch from "react-switch";
import Axios from 'axios';
import  SweetAlert from 'react-bootstrap-sweetalert';
const API_URL = process.env.REACT_APP_API_URL;

class CategorySwitch extends Component {
    constructor(props) {
        super(props);
        this.state = { checked: props.status,
            newToken:sessionStorage.getItem('token'),
            alert_message:"" ,
            alert_state_success: false,
            alert_state_warning:false,
            alert_state_danger:false,
        };
        this.handleChange = this.handleChange.bind(this);
    }
 
    handleChange(checked,e,id) {
        let delete_status = false;
        this.setState({ checked },()=>{
            if(this.state.checked === true){
                delete_status = true;
            }
            else{
                delete_status = false;
            }
            let data = {status:delete_status}
            Axios.put(API_URL+'/hms/admin/DeleteItemCategory/'+id,{data},{headers: { Authorization: this.state.newToken }}) 
            .then((response) => {
                if(response.data.data[0].delete_status === 1){
                    this.setState({
                        alert_message:"Item Category De-activated Succesfully.!",
                        alert_state_success: true,
                    })
                }
                else if(response.data.data[0].delete_status === 0){
                    this.setState({
                        alert_message:"Item Category Activated Succesfully.!",
                        alert_state_success: true,
                    })
                }
                else{
                    this.setState({
                        alert_message:"Failed to delete item .!",
                    })
                }
            })
        });
    }
 
    render() {
        let data = this.state.data
        return (
            <div>
                <SweetAlert  success show={this.state.alert_state_success} onConfirm={()=>{
                    this.setState({
                        alert_state_success:false 
                    })
                }} >
                    {this.state.alert_message}
                </SweetAlert>
                <SweetAlert warning show={this.state.alert_state_warning} onConfirm={()=>{
                    this.setState({
                        alert_state_warning:false 
                    })
                }} >
                    {this.state.alert_message}
                </SweetAlert>
                <SweetAlert danger show={this.state.alert_state_danger} onConfirm={()=>{
                    this.setState({
                        alert_state_danger:false 
                    })
                }} >
                    {this.state.alert_message}
                </SweetAlert>
                <Switch
                    onChange={this.handleChange}
                    checked={this.state.checked}
                    onColor='#339933'
                    offColor='#ff5050'
                    id={this.props.id}
                />
            </div> 
        );
    }
}

export default CategorySwitch;