# Blanja Backend


<h3 align="center">Blanja API</h3>


# This Repository is about Blanja Backend build with Express.js, PostgreSQL and Midtrans for the transaction

Blanja is a platform for buying and selling fashion products.

# Features

- Login/Register ( Customer / Seller )
- Get User Data
- Edit Customer Data
- Edit Seller Data
- Upload User Photo
- delete User Data
- Get Product
- Insert Product
- Edit Product
- Delete Product
- Get Address User
- Insert Address User
- Edit Address User
- Delete Address User
- Create Order
- Get Order
- Edit Order
- Delete Order
- Create Payment
- Check Status Payment

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
Prerequisites

- Node.js
- Postgresql

# Installing:

- Clone the repository
- git clone https://github.com/suprayogo/blanja-be.git

# Install dependencies:

- npm install
- Start the server
- npm start
- The API will be running on port 4000.



## Endpoint List

[![Run in Postman](https://run.pstmn.io/button.svg)](https://elements.getpostman.com/redirect?entityId=26602283-18309b59-06d3-4af9-a33e-a95d7c6a0f1a&entityType=collection)



# The API endpoints are:

User Route :
get /users getUsers;
post /register/customer registerCustomer
post /register/seller registerSeller
patch /edit/customer editCustomer
patch /edit/seller editSeller
delete /users deleteUsers
patch /users/photo editUsersPhoto

Auth Route :
post /customer/login loginCustomer
post /seller/login loginSeller

Product Route :
get /product getProduct
get /product/:id getProductById
get /category getCategory
post /product insertProduct
get /seller/product getProductByJwt
patch /product editProduct
delete /product deleteProduct

Address Route :
get /address getAddressJwt
post /customer/address insertAddress
patch /address/edit_address editAddress
delete /address/delete_address deleteAddress

Order Route :
get /order getAllOrder
post /product/createOrder createOrder
patch /editorder editOrder
delete /order/delete-order deleteOrder
post /create-payment createPayment
get /check-status checkStatus
