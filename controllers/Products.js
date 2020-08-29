const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/create-page", (req, res) => res.status(200).render("products/create"));
router.get("/update-page", (req, res) => res.status(200).render("products/update"));
router.get("/find-page", (req, res) => res.status(200).render("products/find"));
router.get("/delete-page", (req, res) => res.status(200).render("products/delete"));

router.post("/create", (req, res) => {
  console.log("Creating a Product");
  Product.create({
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity
  }).then(result => {
    console.log(result.dataValues);
    // res.status(200).send(result.dataValues);
    let productsList = new Array();
    productsList.push(result.dataValues)
    res.status(200).render("products/find-response", {products: productsList});
  }).catch(error => {
    console.error(error.parent);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    // res.status(500).send(errorResponse);
    res.status(500).render("errors/500", errorResponse);
  });
});

router.get("/all", (req, res) => {
  console.log("Fetching All the Products");
  Product.findAll().then(result => {
    console.log(result);
    // res.status(200).send(result);
    let findResponse = JSON.parse(JSON.stringify(result));
    console.log("Product details", findResponse);
    res.status(200).render("products/find-response", {products: findResponse});

  }).catch(error => {
    console.error(error.parent);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    // res.status(500).send(errorResponse);
    return res.status(500).render("errors/500", errorResponse);
  });
});

router.get("/find", (req, res) => {
  console.log("Finding the Product");
  const title = req.query.title;
  if(!title){
    console.error("Aborting :: Invalid title");
    const errorResponse = {
      code: "ER_TITLE_NOT_FOUND",
      message: "Please send a valid 'title' query parameter"
    };
    // return res.status(400).send(errorResponse);
    return res.status(400).render("errors/500", errorResponse);
  }
  Product.findAll({
    where: {
      title:  title
    }
  }).then(result => {
    // console.log(result);
    // res.status(200).send(result);
    let findResponse = JSON.parse(JSON.stringify(result));
    console.log("Product details", findResponse);
    if(findResponse.length > 0){
      res.status(200).render("products/find-response", {products: findResponse});
    }else{     
      res.status(404).render('errors/404', {
        message: `Could not find any job with "${title}" title`
      });
    }
  }).catch(error => {
    console.error(error);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    // res.status(500).send(errorResponse);
    res.status(500).render("errors/500", errorResponse);
  });
});

router.post("/update", (req, res) => {
  console.log("Updating a Product");
  Product.update(
    {
      price: req.body.price,
      quantity: req.body.quantity
    },
    {
      where: {
        title:  req.body.title
      }
    }    
  ).then(result => {
    console.log("Update Result", result);    
    return Product.findAll({
      where: {
        title:  req.body.title
      }
    });
  }).then(result => {
    let updateFindResponse = JSON.parse(JSON.stringify(result));
    console.log("Updated Product details", updateFindResponse);
    // res.status(200).send(updateFindResponse[0]);
    res.status(200).render("products/find-response", {products: updateFindResponse});

  }).catch(error => {
    console.error(error);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    // res.status(500).send(errorResponse);
    res.status(200).render("errors/500", errorResponse);
  });

});

router.post("/delete", (req, res) => {
  console.log("Deleting a Product");
  Product.destroy({
    where: {
      title: req.body.title
    }
  }).then(result => {
    // console.log(result);
    // res.sendStatus(200).send(result);
    console.log("Delete Result", result);   
    if(result == 0){
      res.status(404).render('errors/404', {
        message: `Could not find any job with "${req.body.title}" title`
      });
    }else{
      return Product.findAll();
    } 
    
  }).then(result => {
    let deleteFindResponse = JSON.parse(JSON.stringify(result));
    // res.status(200).send(deleteFindResponse[0]);
    res.status(200).render("products/find-response", {products: deleteFindResponse});
  }).catch(error => {
    console.error(error);
    res.status(500).send(error);
    res.status(200).render("errors/500", errorResponse);
  });

});



router.post("/order", (req, res) => {
  console.log("Ordering a Product");
  const orderInfo = {
    quantity: req.body.quantity,
    title:  req.body.title
  };
  console.log(orderInfo);
  if(!orderInfo.title){
    console.error("Aborting :: Invalid title");
    const errorResponse = {
      code: "ERROR_TITLE_INVALID",
      message: "Please send a valid product title"
    };
    return res.status(400).send(errorResponse);
  }

  Product.findAll({
    where: {
      title:  orderInfo.title
    }
  }).then(result => {
    let findResponse = JSON.parse(JSON.stringify(result));
    console.log("Order Product details", findResponse);
    if(findResponse.length > 0){      
      if ( findResponse[0].quantity >= orderInfo.quantity ){
        return Product.update(
          {            
            quantity: (findResponse[0].quantity - orderInfo.quantity)
          },
          {
            where: {
              title:  orderInfo.title
            }
          }    
        );
      }else{
        const errorResponse = {
          code: "ERROR_OUT_OF_STOCK",
          message: `The quantity of the product is less than ${orderInfo.quantity}.`
        };  
        res.status(200).send(errorResponse);      
      }
    }else{   
      const errorResponse = {
        code: "ERROR_TITLE_NOT_FOUND",
        message: `Could not find any product with title ${orderInfo.title}.`
      };  
      res.status(404).send(errorResponse);      
    }
  }).then(result => {
    console.log("Order Update Result", result);    
    const successResponse = {
      code: "SUCCESS",
      message: `Update the ordered quantity`
    };  
    res.status(200).send(successResponse);    
  }).catch(error => {
    console.error(error);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    res.status(500).send(errorResponse);
  });
});

router.get("/get", (req, res) => {
  console.log("Finding the Product");
  const title = req.query.title;
  if(!title){
    console.error("Aborting :: Invalid title");
    const errorResponse = {
      code: "ER_TITLE_NOT_FOUND",
      message: "Please send a valid 'title' query parameter"
    };
    return res.status(400).send(errorResponse);
  }
  Product.findAll({
    where: {
      title:  title
    }
  }).then(result => {
    console.log(result);
    const successResponse = {
      code: "SUCCESS",
      message: "Product is found",
      data: result[0]
    };
    res.status(200).send(successResponse);    
  }).catch(error => {
    console.error(error);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    res.status(500).send(errorResponse);
  });
});

router.get("/getAll", (req, res) => {
  
  Product.findAll().then(result => {
    console.log(result);
    const successResponse = {
      code: "SUCCESS",
      message: "Products are available",
      data: result
    };
    res.status(200).send(successResponse);    
  }).catch(error => {
    console.error(error);
    const errorResponse = {
      code: error.parent.code,
      message: error.parent.sqlMessage
    };
    res.status(500).send(errorResponse);
  });
});



module.exports = router;