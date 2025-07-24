db.books.insertMany([
  { book_id: 201, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", copies: 10 },
  { book_id: 202, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", copies: 5 },
  { book_id: 203, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", copies: 7 },
  { book_id: 204, title: "The Lean Startup", author: "Eric Ries", genre: "Business", copies: 3 },
  { book_id: 205, title: "Deep Work", author: "Cal Newport", genre: "Productivity", copies: 4 }
]);

db.members.insertMany([
  { member_id: 101, name: "Ayesha Khan", joined_on: new Date("2024-01-15") },
  { member_id: 102, name: "Rahul Verma", joined_on: new Date("2024-03-12") },
  { member_id: 103, name: "Nikita Rao", joined_on: new Date("2024-04-10") }
]);


db.borrowed.insertMany([
  { borrow_id: 1, member_id: 101, book_id: 201, date: new Date("2024-06-01"), returned: true },
  { borrow_id: 2, member_id: 101, book_id: 203, date: new Date("2024-06-15"), returned: false },
  { borrow_id: 3, member_id: 102, book_id: 202, date: new Date("2024-06-20"), returned: false },
  { borrow_id: 4, member_id: 103, book_id: 204, date: new Date("2024-06-22"), returned: true }
]);

// Basic Queries
// 1. Find all books in the Self-Help genre
db.books.find({ genre: "Self-Help" });

// 2. Show members who joined after March 2024
db.members.find({ joined_on: { $gt: new Date("2024-03-31") } });

// 3. List all borrowed books that have not been returned
db.borrowed.find({ returned: false });

// 4. Display all books with fewer than 5 copies
db.books.find({ copies: { $lt: 5 } });

// 5. Get details of books written by Cal Newport
db.books.find({ author: "Cal Newport" });
//Join-Like Queries with $lookup
// 6. List all borrow records with book title and member name
db.borrowed.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $project: {
      borrow_id: 1,
      date: 1,
      returned: 1,
      "book.title": 1,
      "member.name": 1
    }
  }
]);

// 7. Find which member borrowed "Sapiens"
db.borrowed.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  { $match: { "book.title": "Sapiens" } },
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  { $project: { "member.name": 1, _id: 0 } }
]);

// 8. Display all members along with the books they've borrowed
db.members.aggregate([
  {
    $lookup: {
      from: "borrowed",
      localField: "member_id",
      foreignField: "member_id",
      as: "borrow_history"
    }
  }
]);

// 9. Get members who have borrowed books and not returned them
db.borrowed.aggregate([
  { $match: { returned: false } },
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $project: {
      "member.name": 1,
      book_id: 1,
      returned: 1
    }
  }
]);

// 10. Show each book along with number of times borrowed
db.borrowed.aggregate([
  {
    $group: {
      _id: "$book_id",
      times_borrowed: { $sum: 1 }
    }
  }
]);
//Aggregations and Grouping
// 11. Count how many books each member has borrowed
db.borrowed.aggregate([
  {
    $group: {
      _id: "$member_id",
      books_borrowed: { $sum: 1 }
    }
  }
]);

// 12. Which genre has the highest number of books?
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      total_books: { $sum: 1 }
    }
  },
  { $sort: { total_books: -1 } },
  { $limit: 1 }
]);

// 13. Top 2 most borrowed books
db.borrowed.aggregate([
  {
    $group: {
      _id: "$book_id",
      borrow_count: { $sum: 1 }
    }
  },
  { $sort: { borrow_count: -1 } },
  { $limit: 2 }
]);

// 14. Average number of copies per genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      avg_copies: { $avg: "$copies" }
    }
  }
]);

// 15. Total number of books currently borrowed
db.borrowed.aggregate([
  { $match: { returned: false } },
  { $count: "currently_borrowed" }
]);
//Advanced Use Cases
// 16. Add a member who hasn’t borrowed any book
db.members.insertOne({ member_id: 104, name: "Charan Reddy", joined_on: new Date("2024-07-20") });

db.members.aggregate([
  {
    $lookup: {
      from: "borrowed",
      localField: "member_id",
      foreignField: "member_id",
      as: "borrowed_books"
    }
  },
  { $match: { borrowed_books: { $eq: [] } } }
]);

// 17. Books that have never been borrowed
db.books.find({
  book_id: { $nin: db.borrowed.distinct("book_id") }
});

// 18. Members who borrowed more than one book
db.borrowed.aggregate([
  {
    $group: {
      _id: "$member_id",
      count: { $sum: 1 }
    }
  },
  { $match: { count: { $gt: 1 } } }
]);

// 19. Borrowing trends by month
db.borrowed.aggregate([
  {
    $group: {
      _id: { $month: "$date" },
      total_borrows: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);

// 20. Borrow records where book had less than 5 copies at the time
db.borrowed.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  { $match: { "book.copies": { $lt: 5 } } },
  { $project: { borrow_id: 1, "book.title": 1, "book.copies": 1 } }
]);

// BONUS QUESTIONS
// A. Simulate overdue books using a due_date
db.borrowed.updateOne(
  { borrow_id: 2 },
  { $set: { due_date: new Date("2024-06-20") } }
);

db.borrowed.find({
  due_date: { $lt: new Date() },
  returned: false
});

// B. Chart-style output: How many books are borrowed per genre
db.borrowed.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $group: {
      _id: "$book.genre",
      borrowed_count: { $sum: 1 }
    }
  }
]);
