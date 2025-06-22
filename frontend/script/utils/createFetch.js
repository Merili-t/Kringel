// Do not toutch this code or you owe me a bottle of Jim Beam

const createFetch = async (route, method, data) => {
  // let url = import.meta.env.VITE_API_URL;
  let url = 'https://ca-kringel-backend.greenrock-bc4cc8f3.northeurope.azurecontainerapps.io';
  let fetchOptions = {
    credentials: 'include',
  };

  let stringArr = route.split('/');
  route = stringArr.join('/');

  if (['GET', 'DELETE'].includes(method.toUpperCase()) && ['string', 'number', 'undefined'].includes(typeof data)) {
    url += route + (data !== undefined ? `/${data}` : '');

    if(method.toUpperCase() === 'DELETE') {
      fetchOptions.method = 'DELETE';
    }
  }
  
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && data) {
    url += route;
    fetchOptions.method = method.toUpperCase();

    if(data instanceof FormData){
      fetchOptions.body = data;
    } else if(data instanceof Object){
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify(data);
    }
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