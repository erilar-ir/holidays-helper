import './App.css';
import Header from "../header";
import HolidayConfig from "../holiday-config";
import HolidayView from "../holiday-view";
import React, {Component} from "react";
import {GetAllCountries, HolidayService} from "../../services";
import {default as isValidDate} from "pretty-easy-date-check/dist/isValidDate";
import ErrorBoundary from "../error-boundary";

const {getHolidays} = new HolidayService()
const {getByCurrency} = new GetAllCountries()

export default class App extends Component {


    state = {
        countries: [],
        currencyText: '',
        currencyHelper: [],
        countryCodes: [],
        holidays: [],
        dateError: '',
        disableRequest: true,
        validationMessage: '',
        requestWarning: '',
        startDate: '',
        endDate: '',
        years: [],
        update: false,
        eurCheck: false,
        usCheck: false
    }


    verifyDate = async (event) => {
        const dateString = event.target.value
        const inputId = event.target.id

        const validDate = isValidDate(dateString)

        if (validDate === false) {

            return this.setState({
                validationMessage: `Date for ${inputId} is wrong`,
                disableRequest: true,
            })
        }
        const dateParse = new Date(dateString)


        await this.setState({
            [inputId]: dateParse,
            validationMessage: ''
        })

        const years = this.processDates()
        if (years.length > 0) {
            this.setState({
                years
            })
        }
        this.checkRequestLength()


    }

    processDates = () => {


        const {startDate, endDate} = this.state

        if (startDate.length === 0 || endDate.length === 0) {
            return []
        }

        if (startDate > endDate) {
            this.setState({
                validationMessage: 'Start Date should be earlier then End Date '
            })
            return []
        }
        this.setState({
            validationMessage: ''
        })
        if (startDate.getFullYear() === endDate.getFullYear()) {
            return [startDate.getFullYear()]
        }
        let allYears = []
        for (let index = startDate.getFullYear(); index <= endDate.getFullYear(); index++) {
            allYears.push(index)
        }
        return allYears

    }

    currencyTransform = async (str) => {

        const currencyText = str.match(/.{1,3}/g) || [];
        const setOfCurrencies = new Set(currencyText)
        let uniqueCurrencies = [...setOfCurrencies]
        if (uniqueCurrencies.some(item => item.toLowerCase() === 'usd')) {
            this.setState({
                usCheck: true
            })
            uniqueCurrencies = uniqueCurrencies.filter(item => item.toLowerCase() !== 'usd')
        }
        if (uniqueCurrencies.some(item => item.toLowerCase() === 'eur')) {
            this.setState({
                eurCheck: true
            })
            uniqueCurrencies = uniqueCurrencies.filter(item => item.toLowerCase() !== 'eur')
        }

        const stringedCurrencies = uniqueCurrencies.join('')

        this.setState({
            currencyText: stringedCurrencies
        })
        await this.processCurrency(uniqueCurrencies)
    }

    processCurrency = async (currencies) => {
        let countries = []
        let currencyHelper = []
        currencies.forEach(item => {

            if (item.length < 3) {
                return null
            }

            const fetchedCountries = getByCurrency(item.toUpperCase())

            if (fetchedCountries.length === 0) {
                return currencyHelper = [...currencyHelper, {currency: item, ok: false}]
            }


            const filteredCountries = fetchedCountries.filter(item => {
                if (countries.length === 0) {
                    return true
                }
                return !countries.some(el => el.alpha2Code === item.alpha2Code);

            })

            currencyHelper = [...currencyHelper, {currency: item, ok: true}]
            return countries = [...countries, ...filteredCountries]

        })
        const stateCountries = countries
        const countryCodes = countries.map(country => {
            return country.alpha2Code
        })


        await this.setState(() => {
                return {
                    countries: stateCountries,
                    currencyHelper,
                    countryCodes
                }
            }
        )
        this.checkRequestLength()
    }

    verifyCurrency = async (event) => {

        //Verify currency string here
        const str = event.target.value.replace(/\s|\d/g, "");


        await this.currencyTransform(str)

    }

    addUSandEUHolidays = (event) => {
        const name = event.target.name
        const checked = event.target.checked

        this.setState({
            [name]: checked
        })
        this.checkRequestLength()
    }

    getHolidays = async (countryCodes, years) => {
        const {usCheck, eurCheck} = this.state

        await this.setState({
            holidays: [],
            update: true
        })

        let countries = countryCodes

        //check if it's a USD or EUR holidays include checked
        if (usCheck && !countries.includes('US')) {
            countries.push('US')
        }
        if (eurCheck && !countries.includes('DE')) {
            //adding Germany for euro holidays as it national holidays contains all euro bank holidays
            countries.push('DE')
        }


        for (const country of countries) {
            for (const year of years) {
                await getHolidays(country, year)
                    //check if country is Germany (returned for EUR currency) and filter its holidays to leave only EU bank holidays
                    .then(res => {
                        if (country === 'DE') {
                            const filterList = [
                                'new year',
                                'good friday',
                                'easter',
                                'labor',
                                'christmas'
                            ]
                            return res.filter(({
                                                   name,
                                                   description
                                               }) => filterList.some(element => name.toLowerCase().includes(element)) || filterList.some(element => description.toLowerCase().includes(element)))

                        }

                        //check if country is Cameroon (returned for XAF currency) and filter its holidays to leave only XAF bank holidays
                        if (country === 'CM') {
                            const filterList = [
                                'new year',
                                'youth',
                                'good friday',
                                'easter',
                                'labor',
                                'labour',
                                'ascension',
                                'assumption',
                                'prophet',
                                'christmas'
                            ]
                            return res.filter(({
                                                   name,
                                                   description
                                               }) => filterList.some(element => name.toLowerCase().includes(element)) || filterList.some(element => description.toLowerCase().includes(element)))

                        }
                        //check if country is Benin (returned for XOF currency) and filter its holidays to leave only West African Official bank holidays

                        if (country === 'BJ') {
                            const filterList = [
                                'new year',
                                'easter',
                                'labor',
                                'eid-al-fitr',
                                'eid al fitr',
                                'whit',
                                'tabaski',
                                'independence',
                                'assumption',
                                'mawlid',
                                'all saints',
                                'national peace',
                                'christmas',
                            ]
                            return res.filter(({
                                                   name,
                                                   description
                                               }) => filterList.some(element => name.toLowerCase().includes(element)) || filterList.some(element => description.toLowerCase().includes(element)))

                        }
                        return res
                    })
                    .then(async response => {
                        const {holidays, startDate, endDate} = this.state
                        // check if its satisfying start and end date conditions
                        const filteredHolidays = response.filter(holiday => {
                            const holidayDate = new Date(holiday.date.iso)
                            return holidayDate > startDate && holidayDate < endDate;
                        })
                        //append it to state
                        const updatedHolidays = [...holidays, ...filteredHolidays]
                        await this.setState(() => {
                            return {
                                holidays: updatedHolidays
                            }
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            }
        }
        await this.setState({
            update: false
        })

    }


    checkRequestLength = () => {
        const {countryCodes, years, usCheck, eurCheck, currencyHelper} = this.state

        const usNum = usCheck ? 1 : 0
        const euNum = eurCheck ? 1 : 0

        //get currencies for exclusion
        const currencies = currencyHelper.map(item => item.currency)
        const currenciesExclusion = ['XCD']

        const summary = countryCodes.length + years.length + usNum + euNum

        let requestWarning = ''

        //check if its not exclusion scenario
        if (currencies.some(item => currenciesExclusion.includes(item))) {
            if (summary > 12) {
                requestWarning = 'Too many potential requests'
            }
        }
        if (!currencies.some(item => currenciesExclusion.includes(item))) {
            if (summary > 6) {
                requestWarning = 'Too many potential requests'
            }
        }

        this.setState({
            requestWarning
        })
    }


    render() {
        const {
            holidays,
            validationMessage,
            countries,
            countryCodes,
            currencyHelper,
            years,
            update,
            usCheck,
            eurCheck,
            currencyText,
            requestWarning
        } = this.state
        // console.log('update value', this.state.update)
        const disableRequest = () => {
            if (validationMessage.length > 0) {
                return true
            }
            return !(countryCodes.length > 0 && years.length > 0);
        }


        return (
            <div className='App container-fluid'>
                <ErrorBoundary>
                    <Header/>
                    <HolidayConfig
                        getHolidays={this.getHolidays}
                        // getHolidays2={this.getHolidays2}
                        verifyDate={this.verifyDate}
                        disableRequest={disableRequest()}
                        validationMessage={validationMessage}
                        currencyHelper={currencyHelper}
                        countryCodes={countryCodes}
                        years={years}
                        countries={countries}
                        verifyCurrency={this.verifyCurrency}
                        addUSandEUHolidays={this.addUSandEUHolidays}
                        usChecked={usCheck}
                        euChecked={eurCheck}
                        currencyText={currencyText}
                        requestWarning={requestWarning}
                    />
                    {/*<button className="btn btn-danger" onClick={this.getMultipleCountriesTemp}>Get Multiple Countries for Currencies </button>*/}
                    <HolidayView holidays={holidays} update={update}/>
                </ErrorBoundary>
            </div>
        );
    }
}

