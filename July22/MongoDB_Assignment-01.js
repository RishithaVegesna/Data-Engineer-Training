// Using the bookstoreDB database
use bookstoreDB;

// Inserting some books into the books collection
db.books.insertMany([
  { book_id: 101, title: "The AI Revolution", author: "Ray Kurzweil", genre: "Technology", price: 799, stock: 20 },
  { book_id: 102, title: "Mystic River", author: "Dennis Lehane", genre: "Thriller", price: 450, stock: 15 },
  { book_id: 103, title: "Half Girlfriend", author: "Chetan Bhagat", genre: "Romance", price: 350, stock: 30 },
  { book_id: 104, title: "Python Programming", author: "John Zelle", genre: "Technology", price: 999, stock: 10 },
  { book_id: 105, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", price: 600, stock: 25 }
]);

// Inserting customers
db.customers.insertMany([
  { customer_id: 1, name: "Amit Sharma", email: "amit@gmail.com", city: "Delhi" },
  { customer_id: 2, name: "Sneha Reddy", email: "sneha@gmail.com", city: "Hyderabad" },
  { customer_id: 3, name: "Raj Kapoor", email: "raj@gmail.com", city: "Mumbai" },
  { customer_id: 4, name: "Divya Nair", email: "divya@gmail.com", city: "Hyderabad" },
  { customer_id: 5, name: "Karan Patel", email: "karan@gmail.com", city: "Bangalore" }
]);

// Inserting order data
db.orders.insertMany([
  { order_id: 201, customer_id: 1, book_id: 101, order_date: new Date("2023-02-15"), quantity: 1 },
  { order_id: 202, customer_id: 2, book_id: 104, order_date: new Date("2024-01-05"), quantity: 2 },
  { order_id: 203, customer_id: 3, book_id: 102, order_date: new Date("2022-12-10"), quantity: 1 },
  { order_id: 204, customer_id: 4, book_id: 103, order_date: new Date("2023-03-12"), quantity: 1 },
  { order_id: 205, customer_id: 5, book_id: 105, order_date: new Date("2023-04-20"), quantity: 3 },
  { order_id: 206, customer_id: 2, book_id: 103, order_date: new Date("2023-05-25"), quantity: 1 },
  { order_id: 207, customer_id: 2, book_id: 101, order_date: new Date("2023-06-10"), quantity: 1 }
]);

 //Assignment Queries 
// 1. Find all books where the price is more than ₹500
db.books.find({ price: { $gt: 500 } });

 //2. Get details of customers who are from Hyderabad
db.customers.find({ city: "Hyderabad" });

//3. Show all orders placed after 1st Jan 2023
db.orders.find({ order_date: { $gt: new Date("2023-01-01") } });

//4. Show order details along with customer name and book title
db.orders.aggregate([
  { $lookup: { from: "customers", localField: "customer_id", foreignField: "customer_id", as: "customer" } },
  { $lookup: { from: "books", localField: "book_id", foreignField: "book_id", as: "book" } },
  { $project: {
      _id: 0,
      order_id: 1,
      customer_name: { $arrayElemAt: ["$customer.name", 0] },
      book_title: { $arrayElemAt: ["$book.title", 0] },
      quantity: 1,
      order_date: 1
  }}
]);

//5. Get total quantity ordered for each book
db.orders.aggregate([
  { $group: { _id: "$book_id", total_quantity: { $sum: "$quantity" } } }
]);

//6. Show how many orders each customer placed
db.orders.aggregate([
  { $group: { _id: "$customer_id", total_orders: { $sum: 1 } } }
]);

//7. Calculate total revenue for each book
db.orders.aggregate([
  { $lookup: { from: "books", localField: "book_id", foreignField: "book_id", as: "book" } },
  { $unwind: "$book" },
  { $group: {
      _id: "$book.title",
      revenue: { $sum: { $multiply: ["$quantity", "$book.price"] } }
  }}
]);

//8. Find the book with the highest revenue
db.orders.aggregate([
  { $lookup: { from: "books", localField: "book_id", foreignField: "book_id", as: "book" } },
  { $unwind: "$book" },
  { $group: {
      _id: "$book.title",
      revenue: { $sum: { $multiply: ["$quantity", "$book.price"] } }
  }},
  { $sort: { revenue: -1 } },
  { $limit: 1 }
]);

//9. Show total number of books sold grouped by genre
db.orders.aggregate([
  { $lookup: { from: "books", localField: "book_id", foreignField: "book_id", as: "book" } },
  { $unwind: "$book" },
  { $group: {
      _id: "$book.genre",
      total_sold: { $sum: "$quantity" }
  }}
]);

//10. Find customers who bought more than 2 different books
db.orders.aggregate([
  { $group: { _id: { customer_id: "$customer_id", book_id: "$book_id" } } },
  { $group: { _id: "$_id.customer_id", book_count: { $sum: 1 } } },
  { $match: { book_count: { $gt: 2 } } }
]);
