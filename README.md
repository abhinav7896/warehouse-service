# warehouse-service

- npm install --save-dev nodemon
- npm install --save  ejs express mysql2 sequelize aws-serverless-express

# Environment Variables:
- WAREHOUSE_DB_SCHEMA
- WAREHOUSE_DB_USER
- WAREHOUSE_DB_PASSWORD
- WAREHOUSE_DB_HOST

# Service Details:
- /products/order (POST)
    - Body:
      ```
      {
          "title": "p1",
          "quantity": 2
      }
      ```
- /products/get?title=p1 (GET)

- [POST]
    - https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/order
    - https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/prepare
    - https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/commit
    - https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/rollback
        - Body:
        ```
            {
                "title": "p1",
                "quantity": 10,  
                "transactionId": "XATR1"
            }
        ```

- [GET]
    - https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/products/getAll