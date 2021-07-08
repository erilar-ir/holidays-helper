import allCountries from "./all-counrties";


export default class GetAllCountries {

    getAllCountries = () => {
        return allCountries
    }


    getByCurrency = (currency, countries = allCountries) => {
        if (currency.toLowerCase() === 'usd'){
            return countries.filter(country => country.alpha2Code === 'US')
        }
        if (currency.toLowerCase() === 'gbp'){
            return countries.filter(country => country.alpha2Code === 'GB')
        }
        if (currency.toLowerCase() === 'eur'){
            return countries.filter(country => country.alpha2Code === 'DE')
        }
        if (currency.toLowerCase() === 'aud'){
            return countries.filter(country => country.alpha2Code === 'AU')
        }
        if (currency.toLowerCase() === 'xof'){
            return countries.filter(country => country.alpha2Code === 'BJ')
        }
        if (currency.toLowerCase() === 'bwp') {
            return countries.filter(country => country.alpha2Code === 'BW')
        }
        if (currency.toLowerCase() === 'nok') {
            return countries.filter(country => country.alpha2Code === 'NO')
        }
        if (currency.toLowerCase() === 'bnd') {
            return countries.filter(country => country.alpha2Code === 'BN')
        }
        if (currency.toLowerCase() === 'xaf') {
            return countries.filter(country => country.alpha2Code === 'CM')
        }
        if (currency.toLowerCase() === 'nzd') {
            return countries.filter(country => country.alpha2Code === 'NZ')
        }
        if (currency.toLowerCase() === 'ang') {
            return countries.filter(country => country.alpha2Code === 'CW')
        }
        if (currency.toLowerCase() === 'dkk') {
            return countries.filter(country => country.alpha2Code === 'DK')
        }
        if (currency.toLowerCase() === 'xpf') {
            return countries.filter(country => country.alpha2Code === 'PF')
        }
        if (currency.toLowerCase() === 'ils') {
            return countries.filter(country => country.alpha2Code === 'IL')
        }
        if (currency.toLowerCase() === 'chf') {
            return countries.filter(country => country.alpha2Code === 'CH')
        }
        if (currency.toLowerCase() === 'mad'){
            return countries.filter(country => country.alpha2Code === 'MA')
        }
        if (currency.toLowerCase() === 'jpy'){
            return countries.filter(country => country.alpha2Code === 'JP')
        }
        if (currency.toLowerCase() === 'dzd'){
            return countries.filter(country => country.alpha2Code === 'DZ')
        }

        // console.log(`Currency in service: ${currency}`)
        return countries.filter(country => {
            return country.currencies.find(item => {
                return item.code === currency
            })
        })

    }

}
