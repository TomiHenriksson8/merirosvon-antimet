import { MenuItem } from "../../interfaces/MenuItem";

const attachAddToCartListener = () => {
    const addToCartElements = document.querySelectorAll('.add-to-cart');

    addToCartElements.forEach((addToCart) => {
        addToCart.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('clicked add to cart');
        });
    });
};

const addToCart = async (id: MenuItem) => {};


export { attachAddToCartListener };
