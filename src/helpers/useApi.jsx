import { useState, useCallback } from "react";
import axios from "axios";

// בסיס ה-API (קבוע)
const BASE_URL = "http://localhost:2500/";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const logRequest = (method, url, params, body, response, error, enableLogging) => {
    if (!enableLogging) return;

    console.log(
      `%c[API] ${method.toUpperCase()} ${url}`,
      `color: ${error ? "red" : "green"}; font-weight: bold;`,
      {
        params,
        body,
        response,
        error: error ? error.message : null,
      }
    );
  };

  const request = useCallback(async (method, endpoint, { params = {}, body = {}, enableLogging = false } = {}) => {
    setLoading(true);
    setError(null);
    setData(null);

    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await axios({
        method,
        url,
        params,
        data: body,
      });

      setData(response.data);
      logRequest(method, url, params, body, response.data, null, enableLogging);
      return response.data;
    } catch (err) {
      setError(err);
      logRequest(method, url, params, body, null, err, enableLogging);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = () => {
    setData(null);
};

  return {
    loading,
    error,
    data,
    clear,
    get: (endpoint, options) => request("get", endpoint, options),
    post: (endpoint, options) => request("post", endpoint, options),
    put: (endpoint, options) => request("put", endpoint, options),
    del: (endpoint, options) => request("delete", endpoint, options),
  };
};

export default useApi;
