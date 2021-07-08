import React, {Component} from "react";
import tippy, {inlinePositioning, sticky} from "tippy.js";
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/themes/material.css'
import './holiday-config.css'

export default class HolidayConfig extends Component {
    constructor() {
        super();
        this.tippyRef = React.createRef()
    }

    state = {
        countries: [],
        currencyHelper: [],
        countryCodes: [],
        requestWarning: '',
        infoTips: [
            {
                place: 'top',
                id: 'startDate',
                title: 'Dates',
                text: 'Write start date digits in next order: month, day, year. Use / or . separator. Like it shown on placeholder. <span class="yellow-text">End date should be later than start date.</span>'
            },
            {
                place: 'top-start',
                id: 'currency',
                title: 'Currencies pair',
                text: 'Write currencies inline like: uahazn.  <br /> Case insensitive. '
            },
            {
                place: 'bottom',
                id: 'usCheck',
                title: 'USD',
                text: 'Includes USD to request.'
            },
            {
                place: 'right',
                id: 'eurCheck',
                title: 'EUR',
                text: 'Includes EUR to request.'
            },
            {
                place: 'bottom-end',
                id: 'buttons',
                title: 'Some Limits',
                text: 'There is max length of request set to <span class="yellow-text">4 currencies</span> (including both checkboxes) and <span class="yellow-text">2 years.</span>  So the summary request should not be more than 6.'
            },

        ]
    }

    componentDidMount() {
        this.createTippys()

    }

    createTippys = () => {

        const {infoTips} = this.state

        const tippyContentTemplate = (title, text) => {
            return `<div><div class='tippy-title'>${title}</div><div class='tippy-body'>${text}</div></div>`
        }

        tippy(`.fa-info-circle`, {
            allowHTML: true,
            theme: 'material',
            placement: 'left',
            trigger: 'mouseenter focus',
            content: 'Click to view help about usage',

        })

        infoTips.forEach(({id, title, text, place}) => {

            tippy(`#${id}`, {
                triggerTarget: this.tippyRef.current,
                allowHTML: true,
                animation: 'shift-away',
                theme: 'material',
                placement: place,
                trigger: 'click',
                maxWidth: 350,
                inlinePositioning: true,
                moveTransition: 'transform 0.2s ease-out',

                sticky: 'false',
                plugins: [
                    inlinePositioning,
                    sticky,
                    // animateFill
                ],
                content: tippyContentTemplate(title, text)


            })
        })

    }


    renderCurrencyHelper = (currencyHelper) => {
        if (currencyHelper.length) {
            return currencyHelper.map(({currency, ok}) => {
                const classNames = ok ? 'success' : 'no-country'
                return (
                    <li key={currency} className={`currency-item ${classNames}`}>{currency.toUpperCase()}</li>
                )
            })
        }
    }


    render() {
        const {
            getHolidays,
            verifyDate,
            verifyCurrency,
            validationMessage,
            requestWarning,
            currencyHelper,
            countryCodes,
            years,
            disableRequest,
            addUSandEUHolidays,
            usChecked,
            euChecked,
            currencyText
        } = this.props
        const currencies = this.renderCurrencyHelper(currencyHelper)
        const requestOverhead = requestWarning.length > 0

        const checkedUs = usChecked ? 'include-on' : ''
        const checkedEu = euChecked ? 'include-on' : ''


        return (

            <div className='col-sm-6 container jumbotron align-content-center holiday-config'>

                <div className="row">
                    <div className='info-center' ref={this.tippyRef}>
                        <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="message-container">
                        <p className='validation-message'>{validationMessage}</p>
                        <p className='validation-message'>{requestWarning}</p>
                        <ul className='currency-helper'>
                            {currencies}
                        </ul>
                    </div>
                </div>

                <div className="row form-group">
                    <div className='col-lg-6 dates'>
                        <label id='startDateLabel' htmlFor='startDate' className='form-label'>
                            Start Date

                            <input id='startDate' type="text" name='startDateSelect' placeholder='MM/DD/YYYY'
                                   className='form-control form-control-sm'
                                   onChange={verifyDate}/>
                        </label>
                        <label id='endDateLabel' htmlFor='endDate'>
                            End Date
                            <input
                                id='endDate' type="text"
                                name='endDateSelect'
                                placeholder='MM/DD/YYYY'
                                className='form-control form-control-sm'
                                onChange={verifyDate}
                            />
                        </label>

                    </div>
                    <div className="col-lg-6 currencies d-flex justify-content-end ">
                        <div className="container-fluid currency">
                            <label id='currencyLabel' htmlFor='currencySelect'>
                                Currencies
                                <input
                                    id='currency'
                                    name='currencySelect'
                                    type="text"
                                    placeholder='USD'
                                    className='form-control form-control-sm '
                                    value={currencyText}
                                    onChange={verifyCurrency}
                                />
                            </label>
                        </div>

                        <div className="includes form-check-inline ">
                            <label htmlFor='usCheck' className={checkedUs}>
                                USD
                                <input id='usCheck' type="checkbox" name='usCheck'
                                       className='  form-control-sm '
                                       checked={usChecked}
                                       onChange={addUSandEUHolidays}/>
                            </label>
                            <label htmlFor='eurCheck' className={checkedEu}>
                                EUR
                                <input id='eurCheck' type="checkbox" name='eurCheck'
                                       className=' form-control-sm'
                                       checked={euChecked}
                                       onChange={addUSandEUHolidays}/>
                            </label>
                        </div>


                    </div>


                </div>
                <div className="row">
                    <div id='buttons'
                         className='buttons form-group d-flex '>
                        <button id='getHolidays'
                                className="btn btn-success get-holidays-btn "
                                disabled={disableRequest || requestOverhead}
                                onClick={() => getHolidays(countryCodes, years)}>Get Holidays
                        </button>
                    </div>
                </div>




            </div>
        );
    }
}
