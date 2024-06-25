

To render the form on your screen do the following: 

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

To test the validation, you can use a curl command to send a POST request to the /validate endpoint:

```bash
curl -X POST http://localhost:3000/validate -H "Content-Type: application/json" -d '{ 
  "fullName": "John Doe",
  "eventName": "john.doe@example.com",
  "nationalInsuranceNumber": "PC123456C",
  "password": "Password123!",
  "passport-issued-day": 27,
  "passport-issued-month": 3,
  "passport-issued-year": 1992,
  "whereDoYouLive": "england",
  "waste": ["carcasses", "mines"],
  "telephoneNumber": "07123456789"
}'

```