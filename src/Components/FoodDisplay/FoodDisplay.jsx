import React, { useContext } from 'react'
import styles from './FoodDisplay.module.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

    const { foodList } = useContext(StoreContext)

    return (
        <div className={styles.foodDisplay} id='food-display'>
            <h2>Top dishes near you</h2>
            <div className={styles.foodDisplayList}>
                {foodList
                    .filter((item) => {
                        if (category === "All") return true;
                        return item.category?.name === category;
                    })
                    .map((item) => ( 
                    <FoodItem
                    key={item._id}
                    _id={item._id}
                    name={item.name}
                    price={item.price}
                    image={`http://localhost:8000/uploads/${item.image}`}
                    description={item.description}
                /> 
                ))}
            </div>
        </div>
    )
}

export default FoodDisplay
