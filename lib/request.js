const abstractValue = (text) => {
  let value = text.replace('+',' ');
  value = value.replace('%0D%0A','\n');
  return value;
};

const pickupParams = (keyValuePairs, keyValue) => {
  console.log(keyValuePairs);
  console.log(keyValue);
  
  const [key, value] = keyValue.split('=');
  keyValuePairs[key] = abstractValue(value);
  return keyValuePairs;
};

const getQueryParams = (keyValuePairs) => keyValuePairs.split('&').reduce(pickupParams, {});

const parseUrlAndQueryParameters = (entireUrl) => {
  const [url, queryBody] = entireUrl.split('?');
  const query = queryBody && getQueryParams(queryBody);
  return {url, query};
}

const parseHeaderAndBody = function(headersAndBody, line ){
  if(line === '') {
    headersAndBody.body = '';
    return headersAndBody;
  }
  if('body' in headersAndBody) {
    headersAndBody.body += line;
    return headersAndBody;
  }
  const [key, value] = line.split(':');	
  headersAndBody.headers[key] = value;
  return headersAndBody;
};

class Request {
	constructor(method, url, headers, body, query){
		this.method = method;
		this.url = url;
    this.headers = headers;
    this.body = body;
    this.query = query;
	}

	static parse(requestText) {
    console.log('req Text\n',requestText);
		const [request, ...headersAndBody] = requestText.split('\r\n');
    const [method, entireUrl, protocol] = request.split(' ');
    const {url, query} = parseUrlAndQueryParameters(entireUrl);
    let {headers, body} = headersAndBody.reduce(parseHeaderAndBody, { headers : {} });
    if(headers['Content-Type'] == ' application/x-www-form-urlencoded') {
      body = getQueryParams(body);
    } 
    const req = new Request(method, url, headers, body, query);
    console.log(req);
		return req;
	}
}

module.exports = Request;