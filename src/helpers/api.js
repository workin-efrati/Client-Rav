import axios from "axios";

export const api = async ({ url, method = 'GET', headers = {}, params = {}, body = {} }) => {
    console.log('here api', params);

    const res = await axios({ url: `http://localhost:2500/${url}`, data: body, method, params })
    // {
    // const res = await axios(`http://localhost:2500/${url}`, {
    // method: method,
    // params: params,
    // headers: headers }
    // )
    console.log('res.data ', res.data);

    return res.data
}