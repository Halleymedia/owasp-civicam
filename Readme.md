# (In progress) OWASP Test Suite for Civicam REST API
This project performs tests described in the [OWASP Testing Guide v4](https://www.owasp.org/index.php/OWASP_Testing_Guide_v4_Table_of_Contents) in order to detect potential security flaws in the Civicam REST API.

Since the Civicam REST API is improved on a daily basis, these tests are run daily.

![Compilation status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoidGFTMHI2dldzektFUS8wOW45WjZBM0I5UCswUHl2U3UrZ2xqaExBVmxONGswSXhHMERVMGtRVG1yTHlNK2o5MnNrZHJzNlBXb2h6QmVWeXNiSXYzUU1NPSIsIml2UGFyYW1ldGVyU3BlYyI6InRsTC8veXdqQm1pZkg3Q24iLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

## The quest for software security and quality
Here at Civicam we make tested and secure software in compliance with GDPR regulations. We are fully aware this is no simple task but we strive to give our customers and our users the safest web navigation experience they deserve.

![Civicam Logo](test/files/civicam.png)


## Running these tests in your local environment
You can run these tests on your machine by following these steps:
 1. Contact us and ask for an API KEY for our test environment. It's needed by most of the tests in this suite;
 2. Ensure [Node.js](https://nodejs.org) v11.2.0+ is installed on your machine;
 3. Clone/Download this repository but first, please, [read the license](LICENSE);
 4. Create an environment variable named `CIVICAM_API_KEY` and set its value to the API KEY we've sent you;
    * Alternatively, you can create a `.env` file by renaming the `.env.example` file and defining the `CIVICAM_API_KEY` setting in there;
 5. Run `npm install`

 Now, if you want to **run tests from the command line**:
 * Run `npm test`

 If, instead, you'd like to **run tests in a visual editor**:
 * Download [Visual Studio Code](https://code.visualstudio.com/) and install the [Jasmine Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-jasmine-test-adapter) extension. The [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension is also recommended;
 * Open the project directory;
 * Hit `Ctrl`+`Shift`+`B` to run all tests;
    * Alternatively, you can selectively run tests from the *Test* panel or by using the CodeLens shortcuts on each individual test.