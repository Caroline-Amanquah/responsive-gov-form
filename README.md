

To render the form on your screen do the following commands and then copy and paste  http://localhost:3000 into the browser: 

```bash
➜  Form git:(main) ✗ npm install
➜  Form git:(main) ✗ gulp sass
➜  Form git:(main) ✗ node server.js

Server running on http://localhost:3000

```

To run ESLint, run the following command:


```bash
➜  Form git:(main) ✗ npm run lint:js    
```

To test the joi validation, you can use a curl command to send a POST request to the /submissions endpoint, for example:

```bash
➜  Form git:(main) ✗ curl -X POST http://localhost:3000/submissions -H "Content-Type: application/json" -d '{
  "fullName": "John Doe",
  "eventName": "john.doe@example.com",
  "nationalInsuranceNumber": "PC123456C",
  "password": "Password123!",
  "dob-day": 27,
  "dob-month": 3,
  "dob-year": 1992,
  "whereDoYouLive": "england",
  "accountPurpose": ["Benefits and Financial Services", "Personal and Family Services"],
  "telephoneNumber": "07123456789"
}'

```


To run the Jest unit tests:


```bash
➜  Form git:(main) ✗ npm test

```
