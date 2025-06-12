// Do not toutch this code or you owe me a bottle of Jim Beam

const createFetch = async (route, method, data) => {
  let url = import.meta.env.VITE_API_URL;
  let fetchOptions = {
    credentials: 'include',
  };

  let stringArr = route.split('/');
  route = stringArr.join('/');

  if (method.toUpperCase() === 'GET' && ['string', 'number', 'undefined'].includes(typeof data)) {
    url += route + (data !== undefined ? `/${data}` : '');
  }
  
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && data && data instanceof Object) {
    url += route;
    fetchOptions.method = 'POST';
    fetchOptions.headers = { 'Content-Type': 'application/json' };
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, fetchOptions);
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: 'Fetch failed' };
  }
};

export default createFetch;