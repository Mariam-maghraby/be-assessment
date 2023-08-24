/*dependices*/
const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

/* Post a new user */
handlers._users.post = (data, callback) => {
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement){
        _data.read('users', phone, (err, data) => {
            if(err){
                let hashedPassword = helpers.hash(password);
                if(hashedPassword){
                    let userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };
                    _data.create('users', phone, userObject, (err) => {
                        if(!err){
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error' : 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error' : 'Could not hash the user\'s password'});
                }
            } else {
                callback(400, {'Error' : 'A user with that phone number already exists'});
            }
        });
    }
};

/* Get a user */
handlers._users.get = (data, callback) => {
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length > 0 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers.tokens.verifyToken(token, phone, (tokenIsValid) => {
            if(tokenIsValid){
                _data.read('users', phone, (err, data) => {
                    if(!err && data){
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
            }
        });
        
    
    }
}


handlers._users.put = (data, callback) => {

    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(phone){
        if(firstName || lastName || password){
            const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers.tokens.verifyToken(token, phone, (tokenIsValid) => {
                if(tokenIsValid){
                    _data.read('users', phone, (err, userData) => {
                        if(!err && userData){
                        /*update any of these fields*/
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            userData.hashedPassword = helpers.hash(password);
                        }
                        _data.update('users', phone, userData, (err) => {
                            if(!err){
                                callback(200);
                            } else {
                                console.log(err);
                                callback(500, {'Error' : 'Could not update the user'});
                            }
                        })
                    } else {
                        callback(400, {'Error' : 'The specified user does not exist'});
                      }
                        
                    });
                } else {
                    callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
                  }
                });
          
              } else {
                callback(400, {'Error' : 'Missing fields to update'});
              }
          
            } else {
              callback(400, {'Error' : 'Missing required field'});
            }
          }
                
                   


