# fulcrum-salesforce

A set of models for fulcrum to interface with the SalesForce CRM

1. [Usage](#usage)
  1. [Connection](#connection)
  2. [Student](#student)
2. [Development](#development)
  1. [Testing](#testing)

## Usage

### Connection

A connection object is created to log in to SalesForce using the login information of a user that has permission to edit fulcrum students.

```javascript
connection = new Connection(config.url, config.username, config.password, config.userSecurityToken)
.then(function(conn) {
  // Do work with connection here
});
```

### Student

The student object is used to perform CRUD and other operations on a student.

#### Constructor

A student can be created by either supplying a contact ID or by supplying properties for a new contact to be created. A promise is returned.

```javascript
new Student(connection, id)
.then(function(student) {
  // Do work with student
});

// Or
studentProperties: {
  FirstName: 'Cowboy',
  LastName: 'Texas',
  Phone: 8008675309,
  GitHub__c: 'cowboy123',
  Email: 'cowboy@gmail.com',
}

new Student(connection, null, studentProperties)
.then(function(student) {
  // Do work with student
});
```

Note that an account is also made along with the contact record in salesforce. The account information is available as a property on the student object.

#### List all

Returns an array of all student properties from their contact and account records in SalesForce

```javascript
Student.all(connection)
.then(function(records) {
  console.log(records);
});
```

#### Update

Updates properties of a student in SalesForce

```javascript
student.update({FirstName: 'Joe'})
.then(function(response) {
  console.log(res.success); // true or false
  // Response will also include the student properties
});
```

#### Delete

Deletes a student from SalesForce. This deletes both the contact and the account records.

```javascript
student.delete()
.then(function(response) {
  console.log(res.success); // true or false
});
```

## Development

### Testing

You will need to create a config file named `config.js` located in the test directory. An example config file is below:

```javascript
module.exports = {
  key: 'salesforce key',
  secret: 'salesforce secret',
  username: 'salesforce login',
  password: 'salesforce password',
  userSecurityToken: 'salesforce security token',
  url: 'https://test.salesforce.com',
  hostName: 'test.salesforce.com',
  tokenPath: '/services/oauth2/token'
}
```

Note: If the IP is whitelisted by salesforce, you can enter an empty string for the security token. To find your security token, follow these instructions:

If you are on the older setup:
  * Navigate to [Your Name] > Setup > Personal Information > Reset Security Token
If you are on the newer setup:
  * Navigate to [Your Name] > My Settings > Personal > Reset My Security Token

You will then need to check your email to confirm the reset of your token.
