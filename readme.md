
Full Rest APIs :-
requirement:-

1. npm init -y (create package.json file)
2. npm i express (create your application server)
3. npm i esm (Es package ke help se ES6 ke all module ko use kar skte hai )
4. npm i nodemon -D (use for developement)
5. npm i dotenv (environment variable ka use karne ke liye)
6. Create two script for using esm package
   "dev": "nodemon -r esm server.js", // developement
   "start": "node -r esm server.js" // start node js

#### How many create end point for whole application

1. Register a User
2. Login a User
3. Who I am
4. Refresh token
5. Logout the user
6. Add new product
7. Upadte a product
8. Get all product
9. Get single product
10. Delete a product

#### Checklist for how to handle request

1. validate the request (means user ke through jo data send karke hai wo string hai or number )
2. authorise the request
3. check if user in the database already
4. prepare model
5. store in database
6. generate jwt token
7. send response

#### Validation karne ke liye manual validate karne ke accha third party package ka use karna chahiye

## npm i joi (The most powerful schema description language and data validator for JavaScript)
