export default class HolidayService {

    _key = process.env.REACT_APP_CALENDARIFIC_API

    _apiBase = 'https://calendarific.com/api/v2/holidays'


    async getResource(url) {

        const res = await fetch(`${this._apiBase}?&api_key=${this._key}${url}`)
        if (!res.ok) {
            throw Error(`Could not fetch ${url}, received ${res.status}`)
        }
        // console.log(res)
        return await res.json()
    }

    // getHolidays = async (country, year) => {
    //     return  mockHolidays
    // }
    getHolidays = async (country, year) => {
        const type = 'national'
        return await this.getResource(`&country=${country}&year=${year}&type=${type}`)
            .then(res => {
                // console.log('response holidays', res.response.holidays)
                return  res.response.holidays

            }).catch(err => {
                throw Error(`Something wrong with country: ${country} and year: ${year}, received: ${err}`)
            })

    }



}
