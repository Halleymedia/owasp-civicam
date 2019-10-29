const axios = require('axios');
const https = require('https');
const restApiHost = 'api.civicam.it';
const restApiBasePath = '/test/v1/';
require('dotenv').config();

class Client {
    constructor(authentication) {
        this.authentication = new String(authentication || '');
        this.host = new String(restApiHost);
        this.basePath = new String(restApiBasePath);
    }

    async get(path, headers) {
        return await request(this, 'get', path, null, headers);
    }

    async post(path, body, headers) {
        return await request(this, 'post', path, body, headers);
    }

    async put(path, body, headers) {
        return await request(this, 'put', path, body, headers);
    }

    async delete(path, body, headers) {
        return await request(this, 'delete', path, body, headers);
    }

    async login() {
        return await this.get('/tenants');
    }
}

const publicApi = {
    anonymous: () => Object.freeze(new Client()),
    authenticated: (credentials) => {
        if (credentials) {
            if (!credentials.includes(' ')) {
                throw 'The authentication credentials must include a space as a separator for Scheme and Value';
            }
        } else  {
            const apiKey = process.env.CIVICAM_API_KEY;
            if (!apiKey) {
                throw 'API Key not found, couldn\'t make authenticated requests.';
            }
            credentials = `ApiKey ${apiKey}`;
        }
        return Object.freeze(new Client(credentials));
    }
};


async function request(client, method, path, body, customHeaders) {
    if (!client || !method)
    {
        throw 'Cannot make a request: client or method missing';
    }
    const url = makeUrl(client, path);
    const headers = makeHeaders(client, customHeaders, method, body);
    const config = makeConfig(method, url, headers, body);

    try {
        const response = await axios.request(config);
        return Object.freeze(new WebRequestResult(response));
    } catch (e) {
        throw e.message;
    }
}

class WebRequestResult {
    constructor(response) {
        const { request } = response;

        this.request = Object.freeze(new ClientRequest(request));
        this.response = Object.freeze(new ServerResponse(response));
        this.secure = new Boolean(('encrypted' in request.socket) && request.socket.encrypted);

        const certificate = request.socket.getPeerCertificate(true);
        this.certificate = this.secure ? Object.freeze(new ServerCertificate(certificate)) : null;
        this.tls = this.secure ? Object.freeze(new ServerTls(request.socket)) : null;
    }
}

class ClientRequest {
    constructor(request) {
        this.method = new String(request.method);
        this.path = new String(request.path);
        this.port = new Number(request.socket.remotePort);
        this.host = new String(request.socket.servername);
        this.protocol = new String(request.agent.protocol.replace(':', ''));

        this.headers = {};
        const headers = request.getHeaders();
        for (const headerName in headers) {
            const originalHeaderName = request._headerNames[headerName];
            this.headers[originalHeaderName] = headers[headerName];
        }
    }
}
class ServerResponse {
    constructor(response) {
        this.status = new Number(response.status);
        this.statusText = new String(response.statusText);
        this.data = response.data;
        this.headers = response.headers;
        this.success = new Boolean(this.status >= 200 && this.status < 300);
    }
}
class ServerTls {
    constructor(socket) {
        this.protocol = new String(socket.getProtocol());
        
        const cipher = socket.getCipher();
        this.cipherName = new String(cipher.name);
        this.cipherMinimumVersion = new String(cipher.version);
    }
}
class ServerCertificate {
    constructor(certificate) {
        this.bits = new Number(certificate.bits);
        this.validFrom = new Date(certificate.valid_from);
        this.validTo = new Date(certificate.valid_to);
        this.subjectCommonName = new String(certificate.subject.CN);
        this.subjectAltName = new String(certificate.subjectaltname);
        this.issuerCertificate = null;
        if (certificate.issuerCertificate && (certificate.issuerCertificate.subject.CN != certificate.subject.CN)) {
            this.issuerCertificate = Object.freeze(new ServerCertificate(certificate.issuerCertificate));
        }
    }
}

module.exports = publicApi;



function makeUrl(client, path) {
    path = (path || '').substr(0, 1) == '/' ? path.substr(1) : path;
    const url = path.substr(0, 4) == 'http' ? path : `https://${client.host}${client.basePath}${path}`;
    return url;
}

function makeHeaders(client, customHeaders, method, body) {
    const headers = customHeaders || {};
    
    if (!('User-Agent' in headers)) {
        headers['User-Agent'] = 'OWASP Test Suite for Civicam REST API';
    }
    
    if (client.authentication.length && !('Authorization' in headers)) {
        headers['Authorization'] = client.authentication.toString();
    }
    if (hasBody(method, body) && !('Content-Type' in headers)) {
        headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    return headers;
}

function makeConfig(method, url , headers, body)
{
    const config = {
        method: method,
        url: url,
        headers: headers,
        validateStatus: () => true,
        httpsAgent: new https.Agent({ 
            maxCachedSessions: 0,
            rejectUnauthorized: true //Throw an exception for invalid certificates
        })
    };

    if (hasBody(method, body)) {
        config.data = body;
    }
    return config;
}

function hasBody(method, body) {
    return (method.toLowerCase() != 'get') && body;
}