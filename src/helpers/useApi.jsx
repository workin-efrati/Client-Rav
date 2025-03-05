import { useEffect, useState } from "react"
import { api } from "./api"

function useApi({url, method = 'GET', params = {}, headers = {}, body={}}) {
    
    const request = { url, method, headers, params, body }
    
    const [data, setData] = useState()
    const href = window.location.href;

    useEffect(() => {
        api(request)
            .then((res) => setData(res))
            .catch((error) => {
                console.log("useApi error --> ", error.message);
            })
    }, [href])

    return data
}

export default useApi;