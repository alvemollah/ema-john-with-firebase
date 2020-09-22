import React from 'react';
import './Product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const Product = (props) => {
    // console.log(props.product)
    const { name, price, img,seller, stock, key } = props.product;
    return (
        <div className="product">
            <div>
                <img src={img} alt="" />
            </div>
            <div>
                <h4 className="product-name"><Link to={"/product/" + key}> {name} </Link></h4>
                <br />
                <p><small>by:{seller}</small></p>
                <br/>
                <h4>Price:${price}</h4>
                <p><small>only {stock} left in stock - order soon</small></p>
                {props.showAddToCart === true && <button className="main-button" onClick={() => props.handleAddProduct(props.product)} > 
                <FontAwesomeIcon icon={faShoppingCart} /> add to cart
                </button>}
            </div>
        </div>
    );
};

export default Product;