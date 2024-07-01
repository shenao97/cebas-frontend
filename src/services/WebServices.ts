const API_HOST = import.meta.env.VITE_API_HOST
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

export const GETData = async (endpoint: string, apiHost = API_HOST) => {
  try {
    const response = await fetch(`${apiHost}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': AUTH_TOKEN
      }
    });
    if (!response || !response.ok) throw new Error("Fetch fail")
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const POSTData = async (endpoint: string, body: Object = {}) => {
  try {
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': AUTH_TOKEN
      },
      body: JSON.stringify(body)
    });
    if (!response) throw new Error("Fetch fail")
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const PUTData = async (endpoint: string, body: Object = {}) => {
  try {
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': AUTH_TOKEN
      },
      body: JSON.stringify(body)
    });
    if (!response) throw new Error("Fetch fail")
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const DELETEData = async (endpoint: string, body: Object = {}) => {
  try {
    const response = await fetch(`${API_HOST}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': AUTH_TOKEN
      },
      body: JSON.stringify(body)
    });
    if (!response || !response.ok) throw new Error("Fetch fail")
    return;
  } catch (err) {
    throw err;
  }
}