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
3. Change your PWD to the root folder of your project in the terminal and run the following command to start the express server:
        nodemon src/app.js -e js
4. The express server is up and running.

## Testing Endpoints:
