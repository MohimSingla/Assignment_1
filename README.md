# Book-Store-API

##Overview:
Book Store API is an application which allows customers and admins to register themselves, Login with their accounts and perform CRUD operations based upon their roles.

## Functionalities:

### Accessible by customer:
1. Logged In Customers can view a paginated list of books data stored by the admin.

### Accessible by Admins:
1. Logged In Admin user can CREATE a new book's data.
2. Logged In Admin user can UPDATE a book's data with specific document ID.
3. Logged In Admin user can DELETE any book's data with the specific document ID.
4. Logged In Admin user can view the paginated list of books data stored previously by all the admin users.

## How to start using the application:
1. Clone the repository into your local machine by using the command:
        git clone https://github.com/MohimSingla/Assignment_1.git
2. Make sure you have a running MongoDB database server on your local machine at localhost and IP: 27017. If the MongoDB server is at some other IP and PORT, Kindly update the same in Models/model.js line number 8.
3. Make sure PORT 3000 is available for our application.
4. Change your PWD to the root folder of your project in the terminal and run the following command to start the express server:
        nodemon src/app.js -e js
5. The express server is up and running.

## Testing Endpoints:
#### 1. POST /auth/register
This API call allows user to signup for our application.
To register a new user, go to postman and setup a post request to http://127.0.0.1:3000/auth/register
Enter the data in the body as a raw JSON object. For Example:
                        {
                            "userName": "customer8@gmail.com",
                            "password": "test123",
                            "roleName": "customer"
                        }
Note: 
1. All the fields are required and needs to be entered. In case of wrong/incorrect information the validator will throw an error to the user.
2. userName should be an unique Email Id. Which has not been used before.
3. Password is encrypted using Bcrypt and stored as a hashed password into the database.
4. Rolename could only be "customer" or "admin", anything other than that would throw an error.
5. It generates a JWT token which can be used later as Bearer Token to perform CRUD operations on the Books database.

#### 2. POST /auth/login
This api call allows users to login to the application using their username and password.
To register a new user, go to postman and setup a POST request to http://127.0.0.1:3000/auth/login
Enter the data in the body as a raw JSON object. For Example:
                        {
                            "userName": "customer8@gmail.com",
                            "password": "test123"
                        }
Note:
1. This API will find if the user with userName entered exists in the database.
2. If the user exists, It will compare the password entered by the user with the hashed password saved by decrypting the hashed password.
3. In case of any anomality, it will throw error to the user with respective error message.

#### 3. GET /books
This API fetches the books data which has been stored by the admin user.
To Fetch the books data hit an API GET call at http://127.0.0.1:3000/books
Add any user's JSON Web Token accessible into the database in the header with "AuthorizationToken" as key and value as: "Bearer <JWT>"
Note:
1. This API call returns the books data in paginated form. With current page number and total pages available. 
2. The user can pass the page number as params: Adding Key as "page" and it's value as an integer to the page number which user wants to vie.
3. This by default opens the first page and lists only 2 books per page.
Alternatively, Send an API GET request to :
        http://127.0.0.1:3000/books/?page=<Integer value of Page Number>

#### 4. GET /books/:id
This API Endpoint allows users to view one specific book data.
To Fetch the book data hit an API GET call at http://127.0.0.1:3000/books/<ID> , where <ID> is the book's Id stored in the database.
Add any user's JSON Web Token accessible into the database in the header with "AuthorizationToken" as key and value as: "Bearer <JWT>"

#### 5. POST /books
This API Endpoint allows ADMIN users to CREATE new Book data individually.
To Fetch the books data hit an API POST call at http://127.0.0.1:3000/books
Add only the Admin user's JSON Web Token accessible into the database in the header with "AuthorizationToken" as key and value as: "Bearer <JWT>"
Add Book data as raw JSON object into the body of the request on postman. For Example:

                        {
                            "title": "Animal Farm",
                            "author": "George Orwell",
                            "genre":"Classic",
                            "price": 177,
                            "stock": 17
                        }
Note:
1. Data validators are at place, Any incorrect data format would throw an error.
2. If customer user tries to access this API, he/she is greeted with an Authorization Error.
   
#### 6. PUT /books/:id
This API Endpoint allows ADMIN users to UPDATE existing Book's data with the entered ID.
To UPDATE the book's data hit an API PUT call at http://127.0.0.1:3000/books/<ID>, where <ID> is the book's document ID stored into the Books database.
Add only the Admin user's JSON Web Token accessible into the database in the header with "AuthorizationToken" as key and value as: "Bearer <JWT>"
Add Book data as raw JSON object into the body of the request on postman. For Example:

                                {
                                    "author": "new Author",
                                    "genre": "new genre"
                                }
This will update the author of book data with _id -> <ID> into the mongoDB database collection.
Note:
1. Data validators are at place, Any incorrect data format would throw an error.
2. If customer user tries to access this API, he/she is greeted with an Authorization Error.
   
#### 7. DELETE /books/:id
This API allows ADMIN users to perform DELETE operation on the books data.
To DELETE the book's data hit an API DELETE call at http://127.0.0.1:3000/books/<ID>, where <ID> is the book's document ID stored into the Books database.
Add only the Admin user's JSON Web Token accessible into the database in the header with "AuthorizationToken" as key and value as: "Bearer <JWT>"
Note:
1. If customer user tries to access this API, he/she is greeted with an Authorization Error.
 
## Error Handling and Validation:
Error handlers and validators are in place to check for any incorrect/wrong information being passed into the application.

## Documentation:
Code-base is well documented with comments. 
Every functionality of the implemented functions is well written into the source code.

## Note:
In case the express server crashes, Kindly restart the express server with nodemon command.

