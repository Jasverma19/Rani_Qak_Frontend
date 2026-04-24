import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ExploreMenu.module.css';

const ExploreMenu = ({ category, setCategory }) => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/category/all");
                setCategories(res.data.categories);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className={styles.exploreMenu} id='explore-menu'>
            <hr />

            <h1>Explore our menu</h1>

            <div className={styles.exploreMenuList}>
                {Array.isArray(categories) && categories.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.exploreMenuListItem} ${category === item.name ? styles.active : ""}`}
                        onClick={() => setCategory(item.name)}
                    >
                        <img src={`http://localhost:8000/uploads/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>

            <hr />
        </div>
    );
}

export default ExploreMenu;