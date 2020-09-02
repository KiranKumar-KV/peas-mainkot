import React, { Component } from "react";
import { Grid, Row, Col, Table, Button, FormGroup, FormControl, Form, InputGroup, Glyphicon, Modal } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';
import { Icon } from "react-icons-kit";
import validator from 'validator';
import { ic_send } from 'react-icons-kit/md/ic_send'
import Select from 'react-select';
import ReactToPrint from "react-to-print";
import moment from 'moment-timezone';
import Billing from '../extra/Billing';
import { connect } from 'react-redux';
import { minus } from 'react-icons-kit/fa/minus'
import { plus } from 'react-icons-kit/fa/plus'

let p = 0;
let items = []
const API_URL = process.env.REACT_APP_API_URL;
let arr = []

class KOTContFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_price: '',
            order_id: 0,
            alert_message: null,
            alert_state_success: false,
            print_confirm: false,
            alert_state_warning: false,
            alert_state_danger: false,
            billtransfer: false,
            bill_confirm: false,
            bill_show: false,
            room_show: false,
            show: false,
            room_number: [],
            occupied_rooms: [],
            room_num_selected: 'Room',
            room_id_selected: '',
            cust_name_selected: '',
            table_call: false,
            resp_billno: '',
            resp_date: '',
            resp_tableNumber: '',
            resp_totalAmount: '',
            resp_tax: '',
            resp_taxaAmount: '',
            room_no: "",
            resp_kotList: [{
                items: []
            }],
            newtab_status: '',
            printstate: false,
            itemPrepareStatus: false,
            card: false,
            people: 0,
            both: false,
            cash_amount: 0,
            count: 0,
            ptype: '',
            cname:'',
            offers:false,
            dropdown: "hide",
            dropdownCoupon:"hide",
            member_data:'',
            coupon_data:'',
            offer_given:'guest'
        }

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() 
    {
        this.setState({
            show: false,
            room_num_selected: 'Room'
        });
    }

    handleClear(itemName) 
    {
        // this.props.handleClear(itemName);
        this.props.select([]);
    }

    checkAndAdd(ids, names, prices) {
        let name = names;
        let price = prices;
        let id = ids;

        var found = arr.some(function (el) {
            if (el.name == name && el.price == price) {
                return el.name;
            }
        });

        if (!found) {
            arr.push({ id: id, name: name, quantity: 1, price: price });
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name == name && arr[i].price == price) {
                    arr[i].quantity = arr[i].quantity + 1;
                    break;
                }
            }
        }
    }

    async componentDidUpdate() {
        if (this.props.table_status === 'Billed' && this.state.bill_show !== true) {
            this.setState({
                bill_show: true
            })
        }

        if (this.props.table_status === 'Ordered' && this.state.bill_show !== false) {
            this.setState({
                bill_show: false
            })
        }

        // if (this.props.table_status === 'Served' && !this.props.bill_id && this.state.bill_show != false) {
        //     this.setState({
        //         bill_show: false
        //     })
        // }
        if (this.props.bill_id && this.state.bill_show !== true && (this.props.table_status === 'Billed' || this.props.table_status === 'Served')) {
            this.setState({
                bill_show: true
            })
        }

        if (this.state.printstate && this.state.bill_show != true) {
            this.setState({
                bill_show: true,
                printstate: false
            })
        }

        if (this.state.order_id != this.props.order_id) {
            this.setState({
                order_id: this.props.order_id
            })
        }



        /*  let item_name = this.props.itemName;
          let item_price = this.props.price;
          let item_id = this.props.id;
          let q_id = this.props.q_id;
          p = this.props.price;
  
          let f = 0;
          let allitems = [];
  
          for (var i = 0; i < item_name.length; i++) 
          {
              allitems.push({
                  "item_name": item_name[i],
                  "item_price": item_price[i],
                  "id": item_id[i],
                  "q_id": q_id[i]
              });
          }
  
          var temp = [];
          var newhh = [];
  
          for (var i = 0; i < allitems.length; i++) 
          {
              if (temp.indexOf(allitems[i].item_name + allitems[i].item_price) == -1) 
              {
                  temp.push(allitems[i].item_name + allitems[i].item_price);
                  var _data = {};
                  _data.it_id = allitems[i].id;
                  _data.price = allitems[i].item_price;
                  _data.q_id = allitems[i].q_id;
                  _data.note = '';
                  _data.quantity = 1;
                  newhh.push(_data);
              }
              else 
              {
                  for (var j = 0; j < newhh.length; j++)
                  {
                      if (newhh[j].it_id === allitems[i].id && newhh[j].price === allitems[i].item_price) 
                      {
                          var _x = parseInt(newhh[j].quantity) + 1;
                          newhh[j].quantity = _x;
                      }
                  }
              }
          }
  
  
          items = newhh;
          let prices = [this.props.price];
          let sum = 0;
          let k = sum;
          for (var i = 0; i < prices[0].length; i++) {
              sum += prices[0][i]
          }
          if (sum !== this.state.total_price) {
              this.setState({
                  total_price: sum
              })
          }*/
    }

    async componentWillMount() {
        const resp = await axios.get(API_URL + '/hms/kot/order_id/' + this.props.table_id);
        if (resp.data[0]) {
            this.setState({
                order_id: resp.data[0].order_id
            })
        }

        if (this.props.table_status === 'Ordered' && this.state.bill_show != false) {
            this.setState({
                bill_show: false
            })
        }

        if (this.props.table_status === 'Served' && !this.props.bill_id && this.state.bill_show != false) {
            this.setState({
                bill_show: false
            })
        }

        if (this.props.bill_id && this.state.bill_show !== true) {
            this.setState({
                bill_show: true
            })
        }
        if (this.props.floor_name === 'ROOM') {
            this.setState({
                room_show: true
            })
        }

        let options = [];
        this.props.room_with_name.map(data => {
            options.push({ value: data.customer_fname, label: data.room_num, id: data.rooms_id })
        })

        this.setState({
            room_number: options
        })

        this.setState({
            table_split: this.props.table_split,
            table_number: this.props.table_number,
            tab_id: this.props.table_id
        })
    }

    handleSelect = (room_number) => {
        this.setState({
            cust_name_selected: room_number.value,
            room_id_selected: room_number.id,
            room_num_selected: room_number.label
        });
    }

    printCall(e)
    {
        this.setState({
            offers:true
        })
    }

    paidCall(e)
    {
        this.submitData('Closed', 'Empty', 'paid');
    }

    async submitData(ostatus, tstatus, billstatus) {
        try {
            if (this.state.order_id !== 0)
            {
                let data_tax = {
                    tax: this.props.tax,
                    table_split: this.state.table_split,
                    table_number: this.state.table_number,
                    tab_id: this.props.table_id,
                    order_status: ostatus,
                    table_status: tstatus,
                    pay_status: billstatus,
                    room_show: this.state.room_show,
                    service_tax: this.props.service_tax,
                    employee_id: sessionStorage.getItem('employee_id'),
                    coupon_data:this.state.coupon_data,
                    member_data:this.state.member_data,
                    offer_given:this.state.offer_given,
                    floor_id:this.props.floor_id,
                    billing_floor_id:sessionStorage.getItem('floor_id')
                }

                const resp = await axios.put(API_URL + '/hms/kot/bill/' + this.state.order_id, { data_tax });

                if(resp.status === 200) 
                {
                    let data = {
                        type: this.state.ptype,
                        cash_amount: this.state.cash_amount,
                    }
                    let response = await axios.put(API_URL + '/hms/kot/update_pay_type/' + this.state.order_id, { data });
                 
                    if (response.status === 200) {
                        let itemsAll = [];
                        await resp.data[0].billing_data.kot_list.map(list => {
                            list.items.map(items => {
                                return (
                                    itemsAll.push({
                                        "item_name": items.item_name,
                                        "quantity": parseInt(items.quantity),
                                        "price": parseInt(items.price),
                                    })
                                )
                            })
                        })

                        await this.setState({
                            resp_billno: resp.data[0].billing_data.billing_id,
                            resp_date: resp.data[0].billing_data.date_time,
                            resp_totalAmount: resp.data[0].billing_data.total_amount,
                            resp_taxaAmount: resp.data[0].billing_data.tax_amount,
                            cash_amount: 0,
                            both: false
                        })

                        await setTimeout(async () => {
                            if (ostatus === 'Closed' || this.state.table_call) {
                                this.setState({
                                    alert_message: 'Billing successfull..!',
                                    bill_confirm: true,
                                    offers:false
                                })
                                await this.handleClear(this.props.itemName);
                            }
                            else {
                                await this.setState({
                                    bill_show: true,
                                    printstate: true,
                                    alert_message: "Billing successfull..!",
                                    print_confirm: true,
                                    offers:false
                                })
                                await this.props.tablepass("Billed");
                            }
                        }, 100);
                    }
                }
                else if(resp.status === 202)
                {
                    this.setState({
                        alert_message: resp.data,
                        alert_state_warning: true
                    })
                }
                else {
                    this.setState({
                        alert_message: "Billing Not Done..!",
                        alert_state_danger: true
                    })
                }
            }
            else {
                this.setState({
                    alert_message: "Order Not Done..!",
                    alert_state_warning: true
                })
            }
        }
        catch (error) {
            this.setState({
                alert_message: "Billing paid Not Done..!",
                alert_state_danger: true
            })
        }
    }

    tablepass() {

    }

    async roomPay() {
        let result = await axios.get(API_URL + '/hms/bDetails/get-all-occupied-rooms');
        await this.setState({
            occupied_rooms: result.data,
        }, () => {
            this.setState({
                show: true,
            })
        })
    }

    /*room number change*/
    changeOrder = async (e) => {
        await this.setState({
            roomid: e.target.value
        })
        let result = await axios.get(API_URL + '/hms/bDetails/booking-id-by-booked-room/' + this.state.roomid);
        if (result) 
        {
            this.setState({
                booking_id: result.data[0].booking_id,
                room_no: result.data[0].room_num
            })
        }
    }

    /*transfer bill to perticular guest occupied room*/
    transferBillToRoom = async (e) => {
        try {
            if (this.state.room_no !== "") {
                let room_id = this.state.roomid
                let room_no = this.state.room_no
                let bill_id = this.props.bill_id;
    
                if (bill_id === "" || (typeof (bill_id) === 'undefined') || bill_id === null) {
                    bill_id = this.state.resp_billno
                }
                else {
                    bill_id = this.props.bill_id
                }
    
                let resultdata = ""
                let result = await axios.get(API_URL + '/hms/bDetails/get-guest-order-id-from-room/', { params: { rooms_id: room_id, room_no: room_no } });
                resultdata = result.data[0].hotel_auth_token
    
                if (result.data.length > 0) {
                    let data = {
                        table_order_id: this.state.order_id,
                        auth_token: resultdata,
                        bill_id: bill_id,
                        table_id: this.props.table_id
                    }
                    let result1 = await axios.put(API_URL + '/hms/kot/transfer-bill-to-room', { data });
    
                    if(result1.data.length > 0) 
                    {
                        let data = {
                            auth_token: resultdata,
                            booking_id: this.state.booking_id,
                            room_id: this.state.roomid,
                            order_id: result1.data[0].order_id
                        }
                        let result2 = await axios.post(API_URL +'/hms/bDetails/store-food-service-detail', { data });
    
                        if (result2.data.length > 0) {
                            this.handleClear(this.props.itemName)
                            this.setState({
                                alert_message: "Bill Transformation Done Successfully",
                                billtransfer: true,
                                bill_confirm: true
                            })
                            this.handleClose()
                        }
                        /*else {
                            this.setState({
                                alert_message: "Bill Not transfer successfully",
                                billtransfer: true,
                                print_confirm: true
    
                            })
                            this.handleClose()
                        }*/
                    }
                }
            }
            else {
                this.setState({
                    alert_message: "Please Select Any Room..!",
                    alert_state_warning: true
                })
            }
        } catch(error) {
            if (error) {
                this.setState({
                    alert_message: "oops..! Bill transefermation failed.please try after some time",
                    alert_state_warning: true,
                    showNew: false
                })
                //this.getCounter();
            } else {
                if (error.response.status === 500) {
                    this.setState({
                        alert_message: "oops something went wrong.!",
                        alert_state_danger: true,
                        showNew: false
                    })
                }
            }

        }
       
    }

    async Order(e) {
        try {
            let p = parseFloat((this.props.total_price));
            if (this.props.selectedItems.length > 0) {
                if (this.state.people > 0 && this.state.people < 100 || p > 0 || this.state.order_id > 0) {
                   
                   if(this.state.cname.length>0 || this.props.order_id>0)
                   {
                    const data =
                    {
                        tab_id: this.props.table_id,
                        e_id: this.props.emp_id,
                        order_to: this.props.order_to,
                        order_from: this.props.order_from,
                        items: this.props.selectedItems,
                        order_place: 'hotel',
                        people: this.state.people,
                        customer_name: this.state.cname
                    }
                    const res = await axios.post(API_URL + '/hms/kot/order', { data });
                    let order_id = await res.data[0].order_id

                    await this.setState({
                        order_id: order_id
                    })

                    if(res.status === 200) {
                        this.setState({
                            alert_message: "Order Success..!",
                            alert_state_success: true,
                            bill_show: false

                        })
                        // this.handleClear(this.props.itemName);
                        this.props.tablepass("Ordered");
                        this.props.select();
                    }
                    else {
                        this.setState({
                            alert_message: "Order Not Donesss..!",
                            alert_state_danger: true
                        })
                    }
                   } 
                   else
                   {
                       this.setState({
                           alert_message:'Please Enter Name.!',
                           alert_state_warning:true
                       })
                   }
                }
                else {
                    if (this.state.people === 0 || this.state.people > 30) {
                        this.setState({
                            alert_message: "Enter Valid Number Of People!",
                            alert_state_warning: true
                        })
                    }

                }
            }
            else {
                this.setState({
                    alert_message: "Please Select items..!",
                    alert_state_warning: true
                })
            }
        }
        catch (error) 
        {
            this.setState({
                alert_message: "Order Not Doneddd..!",
                alert_state_warning: true
            })
        }
    }

    printRender() {
        if (this.state.bill_show && !this.state.card && !this.state.offers) 
        {
            if (this.props.itemsPrepared) {
                return (
                    <div className="chargeBills"  >
                        <span className="chargeBillButtonnew"   >
                            <Button
                                onClick={this.cardCreditSet.bind(this)}>
                                Paid
                                    </Button>
                        </span>
                        <span className="chargeBillButtonnewRoom"   >
                            <Button
                                onClick={this.roomPay.bind(this)}>
                                Room
                                    </Button>
                        </span>
                    </div>
                )
            }
            else {
                if (!this.props.itemsPrepared) {
                    return (
                        <Button hidden className="chargeBillButton"
                        >
                            Items Still Preparing
                            </Button>
                    )
                }

            }

        }
    }

    offerRender() {
        if(this.state.offers) 
        {
            return (
                <div className="chargeBills"  >
                    
                        <span className="return-button"  style={{color: "blue"}}>
                            
                            <div className={"div-dropdownFooter" + this.getDropdownClass()}>
                                <span style={{ marginLeft: "5px" }}>
                                    Member Code:
                                </span>
                                <input id="member" maxLength={30} value={this.state.member_data} onChange={this.handleTextAreaChange.bind(this)} />
                                <button className="subBtn btn btn-primary" onClick={this.offerApplyMember.bind(this)}>Apply</button>
                            </div>
                            {this.state.dropdown === "hide" ?
                                <span className="chargeBillButtonnew"   >
                            <Button 
                                onClick={this.handleReturnButton}
                            >
                            Membership
                            </Button>
                            </span>
                                :
                                <span className="chargeBillButtonnew"   >
                                <Button
                                onClick={this.handleReturnButton}
                            >
                            Close
                            </Button> 
                            </span>
                            }
                    
                    </span>
                    <span disabled={true} className="return-button"  style={{color: "blue"}}>
                            
                            <div className={"div-dropdownFooter" + this.getDropdownClassCoupon()}>
                                <span style={{ marginLeft: "5px" }}>
                                    Coupon Code:   
                                </span>
                                <input id="coupon" maxLength={30} value={this.state.coupon_data} onChange={this.handleTextAreaChange.bind(this)} />
                                <button className="subBtn btn btn-primary" onClick={this.offerApplyCoupon.bind(this)}>Apply</button>
                            </div>
                            {this.state.dropdownCoupon === "hide" ?
                                <span className="chargeBillButtonnewRoom"   >
                            <Button 
                                onClick={this.handleReturnButtonCoupon}
                            >
                            Coupon
                            </Button>
                            </span>
                                :
                                <span className="chargeBillButtonnewRoom"   >
                                <Button
                                onClick={this.handleReturnButtonCoupon}
                            >
                            Close
                            </Button> 
                            </span>
                            }
                    
                    </span>
                </div>
            )
        }
    }

    cardCreditSet() {
        this.setState({
            card: true
        })
    }

    async roomPay() {
        let result = await axios.get(API_URL + '/hms/bDetails/get-all-occupied-rooms');
        await this.setState({
            occupied_rooms: result.data,
        }, () => {
            this.setState({
                show: true,
            })
        })
    }

    async cardSelect() {

        await this.setState({
            ptype: "card",
        })
        await this.paidCall();
    }

    async cashSelect() {
        await this.setState({
            ptype: "cash",
        })
        await this.paidCall();
    }

    async bothUpdate() {
        if (this.state.cash_amount > 0 && this.state.cash_amount < parseFloat((this.props.total_price + this.state.total_price) + (((this.state.total_price + this.props.total_price) * this.props.tax) / 100))) {
            await this.setState({
                ptype: "both",
            })
            await this.paidCall();
        }
        else {
            if (this.state.cash_amount < 1) {
                this.setState({
                    alert_message: 'Amount Invalid.!',
                    alert_state_warning: true
                })
            }
            else {
                this.setState({
                    alert_message: 'Amount Should be less than' + parseFloat((this.props.total_price + this.state.total_price) + (((this.state.total_price + this.props.total_price) * this.props.tax) / 100)),
                    alert_state_warning: true
                })
            }

        }
    }

    async bothSelect() {
        this.setState({
            both: true
        })
    }

    handleTextAreaChange(e) {
        if (e.target.id === 'people') {
            if (!isNaN(e.target.value)) {
                this.setState({
                    people: e.target.value
                })
            }
        }
        else if (e.target.id === "cash_amount") {

            if (!isNaN(e.target.value)) {
                this.setState({
                    cash_amount: e.target.value
                })
            }
        }
        else if(e.target.id==="member")
        {
            this.setState({
                member_data:e.target.value
            })
        }
        else if(e.target.id==="coupon")
        {
            this.setState({
                coupon_data:e.target.value
            })
        }

    }

    handleDecrement = () => {
        let count = this.state.people;
        if (count > 0) {
            count--;

        } else {
            count = 0;
        }
        this.setState({
            people: count
        })
    }

    handleIncrement = () => {
        let count = this.state.people;
        if (count <= 100) {
            count++;
            this.setState({
                people: count
            })
        }
    }

    async handleCustomer(e)
    {
            await this.setState({
                cname:e.target.value
            })
    }

    componentWillReceiveProps()
    {
        if(this.props.type=='takeaway' && this.state.people<1)
        {
            this.setState({
                people:1
            })
        }
        if(this.props.type=='home')
        {
            this.setState({
                cname:'table'
            })
        }
    }

    handleReturnButton = () => {
        let dropdown = this.state.dropdown === "hide" ? "show" : "hide";
        this.setState({
            dropdown,
            dropdownCoupon:"hide"
         });
    }

    getDropdownClass() 
    {
        return this.state.dropdown === "hide" ? " hide" : "";
    } 

    handleReturnButtonCoupon = () =>
    {
        let dropdownCoupon = this.state.dropdownCoupon === "hide" ? "show" : "hide";
        this.setState({
            dropdownCoupon,
            dropdown:"hide"
         });
    }

    getDropdownClassCoupon() 
    {
        return this.state.dropdownCoupon === "hide" ? " hide" : "";
    }

    async offerApplyCoupon()
    {
        await this.setState({
            dropdownCoupon:"hide",
            dropdown:"hide",
            offer_given:'coupon',
            member_data:''
         });
         await   this.submitData('Ordered', 'Billed', 'waiting')
    }

    async offerApplyMember()
    {
        await this.setState({
            dropdownCoupon:"hide",
            dropdown:"hide",
            coupon_data:'',
            offer_given:'member'
         });
       await   this.submitData('Ordered', 'Billed', 'waiting')
    }

    async offerApplyGuest()
    {
        await this.setState({
            dropdownCoupon:"hide",
            dropdown:"hide",
            coupon_data:'',
            member_data:'',
            offer_given:'guest'
         });
       await   this.submitData('Ordered', 'Billed', 'waiting')
    }

    render() {
        return (
            <div className="kotContainerFooter">
                <div className="orderTicketButton" >
                    <Modal backdrop="static" show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Choose Room Number</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal >
                                <FormGroup controlId="formHorizontalPassword">
                                    <Col sm={4}>
                                        Room Number
                                    </Col>
                                    <Col sm={4}>
                                        <select className="selectButton" value={this.state.roomid} onChange={(e) => this.changeOrder(e)}>
                                            <option>{"--select--"}</option>
                                            {
                                                this.state.occupied_rooms.map((item, key) => {
                                                    return <option key={key} value={item.rooms_id}>{item.room_num + "-" + item.customer_fname + " " + item.customer_lname}</option>
                                                })
                                            }
                                        </select>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col smOffset={4} sm={2}>
                                        <Button onClick={(e) => this.transferBillToRoom(e)}>
                                            Transfer
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    {!this.state.card && !this.props.bill_id && !this.state.offers &&<Button onClick={this.Order.bind(this)}>
                        Order
                    </Button>}
                    {!this.state.card && this.props.bill_id && !this.state.offers &&<Button /*onClick={this.Order.bind(this)}*/>
                        Bill Over..
                    </Button>}

                     {this.state.offers &&<Button onClick={this.offerApplyGuest.bind(this)}>
                        Guest
                    </Button>}
                    {!this.state.both && this.state.card && <Button onClick={this.cardSelect.bind(this)}>
                        Card
                    </Button>}
                    {this.state.both && this.state.card &&
                        <Button >
                            Enter Cash Amount
                    </Button>}
                 
                </div>
                <div className="chargeBillButtonmk">
                    {!this.state.bill_show && this.state.order_id > 0 && !this.state.offers &&
                        <Button className="chargeBillButtonmk" onFocus={this.printCall.bind(this)}>
                            Print Bill {parseFloat((this.props.total_price) /*+ (((this.props.total_price) * this.props.tax) / 100)*/)}
                        </Button>
                    }
                    {!this.state.bill_show && this.state.order_id === 0 && this.props.type=='home' &&
                        // <textarea id="people" className="people" maxLength={10} value={this.state.people} onChange={this.handleTextAreaChange.bind(this)}/>
                        <div style={{ display: "flex", height: "100%" }}>
                            <div style={{ width: "33%", height: "100%" }} onClick={this.handleIncrement}>
                                <button style={{ width: "100%", height: "100%", padding: "", border: "none", color: "#27ae60" }}><Icon icon={plus} /></button>
                            </div>
                            <div style={{ width: "34%", height: "100%" }}>
                                <button disabled style={{ width: "100%", height: "100%", padding: "", border: "none", color: "white",background:"#27ae60" }}>{this.state.people}</button>
                            </div>
                            {/* <div style={{ width: "34%",height:"100%", textAlign: "center", background: "#27ae60" }}><span style={{ color: "white" }}><h4 style={{ margin: "0" }}>
                                {this.state.people}
                            </h4></span></div> */}
                            <div style={{ width: "33%", height: "100%" }} onClick={this.handleDecrement}>
                                <button style={{ width: "100%", height: "100%", padding: "", border: "none", color: "#27ae60" }}><Icon icon={minus} /></button>

                            </div>
                        </div>
                    }
                     {!this.state.bill_show && this.state.order_id === 0 && this.props.type=='takeaway' &&
                        // <textarea id="people" className="people" maxLength={10} value={this.state.people} onChange={this.handleTextAreaChange.bind(this)}/>
                        <div style={{ display: "flex", height: "100%",width:'100%' }}>
                                <input style={{ padding:"10px",display: "flex", height: "100%",width:'100%' }} maxLength={15} placeholder="   Customer Name" value={this.state.cname} onChange={this.handleCustomer.bind(this)}/>
                        </div>
                    }
                    {!this.state.both && this.state.card &&
                        <Button className="chargeBillButtonmk" onClick={this.cashSelect.bind(this)}>
                            Cash
                    </Button>}
                    {this.state.both && this.state.card &&
                        <textarea style={{ border: "none", background: "lightgrey", padding: "3px", height: "100%" }} className="people" id="cash_amount" value={this.state.cash_amount} onChange={this.handleTextAreaChange.bind(this)} />}
                    <div hidden value="">
                        <div value="componentRef" id="componentRef" ref={el => (this.componentRef = el)}>
                            <Billing
                                bill_no={this.props.bill_id}
                                date={this.props.bill_date_time}
                                kot_list={this.props.printItems}
                                kot_id={this.props.kot_id_list}
                                table_number={this.state.table_number}
                                total_amount={parseFloat(this.props.totalamount)}
                                tax={parseFloat(this.props.tax)}
                                tax_amount={(parseFloat(this.props.totalamount) * parseFloat(this.props.tax)) / 100}
                            />}
                        </div>
                    </div>
                    {this.state.bill_show && !this.state.offers && this.printRender()}
                    {this.state.offers && this.offerRender()}
                    <SweetAlert
                        success title={this.state.alert_message}
                        show={this.state.bill_confirm}
                        onConfirm={() => {
                            this.setState({
                                bill_confirm: false
                            })
                            if(this.props.type=='home')
                            {
                                this.props.history.push("/home");
                            }
                           else if(this.props.type=='takeaway')
                            {
                                this.props.history.push("/takeouts");
                            }
                        }}
                    />

                    <SweetAlert
                        success title={this.state.alert_message}
                        show={this.state.print_confirm}
                        onConfirm={() => {
                            this.setState({
                                print_confirm: false
                            })
                        }}
                    />

                    <SweetAlert
                        success title={this.state.alert_message}
                        show={this.state.alert_state_success}
                        onConfirm={() => {
                            this.setState({
                                alert_state_success: false
                            })
                        }}
                    />

                    <SweetAlert
                        danger title={this.state.alert_message}
                        show={this.state.alert_state_danger}
                        onConfirm={() => {
                            this.setState({
                                alert_state_danger: false
                            })
                        }}
                    />
                    <SweetAlert
                        warning title={this.state.alert_message}
                        show={this.state.alert_state_warning}
                        onConfirm={() => {
                            this.setState({
                                alert_state_warning: false
                            })
                        }}
                    />
                </div>

                {this.state.both && this.state.card &&
                    <Button className="chargeBillButtonmk both" onClick={this.bothUpdate.bind(this)}>
                        Save
                    </Button>}
                {!this.state.both && this.state.card &&
                    <Button className="chargeBillButtonmk both" onClick={this.bothSelect.bind(this)}>
                        Both
                    </Button>}
            </div>
        );
    }
}




// export default withRouter(KOTContFooter);

const mapStateToProps = (state) => {
    return {
        selectedItems: state.selectedItems,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        select: () => {
            dispatch({ type: 'select', selectedItems: [] })
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(KOTContFooter))