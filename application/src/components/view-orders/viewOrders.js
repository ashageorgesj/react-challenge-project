import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

class ViewOrders extends Component {
    state = {
        orders: []
    }

    componentDidMount() {
        fetch(`${SERVER_IP}/api/current-orders`)
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    this.setState({ orders: response.orders });
                } else {
                    console.log('Error getting orders');
                }
            });
    }
    handleEdit(event) {
        event.preventDefault()
        console.log(event)

    }
    handleDelete(key){
        console.log(key)
        
        fetch(`${SERVER_IP}/api/delete-order`,{
            method:'POST',
            body: JSON.stringify({
                'id':key
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            if (response.success){
                console.log('Success deleting order')
                let orders = this.state.orders.filter((order)=>{
                    return order._id !== key
                });
                this.setState(state =>{
                    state.orders = orders;
                    return state
                })
            } else{
                console.log('Error deleting order');
            }
        })
        .catch(error => console.error(error));
    }

    render() {
        return (
            <Template>
                <div className="container-fluid">
                    {this.state.orders.map(order => {
                        const createdDate = new Date(order.createdAt).toLocaleTimeString();
                        return (
                            <div className="row view-order-container" key={order._id}>
                                <div className="col-md-4 view-order-left-col p-3">
                                    <h2>{order.order_item}</h2>
                                    <p>Ordered by: {order.ordered_by || ''}</p>
                                </div>
                                <div className="col-md-4 d-flex view-order-middle-col">
                                    <p>Order placed at {createdDate}</p>
                                    <p>Quantity: {order.quantity}</p>
                                 </div>
                                 <div className="col-md-4 view-order-right-col">
                                     <button className="btn btn-success" onClick={(event) => this.handleEdit(event)}>Edit</button>
                                     <button className="btn btn-danger" onClick={() => {this.handleDelete(order._id)}}>Delete</button>
                                 </div>
                            </div>
                        );
                    })}
                </div>
            </Template>
        );
    }
}

export default ViewOrders;
