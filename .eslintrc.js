module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "jasmine": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "expectAsync": true
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
    },
    "plugins": [ "jasmine" ]
};