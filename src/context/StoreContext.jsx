import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});

    // ---------------- FETCH FOODS ----------------
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/food/all");
                setFoodList(res.data.foods);
            } catch (error) {
                console.log(error);
            }
        };
        fetchFoods();
    }, []);

    // ---------------- CART LOGIC ----------------
    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedQty = Math.max((prev[itemId] || 0) - 1, 0);

            return {
                ...prev,
                [itemId]: updatedQty,
            };
        });
    };

    // ---------------- TOTAL AMOUNT ----------------
    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = foodList.find(
                    (product) => product._id === item
                );

                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    };

    // ---------------- CART COUNT (AUTO CALCULATED) ----------------
    const cartCount = Object.values(cartItems).reduce(
        (total, qty) => total + qty,
        0
    );

    // ---------------- CONTEXT VALUE ----------------
    const contextValue = {
        foodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,

        // CART COUNT (FIXED)
        cartCount,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;