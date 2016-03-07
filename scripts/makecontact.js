var salesforceRest = require('salesforce-rest');
var Promise = require('bluebird');
var Login = require('../objects/login');
var testConfig = require('../test/config')
var _ = require('underscore');
var createContact = function(accountId, properties) {
  console.log(properties);

  properties.AccountId = accountId;


  var path = '/services/data/v20.0/sobjects/Contact/';
  salesforceRest.post(path, properties, function(error, data){
    console.log('in fuckin callback');
    console.log('d: ', data);
    console.error('e: ', error);
  });

}

Login.login(testConfig).then(function(data){
  var str = '{"FirstName":"Cowboy","LastName":"Texas","Email":"cowboy@gmail.com","Pace__c":"Relaxed","GitHub__c":"cowboy123","Fulcrum_Status__c":"Active","Overall_Substatus__c":"Started","Sponsorship__c":"Not Sponsored"}';
  var params = JSON.parse(str);

  createContact('001P000000eExwUIAS', params);
});