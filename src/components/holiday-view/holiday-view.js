import React, {Component} from "react";
import './holiday-view.css'
import Spinner from "../spinner";


export default class HolidayView extends Component {
    state = {
        holidays: []
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.holidays !== this.props.holidays) {
            this.transformHolidays()
        }

    }

    transformHolidays = () => {
        const {holidays} = this.props


        const resultingHolidays = holidays.reduce((prevItem, currItem) => {
            const dateHoliday = {
                date: currItem.date.iso,
                holidays: [
                    {
                        name: currItem.name,
                        country: currItem.country.name,
                        description: currItem.description
                    }
                ]
            }
            if (prevItem === []) {
                return [...prevItem, dateHoliday]
            }

            const idx = prevItem.findIndex(item => item.date === currItem.date.iso)
            if (idx !== -1) {
                const targetItem = prevItem[idx]
                const addedHoliday = {
                    name: currItem.name,
                    country: currItem.country.name,
                    description: currItem.description
                }
                const resultItem = {
                    ...targetItem,
                    holidays: [...targetItem.holidays, addedHoliday]
                }

                return [...prevItem.slice(0, idx), resultItem, ...prevItem.slice(idx + 1)]
            }
            return [...prevItem, dateHoliday]


        }, [])

        const sortedHolidays = resultingHolidays.sort((a, b) => {
            if (a.date > b.date) {
                return 1;
            }
            if (a.date < b.date) {
                return -1;
            }
            return 0;
        })
        this.setState({
            holidays: sortedHolidays,
        }, () => {
            // console.log('state holidays: ', this.state.holidays)
        })
    }
    renderHolidays = (holidays) => {
        // console.log('rendering holidays:', holidays)
        return holidays.map(item => {
            const datedDate = new Date(item.date)
            const formatedDate = new Intl.DateTimeFormat('en-US', {weekday: "long", month: "short", year: "numeric", day: "numeric"}).format(datedDate)
            return (
                <div className="row" key={item.date}>
                    <div className="container card holidays-card">
                        <div className="row">
                            <div className="col-2 header">
                                <p className=''>{formatedDate}</p>
                            </div>
                            <div className="col-10 container-fluid holiday-body">

                                <table className='table table-dark table-striped holidays-table'>
                                    <thead>
                                    <tr>
                                        <th className=''>Holiday</th>
                                        <th>Country</th>
                                        <th>Description</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {item.holidays.map(({name, country, description}) => {
                                        return (
                                            <tr key={name + '-' + country}>
                                                <td className='holiday-name'>
                                                    <p>
                                                        {name}
                                                    </p>
                                                </td>
                                                <td className='holiday-country'>
                                                    <p>
                                                        {country}
                                                    </p>
                                                </td>
                                                <td className='holiday-description'>
                                                    <p>
                                                        {description}
                                                    </p>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }


    render() {
        const {update, holidays} = this.props


        if (holidays.length === 0 && !update) {
            return (
                <div className='holiday-view'>
                    <p>There is no holidays loaded yet</p>
                </div>
            )
        }
        if (update) {
            return <Spinner/>
        }

        const holidaysView = this.renderHolidays(this.state.holidays)
        return (
            <div className='holiday-view'>

                <div className='container holiday-list '>
                    {holidaysView}
                </div>

            </div>
        )
    }
}
