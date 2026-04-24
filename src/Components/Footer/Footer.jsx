import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { FaFacebook, FaInstagram, FaSnapchatGhost } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo1} alt="logo" />
                    <p>Fresh ingredients, rich flavors, and a passion for great food. Enjoy a delightful dining experience with every order.</p>
                    <div className="footer-social-icons">
                        <FaFacebook />
                        <FaInstagram />
                        <FaSnapchatGhost />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Company</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>Get In Touch</h2>
                    <ul>
                        <li>+91 76543-98142</li>
                        <li>Contact@raniqak.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">&copy;2021-2024 Rani Qak | All Right Reserved.</p>
        </div>
    )
}

export default Footer

// Footer complete 