import React from 'react'
import './error-view.css'
import icon from  './Death-Star-2nd-icon.png'

const ErrorView = () => {
    return (
        <div className='center-planet'>
            <div className='error-view'>
                <img src={icon} alt="error icon"/>
                <span className='boom'>BOOM!</span>
                <span className='error-message'>
                Something has gone wrong.
            </span>
                <span>
                (but we already sent drones to fix it)
            </span>
            </div>
        </div>

    )
}

export default ErrorView
