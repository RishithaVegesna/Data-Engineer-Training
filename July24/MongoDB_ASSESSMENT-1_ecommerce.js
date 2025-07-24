db.products.insertMany([
  { product_id: 1001, name: "Wireless Mouse", category: "Electronics", price: 750, stock: 120 },
  { product_id: 1002, name: "Bluetooth Speaker", category: "Electronics", price: 2200, stock: 80 },
  { product_id: 1003, name: "Yoga Mat", category: "Fitness", price: 599, stock: 150 },
  { product_id: 1004, name: "Office Chair", category: "Furniture", price: 7500, stock: 40 },
  { product_id: 1005, name: "Running Shoes", category: "Footwear", price: 3500, stock: 60 }
]);

db.orders.insertMany([
  { order_id: 5001, customer: "Ravi Shah", product_id: 1001, quantity: 2, order_date: new Date("2024-07-01") },
  { order_id: 5002, customer: "Sneha Mehta", product_id: 1002, quantity: 1, order_date: new Date("2024-07-02") },
  { order_id: 5003, customer: "Arjun Verma", product_id: 1003, quantity: 3, order_date: new Date("2024-07-03") },
  { order_id: 5004, customer: "Neha Iyer", product_id: 1001, quantity: 1, order_date: new Date("2024-07-04") },
  { order_id: 5005, customer: "Mohit Jain", product_id: 1005, quantity: 2, order_date: new Date("2024-07-05") }
]);

//Basic Queries
// 1. List all products in the Electronics category
db.products.find({ category: "Electronics" });

// 2. Find all orders placed by Ravi Shah
db.orders.find({ customer: "Ravi Shah" });

// 3. Show all orders placed after July 2, 2024
db.orders.find({ order_date: { $gt: new Date("2024-07-02") } });

// 4. Display the product with stock less than 50
db.products.find({ stock: { $lt: 50 } });

// 5. Show all products that cost more than ₹2000
db.products.find({ price: { $gt: 2000 } });
//Join-Like Queries with $lookup
// 6. Use $lookup to show each order with the product name and price
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_details"
    }
  },
  {
    $unwind: "$product_details"
  },
  {
    $project: {
      order_id: 1,
      customer: 1,
      order_date: 1,
      "product_details.name": 1,
      "product_details.price": 1
    }
  }
]);

// 7. Find total amount spent by each customer
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $group: {
      _id: "$customer",
      total_spent: {
        $sum: { $multiply: ["$quantity", "$product.price"] }
      }
    }
  }
]);

// 8. List all orders with product category
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      order_id: 1,
      customer: 1,
      order_date: 1,
      category: "$product.category"
    }
  }
]);

// 9. Find customers who ordered any Fitness product
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  { $match: { "product.category": "Fitness" } },
  {
    $project: { customer: 1, _id: 0 }
  }
]);

// 10. Find total sales per product category
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $group: {
      _id: "$product.category",
      total_sales: {
        $sum: { $multiply: ["$quantity", "$product.price"] }
      }
    }
  }
]);
//Aggregations and Grouping
// 11. Count how many units of each product have been sold
db.orders.aggregate([
  {
    $group: {
      _id: "$product_id",
      total_units_sold: { $sum: "$quantity" }
    }
  }
]);

// 12. Calculate average price of products per category
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      avg_price: { $avg: "$price" }
    }
  }
]);

// 13. Find which customer made the largest single order (by amount)
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      customer: 1,
      order_amount: { $multiply: ["$quantity", "$product.price"] }
    }
  },
  { $sort: { order_amount: -1 } },
  { $limit: 1 }
]);

// 14. List the top 3 products based on number of orders
db.orders.aggregate([
  {
    $group: {
      _id: "$product_id",
      order_count: { $sum: 1 }
    }
  },
  { $sort: { order_count: -1 } },
  { $limit: 3 }
]);

// 15. Determine which day had the highest number of orders
db.orders.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
      orders_count: { $sum: 1 }
    }
  },
  { $sort: { orders_count: -1 } },
  { $limit: 1 }
]);
//Advanced Use Cases
// 16. Add new customer & find customers with no orders
db.customers.insertOne({ name: "Kavya Nair", email: "kavya@example.com" });

db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "name",
      foreignField: "customer",
      as: "orders"
    }
  },
  { $match: { orders: { $eq: [] } } }
]);

// 17. Add more orders and find customers who placed more than one
db.orders.insertMany([
  { order_id: 5006, customer: "Ravi Shah", product_id: 1004, quantity: 1, order_date: new Date("2024-07-06") },
  { order_id: 5007, customer: "Mohit Jain", product_id: 1002, quantity: 2, order_date: new Date("2024-07-07") }
]);

db.orders.aggregate([
  {
    $group: {
      _id: "$customer",
      total_orders: { $sum: 1 }
    }
  },
  { $match: { total_orders: { $gt: 1 } } }
]);

// 18. Find all products that have never been ordered
db.products.find({
  product_id: { $nin: db.orders.distinct("product_id") }
});

// 19. Show customers who ordered products with stock less than 100
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  { $match: { "product.stock": { $lt: 100 } } },
  { $project: { customer: 1, "product.name": 1, "product.stock": 1 } }
]);

// 20. Show total inventory value (price × stock) for all products
db.products.aggregate([
  {
    $project: {
      name: 1,
      inventory_value: { $multiply: ["$price", "$stock"] }
    }
  }
]);


