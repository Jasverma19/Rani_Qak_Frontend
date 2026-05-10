import React from 'react'
import styles from './Footer.module.css'
import { assets } from '../../assets/assets'
import { FaFacebook, FaInstagram, FaSnapchatGhost } from 'react-icons/fa'
import { MdPhone, MdEmail, MdAccessTime } from 'react-icons/md'

const Footer = () => {
    return (
        <footer className={styles.footer} id='footer'>
            <div className={styles.inner}>

                <div className={styles.grid}>

                    <div className={styles.brand}>
                        <img src={assets.logo} alt='Rani Oak logo' className={styles.logo} />
                        <p className={styles.tagline}>
                            Fresh ingredients, rich flavors, and a passion for great food —
                            delivered to your door.
                        </p>
                        <div className={styles.socials}>
                            <a href='#' aria-label='Facebook' className={styles.socialBtn}><FaFacebook /></a>
                            <a href='#' aria-label='Instagram' className={styles.socialBtn}><FaInstagram /></a>
                            <a href='#' aria-label='Snapchat' className={styles.socialBtn}><FaSnapchatGhost /></a>
                        </div>
                    </div>

                    <div className={styles.col}>
                        <h3 className={styles.colHead}>Company</h3>
                        <ul className={styles.links}>
                            <li><a href='#'>Home</a></li>
                            <li><a href='#'>About us</a></li>
                            <li><a href='#'>Delivery</a></li>
                            <li><a href='#'>Privacy</a></li>
                        </ul>
                    </div>

                    <div className={styles.col}>
                        <h3 className={styles.colHead}>Get in touch</h3>
                        <ul className={styles.contactList}>
                            <li>
                                <MdPhone className={styles.contactIcon} />
                                <span>+91 76543-98142</span>
                            </li>
                            <li>
                                <MdEmail className={styles.contactIcon} />
                                <span>contact@raniqak.com</span>
                            </li>
                            <li>
                                <MdAccessTime className={styles.contactIcon} />
                                <span>11am – 11pm, daily</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <hr className={styles.divider} />

                <div className={styles.bottom}>
                    <p className={styles.copyright}>© 2021–2026 Rani Oak. All rights reserved.</p>
                    <div className={styles.legal}>
                        <a href='#'>Privacy</a>
                        <a href='#'>Terms</a>
                        <a href='#'>Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer