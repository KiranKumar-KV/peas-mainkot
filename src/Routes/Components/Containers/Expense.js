import React from 'react';
import { Grid, Row, Col,Button } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import Header from "../Headers/Header";
import Axios from 'axios';
import SweetAlert from "react-bootstrap-sweetalert";
import moment from 'moment-timezone';

const API_URL = process.env.REACT_APP_API_URL;

class Expense extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            expenseData : [],
            addExpence : {
                category : { value : "", valid : false },
                note : { value : "", valid : false },
                amount : { value : "",  valid : false },
                number : { value : "", valid : true}
            },
            alert_message : null,
            alert_state_success : false,
            alert_state_warning : false,
            alert_state_danger : false,
        }
    }

    componentDidMount() {
        this.getExpense();
    }

    async getExpense() {
        Axios.get(API_URL+"/hms/kot/getAllExpense")
        .then((response)=>{
            this.setState({
                expenseData : response.data
            })
        })
    }

    handleChange(e){
         let value = e.target.value;
        let valid = this.state.addExpence[e.target.id].valid;
        switch(e.target.id) {
            case "category" :
                if(value === "") {
                    valid = false;
                }
                else{
                    valid = true;
                }
                break;
            case "note" : {
                if( value === "" && value.length <= 0) {
                    valid = false;
                }
                else { 
                    valid = true;
                }
                break;
            }
            case "amount" : {
                if(/^[0-9]*$/.test(value) && value != "") {
                    valid = true;
                }
                else {
                    valid = false;
                }
                break;
            }
            case "number" : {
                valid = true
            }
            break;
        }
        let newstate = this.state.addExpence[e.target.id];
        newstate.value = value;
        newstate.valid = valid;

        this.setState({
            newstate
        })
    }

    handleAddExpense(){
        let data = {
            expense_category : this.state.addExpence.category.value,
            expense_note : this.state.addExpence.note.value,
            expense_amount : this.state.addExpence.amount.value,
            expense_invoice_number : this.state.addExpence.number.value,
            emp_id  : sessionStorage.getItem("employee_id")
        }
        Axios.post(API_URL+'/hms/kot/addExpense', {data})
        .then((response) => {
            if(response.status === 200) {
                this.setState({
                    alert_message : "Expense added",
                    alert_state_success : true
                })
            }
            else {
                this.setState({
                    alert_message : 'Failed to add expense. Contact admin.',
                    alert_state_warning : true
                })
            }
            this.handleResetForm();
            this.getExpense()
        })
    }

    async handleResetForm() {
        this.setState({
            addExpence : {
                category : { value : "", valid : false },
                note : { value : "", valid : false },
                amount : { value : "",  valid : false },
                number : { value : "", valid : true}
            }
        })
    }

    render(){
        let isformValid = true;
        for (const field in this.state.addExpence) {
            if (this.state.addExpence.hasOwnProperty(field)) {
                isformValid = isformValid && this.state.addExpence[field].valid;
            }
        }
        function toCurrency(numberString) {
            let number = parseFloat(numberString);
            return number.toLocaleString('en-IN', {minimumFractionDigits : 2, maximumFractionDigits : 2});
        }
        return(
            <div className="App">
                 <SweetAlert
                    warning
                    title = {this.state.alert_message}
                    show = {this.state.alert_state_warning}
                    onConfirm = {() => {
                        this.setState({
                            alert_state_warning : false
                        });
                    }}
                />
                <SweetAlert
                    success
                    title = {this.state.alert_message}
                    show = {this.state.alert_state_success}
                    onConfirm = {() => {
                        this.setState({
                            alert_state_success : false,
                        });
                    }}
                />
                <SweetAlert
                    danger
                    title = {this.state.alert_message}
                    show = {this.state.alert_state_danger}
                    onConfirm = {() => {
                        this.setState({
                            alert_state_danger : false,
                        });
                    }}
                />
                <Grid fluid>
                    <Row className="headerRow">
                        <Header />
                    </Row>
                    <Row>
                        <Tabs />
                        <Col xs={11} className="tabContainer">
                            <div className="expenseHeader"><strong>Expense</strong></div>
                            <div className = "expenseAddDiv">
                                <Row>
                                    <Col md = {6}>
                                        <Row>
                                            {/* <Col md = {2}></Col> */}
                                            <Col md = {5} style={{textAlign:'right'}}>
                                                <label className = "expenseLabel">Expense category 
                                                    <span style = {{color : 'red'}}>*</span>
                                                </label>
                                            </Col>
                                            <Col md = {5}>
                                                <select 
                                                    className = "expenseInput" 
                                                    id = "category" 
                                                    name = "category" 
                                                    value = {this.state.addExpence.category.value} 
                                                    onChange = {this.handleChange.bind(this)}
                                                >
                                                    <option value = "">Choose category</option>
                                                    <option value = "electrical">Electrical</option>
                                                    <option value = "carpentory">Carpentory</option>
                                                    <option value = "printing and stationary">Printing & Stationary</option>
                                                    <option value = "transportation">Transportation</option>
                                                    <option value = "other">Other</option>

                                                </select>
                                            </Col>
                                        </Row>
                                    </Col>

                                <Col md={6}>
                                    <Row>
                                        <Col md = {3}>
                                            <label className = "expenseLabel">Expense Note 
                                                <span style = {{color : 'red'}}>*</span>
                                            </label>
                                        </Col>
                                         <Col md = {5}>
                                            <input 
                                                className = "expenseInput"
                                                id = "note"
                                                name = "note"
                                                value = {this.state.addExpence.note.value}
                                                onChange = {this.handleChange.bind(this)} 
                                            />
                                        </Col>
                                         <Col md = {4}></Col>
                                    </Row>
                                </Col>

                                <Col md = {6}>
                                    <Row>
                                        <Col md = {2}></Col>
                                        <Col md = {3}>
                                            <label className = "expenseLabel">Expense Amount 
                                                <span style = {{color : 'red'}}>*</span>
                                            </label>
                                        </Col>
                                         <Col md = {5}>
                                            <input 
                                                className = "expenseInput"
                                                id = "amount"
                                                name = "amount"
                                                value = {this.state.addExpence.amount.value}
                                                onChange = {this.handleChange.bind(this)}
                                            />
                                            { this.state.addExpence.amount.valid === false && 
                                                <span style = {{color:"red", padding:"25px 15px"}}>
                                                    Should be positive number
                                                </span>
                                            }
                                        </Col>
                                    </Row>
                                </Col>

                                <Col md = {6}>
                                    <Row>
                                        
                                        <Col md = {3}>
                                            <label className = "expenseLabel">Invoice number </label>
                                        </Col>
                                         <Col md = {5}>
                                            <input 
                                                className = "expenseInput"
                                                id = "number"
                                                name = "number"
                                                value = {this.state.addExpence.number.value}
                                                onChange = {this.handleChange.bind(this)}
                                            />
                                        </Col>
                                        <Col md = {4}>
                                            <Button 
                                                className = "expenseAddButton"
                                                disabled = {!isformValid} 
                                                bsStyle = "success"
                                                onClick = {this.handleAddExpense.bind(this)}
                                            >
                                                Add Expense
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <div className = "expenseDisplayDiv">
                            <table style = {{width : "90%", margin : "30px"}}>
                                <thead>
                                    <tr>
                                        <th style = {{ textAlign : "center" }}> # </th>
                                        <th style = {{ textAlign : "center" }}> Date </th>
                                        <th style = {{ textAlign : "center" }}> Time </th>
                                        <th style = {{ textAlign : "center" }}> Employee name </th>
                                        <th style = {{ textAlign : "center" }}> Expense Category </th>
                                        <th style = {{ textAlign : "center" }}> Expense Note </th>
                                        <th style = {{ textAlign : "center" }}> Expense Amount (₹) </th>
                                        <th style = {{ textAlign : "center" }}> Invoice Number </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.expenseData.length > 0 && 
                                        this.state.expenseData.map((row, i) => {
                                            return (
                                                <tr>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {i+1} </td>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {moment(row.date_time).tz("Asia/Kolkata").format('YYYY-MM-DD')} </td>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {moment(row.date_time).subtract({hours:5,minutes:30}).format('hh:mm:ss a')} </td>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {row.employee_name} </td>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {row.expense_category} </td>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {row.expense_note} </td>
                                                    <td style = {{ padding : "10px", textAlign : "right" }}> {toCurrency(row.expense_amount)} </td>
                                                    <td style = {{ padding : "10px", textAlign : "center" }}> {row.invoice_number} </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default Expense; 