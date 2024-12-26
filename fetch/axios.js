import axios from 'axios'

axios.defaults.baseURL = '/api'
function axiosDefaultConfig(config) {
    Object.entries(config).forEach(e => {
        const [ key, val ] = e

        axios.defaults[key] = val
    })
}

function onFetchErr(err) {
    console.error(err)
    return Promise.reject(err)
}

function axiosInterceptors({ request, requestError, response, responseError }) {
    axios.interceptors.request.use(request, requestError ?? onFetchErr)
    axios.interceptors.response.use(response, responseError ?? onFetchErr)
}

export default axios

export {
    axiosInterceptors,
    axiosDefaultConfig,
    onFetchErr
}
