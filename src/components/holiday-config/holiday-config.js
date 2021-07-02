import React, {Component} from "react";
import './holiday-config.css'


export default class HolidayConfig extends Component {
    state = {
        countries: [],
        currencyHelper: [],
        countryCodes: [],
        requestWarning:''

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

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
        // const {countries, currencyHelper, countryCodes} = this.state
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
            <div className='col-6 container jumbotron align-content-center holiday-config'>
                <div className="">
                    <p className='validation-message'>{validationMessage}</p>
                    <p className='validation-message'>{requestWarning}</p>
                    <ul className='currency-helper'>
                        {currencies}
                    </ul>
                </div>
              <div className="row ">
                  <div className='col-6 dates form-group'>
                      <label id='startDateLabel' htmlFor='startDate' className='form-label'>
                          Start Date
                          <input id='startDate' type="text" name='startDateSelect' placeholder='MM/DD/YYYY'
                                 className='form-control form-control-sm'
                                 onChange={verifyDate}/>
                      </label>
                      <label id='endDateLabel' htmlFor='endDate'>
                          End Date
                          <input id='endDate' type="text" name='endDateSelect' placeholder='MM/DD/YYYY'
                                 className='form-control form-control-sm'
                                 onChange={verifyDate}/>
                      </label>

                  </div>
                  <div className="col-6 currencies form-group  d-flex justify-content-end ">
                      <div className="currency container-fluid">
                          <label id='currencyLabel' htmlFor='currencySelect'>
                              Currencies
                              <input id='currency' name='currencySelect' type="text" placeholder='USD'
                                     className='form-control form-control-sm '
                                     value={currencyText}
                                     onChange={verifyCurrency}
                                  // onKeyUp={event => event.key === 'Enter' ? this.onCurrencySelect() : null}
                              />
                          </label>
                      </div>

                      <div className="includes form-check-inline ">
                          <label id='usCheck' htmlFor='usCheck'   className={checkedUs}>
                              USD
                              <input id='usCheck' type="checkbox" name='usCheck'
                                     className='  form-control-sm '
                                     checked={usChecked}
                                     onChange={addUSandEUHolidays}/>
                          </label>
                          <label id='eurCheck' htmlFor='eurCheck' className={checkedEu}>
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
                    <div className='buttons form-group d-flex '>
                        <button className="get-holidays-btn btn btn-primary" disabled={disableRequest || requestOverhead}
                                onClick={() => getHolidays(countryCodes, years)}>Get Holidays
                        </button>
                    </div>
                </div>


                {/*<button className="btn btn-primary" onClick={this.onCurrencySelect}>Set Holiday Config</button>*/}


            </div>
        );
    }
}
