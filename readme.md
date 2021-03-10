# This is an application for Greenline Technical Challenge.

#### It is a RESTful API server. Endpoints consist of CRUD for 4 resources, i.e. Company, Customer, Product and Sales. There are 2 extra endpoints that are dedicated to adding and removing a sales item to or from sales object.

<br />

Steps to run the project:
> 1. Run 'npm install'
> 2. Run 'npm run start'   
> (#3 and #4 are for running migrations)    
> 3. Run 'migrate-mongo up' to run the migrations in /migrations directory
> 4. Run 'migrate-mongo down' to rollback   
> > ** NOTE: credentials for database might differ between host devices. Please update DB_HOST_COLLECTION in .env as needed.

<br />

Packages and their versions used for the development:
> express - 4.17.1,  
> joi - 17.4.0,  
> joi-objectid - 3.0.1,  
> migrate-mongo - 8.2.2,  
> mongoose - 5.11.19  
> dotenv - 8.2.0,  
> nodemon - 2.0.7

<br />

# List of endpoints

#### Company: 
```
GET /localhost:3000/company
GET /localhost:3000/company/:id
POST /localhost:3000/company            
PUT /localhost:3000/company/:id
DELETE /localhost:3000/company/:id
```

```
Example Payload for POST
{
    name: "name"                            // required & unique
}
```

#### Customer:
```
GET /localhost:3000/customer
GET /localhost:3000/customer/:id
POST /localhost:3000/customer           
PUT /localhost:3000/customer/:id
DELETE /localhost:3000/customer/:id
```

```
Example Payload for POST
{
    name: "name",                           // required
    company: "60482799c46e8827f09ca38f"     // required
}
```

#### Product:
```
GET /localhost:3000/product
GET /localhost:3000/product/:id
POST /localhost:3000/product            
PUT /localhost:3000/product/:id
DELETE /localhost:3000/product/:id
```

```
Example Payload for POST
{
    name: "name",                           // required
    company: "60482799c46e8827f09ca38f",    // required
    category: "random",
    price: 50
}
```

#### Sales:
```
GET /localhost:3000/sales
GET /localhost:3000/sales/:id
POST /localhost:3000/sales              
PUT /localhost:3000/sales/:id
DELETE /localhost:3000/sales/:id
```

```
{
    items: [                                        // required
        {
            product: "60482799c46e8827f09ca38f",
            quantity: 10
        }
    ],
    company: "60482799c46e8827f09ca38f",            // required
    customer: "60482799c46e8827f09ca38f",           // required
    description: "First order of the day"
}
```

#### Add a Sales Item:   
// endpoint to add sales item to Sales object's items.   
// helper function to build updated Sales.items when removing an item.    
// if payload's product id exists in one of the Sales.items, it subtracts the new quantity from old quatity. if it goes below 0, it removes the item from Sales.items.   
// if payload's product id does not exist in any of the Sales.items, it just returns the same Sales.items.     

```
POST /localhost:3000/sales/:id/addItem 
```    

```
{
    product: "60482799c46e8827f09ca38f",        // required
    quantity: 10                                // if not provided, it will set the quantity to 1
}
```

#### Remove a Sales Item:
// endpoint to remove sales item from Sales object's items.    
// helper function to build updated Sales.items when adding an item.   
// if payload's product id already exists in one of the Sales.items, it adds up the quantities.    
// if payload's product id does not exist in any of the Sales.items, add a new item object to Sales.items.   

```
POST /localhost:3000/sales/:id/removeItem   
```

```
Example Payload
{
    product: "60482799c46e8827f09ca38f"         // required
    quantity: 10                                // if not provided, it will remove this item
}
```
