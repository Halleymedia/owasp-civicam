require('dotenv').config();
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const restApiHost = process.env.CIVICAM_API_HOST || 'api.civicam.it';
const restApiBasePath = '/test/v1/';

class Client {

    constructor() {
        this.host = new String(restApiHost);
        this.basePath = new String(restApiBasePath);
        this.defaultHeaders = {};
        this.credentials = new ClientCredentials(process.env.CIVICAM_CREDENTIALS);
        
        return Object.freeze(this);
    }

    file(name) {
        return Object.freeze(new FileDefinition(name));
    }

    async get(relativePath, headers) {
        return await this.request('get', relativePath, null, headers);
    }

    async post(relativePath, body, headers) {
        return await this.request('post', relativePath, body, headers);
    }

    async put(relativePath, body, headers) {
        return await this.request('put', relativePath, body, headers);
    }

    async delete(relativePath, body, headers) {
        return await this.request('delete', relativePath, body, headers);
    }

    async login(username, password) {
        const authorization = makeAuthenticationPayload.call(this, username, password);
        this.defaultHeaders['Authorization'] = authorization;
        return await this.get('/tenants');
    }

    logout() {
        delete this.defaultHeaders['Authorization'];
    }

    async request(method, relativePath, body, customHeaders) {
        if (!method)
        {
            throw 'Cannot make a request: method missing';
        }
        const url = makeUrl.call(this, relativePath);
        const headers = makeHeaders.call(this, customHeaders);
        const config = makeConfig.call(this, method, url, headers, body);
    
        try {
            const response = await axios.request(config);
            return Object.freeze(new WebRequestResult(response));
        } catch (e) {
            throw e.message;
        }
    }
}

const publicApi = Client;

class FileDefinition {
    constructor(name) {
        if (!name) {
            throw 'You must provide a file name';
        }
        const fullPath = path.join(__dirname, '../files/', name);
        if (!fs.existsSync(fullPath)) {
            throw `File '${name}' does not exist in the 'test/files/' directory`;
        }
        this.name = new String(name);
        this.fullPath = new String(fullPath);

        return Object.freeze(this);
    }
}

class WebRequestResult {
    constructor(response) {
        const { request } = response;

        this.request = new ClientRequest(request);
        this.response = new ServerResponse(response);
        this.secure = new Boolean(('encrypted' in request.socket) && request.socket.encrypted);

        const certificate = request.socket.getPeerCertificate(true);
        this.certificate = this.secure ? new ServerCertificate(certificate) : null;
        this.tls = this.secure ? new ServerTls(request.socket) : null;

        return Object.freeze(this);
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
        return Object.freeze(this);
    }
}
class ServerResponse {
    constructor(response) {
        this.status = new Number(response.status);
        this.statusText = new String(response.statusText);
        this.data = response.data;
        this.headers = response.headers;
        this.success = new Boolean(this.status >= 200 && this.status < 300);
        return Object.freeze(this);
    }
}
class ServerTls {
    constructor(socket) {
        this.protocol = new String(socket.getProtocol());
        
        const cipher = socket.getCipher();
        this.cipherName = new String(cipher.name);
        this.cipherMinimumVersion = new String(cipher.version);
        return Object.freeze(this);
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
            this.issuerCertificate = new ServerCertificate(certificate.issuerCertificate);
        }
        return Object.freeze(this);
    }
}

class ClientCredentials {
    constructor(credentials) {
        if (!credentials || !credentials.includes(':')) {
            throw 'Ensure the credentials has been set properly (it must be something like username:password)';
        }
        const credentialParts = credentials.split(':');
        this.username = new String(credentialParts[0]);
        this.password = new String(credentialParts[1]);
        return Object.freeze(this);
    }
}

module.exports = publicApi;

function makeAuthenticationPayload(username, password) {
    username = username !== undefined ? username : this.credentials.username;
    password = password !== undefined ? password : this.credentials.password;

    const scheme = 'Basic';
    const value = `${username}:${password}`;
    const buffer = Buffer.from(value);
    const encodedValue = buffer.toString('base64');
    return `${scheme} ${encodedValue}`;
}

function makeUrl(relativePath) {
    relativePath = (relativePath || '').substr(0, 1) == '/' ? relativePath.substr(1) : relativePath;
    const url = relativePath.substr(0, 4) == 'http' ? relativePath : `https://${this.host}${this.basePath}${relativePath}`;
    return url;
}

function makeHeaders(customHeaders) {
    customHeaders = customHeaders || {};
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    if (!('User-Agent' in headers)) {
        headers['User-Agent'] = 'OWASP Test Suite for Civicam REST API';
    }
    
    return headers;
}

function makeConfig(method, url, headers, body)
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
        let contentType;

        if (body instanceof FileDefinition) {
            const formData = new FormData();
            const content = fs.createReadStream(body.fullPath.toString());
            formData.append("file", content, body.name.toString());
            contentType = `multipart/form-data; boundary=${formData._boundary}`;
            config.data = formData;
        } else {
            contentType = 'application/json; charset=utf-8';
            config.data = body;
        }

        if (!('Content-Type' in headers)) {
            headers['Content-Type'] = contentType;
        }
    }
    return config;
}

function hasBody(method, body) {
    return (method.toLowerCase() != 'get') && body;
}