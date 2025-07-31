E-commerce backend that is similar to amazon
more details when we add them!


Error On Update


Connected to MongoDB
Admin account already exists.
Server is running on port 3000
PATCH /api/cart/products/688b0eed28cd039cedb6e6e 500 227.867 ms - 1589
CastError: Cast to ObjectId failed for value "688b0eed28cd039cedb6e6e" (type string) at path "_id" for model "Product"
    at SchemaObjectId.cast (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/schema/objectId.js:251:11)
    at SchemaType.applySetters (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/schemaType.js:1258:12)
    at SchemaType.castForQuery (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/schemaType.js:1676:17)
    at cast (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/cast.js:390:32)
    at Query.cast (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/query.js:5055:12)
    at Query._castConditions (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/query.js:2351:10)
    at model.Query._findOne (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/query.js:2674:8)
    at model.Query.exec (/Users/iorikana/Documents/Code/Node/Project/Backend/node_modules/mongoose/lib/query.js:4604:80)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async /Users/iorikana/Documents/Code/Node/Project/Backend/controllers/product_cartController.js:82:21