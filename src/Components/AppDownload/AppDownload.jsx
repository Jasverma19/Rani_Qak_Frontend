import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
    return (
        <div className='appdownload' id='app-download'>
            <p>For Better Experience Download <br />Rani_Qak App </p>

            <div className="app-download-platform">
                <img src={assets.Play_Store} alt="" />
                <img src={assets.App_Store} alt="" />
            </div>
        </div>
    )
}

export default AppDownload