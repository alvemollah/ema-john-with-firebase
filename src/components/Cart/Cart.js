import React from 'react';

const Cart = (props) => {
    const cart = props.cart;

    // const total = cart.reduce((total, prd) => total + prd.price ,0);

    let total = 0;
    for(let i = 0; i < cart.length;i++){
        const product = cart[i];
        total = total + product.price;
    }

    let shipping = 0;
    if(total > 35){
        shipping = 0;
    }
    else if(total > 14){
        shipping = 4.44;
    }
    else if(total > 0){
        shipping = 12.33;
    }

    const tax = total / 5;
    const grandTotal = (total + shipping + Number(tax)).toFixed(2);

    const formatNumber = num => {
        const pression = num.toFixed(2);
        return Number(pression);
    } 

    return (
        <div>
            <h1>Order Summary</h1>
            <p>Items Ordered : {cart.length}</p>
            <p>Product Price: {formatNumber(total)}</p>
            <p>Shipping : ${shipping}</p>
            <p>Tax : ${formatNumber(tax)}</p>
            <p>Total Price : ${grandTotal}</p>
        </div>
    );
};

export default Cart;