class Response {
	constructor(){
		this.statusCode = 404;
		this.headers = [{key : 'Content-Length', value: 0}];
	}
	setHeader(key, value) {
    const header = this.headers.find(header => header.key === key);
    if (header) header.value = value;
    else this.headers.push({ key, value })
	}
	
	generateHeadersText() {
		const headersText =  this.headers.map((header) => `${header.key}: ${header.value}`);
		return headersText.join('\r\n');
	}

	write(writable){
		writable.write(`HTTP/1.1 ${this.statusCode}\r\n`);
		writable.write(this.generateHeadersText());
		writable.write('\r\n\r\n');
		this.body && writable.write(this.body);
	}
}

module.exports = Response;