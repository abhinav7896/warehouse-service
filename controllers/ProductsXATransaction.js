const express = require("express");
const router = express.Router();
const db = require("../util/db");

const Product = require("../models/Product");


router.post("/2pc/order", (req, res) => {
    console.log("Ordering a Product");
    const orderInfo = {
        quantity: req.body.quantity,
        title:  req.body.title,
        transactionId: req.body.transactionId
    };
    console.log(orderInfo);

    // insufficient quantity = 1
    // success = 0

   
    if(!orderInfo.title){
      console.error("Aborting :: Invalid title");
      const errorResponse = {
        orderStatus: false,
        message: "Please send a valid 'title'"
      };
      return res.status(200).send(errorResponse);
    }

    Product.findAll({
      where: {
        title:  orderInfo.title
      }
    }).then(result => {
      console.log(result);
      const findQueryResponse = result[0];
      if(findQueryResponse.quantity >= orderInfo.quantity){
            const updatedQuantity = findQueryResponse.quantity - orderInfo.quantity;
            db.query('XA START ?; UPDATE products SET quantity = ? WHERE title=?; XA END ?',
            [orderInfo.transactionId, updatedQuantity, orderInfo.title, orderInfo.transactionId],
            function(err, results) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                
                // `results` is an array with one element for every statement in the query:
                console.log(results[0]); 
                console.log(results[1]); 
                console.log(results[2]);
                const successResponse = {
                    orderStatus: true,
                    message: "Updating the quantity"
                };
                return res.status(200).send(successResponse);
            });    
          
      }else{
          const errorResponse = {
            orderStatus: false,
            message: "Insufficient Quantity"
          };
          return res.status(200).send(errorResponse);
      }
    }).catch(error => {
      console.error(error);
      const errorResponse = {
        orderStatus: false,
        message: "Could not execute due to an internal DB error"
      };
      return res.status(200).send(errorResponse);      
    });   
  });


  router.post("/2pc/prepare", (req, res) => {
    console.log("Preparing Product Order");
    const orderInfo = {        
        transactionId: req.body.transactionId
    };
    console.log(orderInfo);

    db.query('XA PREPARE ?',
    [orderInfo.transactionId], 
    function(err, results) {
        if (err) {
            console.error(err);
            return res.status(200).send({prepared: false});
        }
        
        // `results` is an array with one element for every statement in the query:
        if(results){
            console.log(results[0]); 
            return res.status(200).send({prepared: true});
        }else{
            return res.status(200).send({prepared: false});
        }
       
    });
   
  });

  router.post("/2pc/commit", (req, res) => {
    console.log("Commiting Product Order");
    const orderInfo = {        
        transactionId: req.body.transactionId
    };
    console.log(orderInfo);

    db.query('XA COMMIT ?',
    [orderInfo.transactionId], 
    function(err, results) {
        if (err) {
            console.error(err);
            return res.status(200).send({committed: false});
        }
        
        // `results` is an array with one element for every statement in the query:
        
        if(results){
            console.log(results[0]); 
            return res.status(200).send({committed: true});
        }else{
            return res.status(200).send({committed: false});
        }
    });   
  });

  router.post("/2pc/rollback", (req, res) => {
    console.log("Commiting Product Order");
    const orderInfo = {        
        transactionId: req.body.transactionId
    };
    console.log(orderInfo);

    db.query('XA ROLLBACK ?',
    [orderInfo.transactionId], 
    function(err, results) {
        if (err) {
            console.error(err);
            return res.status(200).send({rolledBack: false});
        }
        
        // `results` is an array with one element for every statement in the query:
        
        if(results){
            console.log(results[0]); 
            return res.status(200).send({rolledBack: true});
        }else{
            return res.status(200).send({rolledBack: false});
        }
        
    });   
  });

  module.exports = router;