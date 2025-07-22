// MongoDB Assignment - Telugu Movies (movieAppDB)
use movieAppDB;
// Insert Telugu movies
db.movies.insertMany([
  { movie_id: 1, title: "Bahubali", genre: "Action", language: "Telugu", rating: 9.2 },
  { movie_id: 2, title: "Salaar", genre: "Action", language: "Telugu", rating: 8.8 },
  { movie_id: 3, title: "Kalki", genre: "Sci-Fi", language: "Telugu", rating: 8.0 },
  { movie_id: 4, title: "Shubham", genre: "Drama", language: "Telugu", rating: 7.0 },
  { movie_id: 5, title: "Saaho", genre: "Thriller", language: "Telugu", rating: 7.5 },
  { movie_id: 6, title: "Pushpa", genre: "Action", language: "Telugu", rating: 8.5 }
]);

// Insert users
db.users.insertMany([
  { user_id: 101, name: "Ravi Teja", city: "Hyderabad" },
  { user_id: 102, name: "Sita Ram", city: "Vizag" },
  { user_id: 103, name: "Arjun Das", city: "Vijayawada" },
  { user_id: 104, name: "Keerthi Reddy", city: "Warangal" },
  { user_id: 105, name: "Meghana", city: "Hyderabad" }
]);

// Insert watch history
db.watch_history.insertMany([
  { user_id: 101, movie_id: 1, watch_date: new Date("2024-01-12") },
  { user_id: 101, movie_id: 2, watch_date: new Date("2024-03-15") },
  { user_id: 102, movie_id: 3, watch_date: new Date("2024-05-10") },
  { user_id: 103, movie_id: 1, watch_date: new Date("2024-02-14") },
  { user_id: 104, movie_id: 5, watch_date: new Date("2024-06-25") },
  { user_id: 105, movie_id: 6, watch_date: new Date("2024-07-01") },
  { user_id: 105, movie_id: 4, watch_date: new Date("2024-07-10") },
  { user_id: 102, movie_id: 6, watch_date: new Date("2024-07-18") }
]);
// Queries
// 1. Find all Telugu movies with rating greater than 8
db.movies.find({ rating: { $gt: 8 } });

// 2. Get all users who live in Hyderabad
db.users.find({ city: "Hyderabad" });

// 3. Get all watch history entries after March 1, 2024
db.watch_history.find({ watch_date: { $gt: new Date("2024-03-01") } });

// 4. Join watch_history with users and movies to display full watch details
db.watch_history.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "user_id",
      as: "user"
    }
  },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  {
    $project: {
      _id: 0,
      user_name: { $arrayElemAt: ["$user.name", 0] },
      movie_title: { $arrayElemAt: ["$movie.title", 0] },
      watch_date: 1
    }
  }
]);

// 5. Count how many times each movie was watched
db.watch_history.aggregate([
  {
    $group: {
      _id: "$movie_id",
      total_views: { $sum: 1 }
    }
  }
]);

// 6. Count how many movies each user has watched
db.watch_history.aggregate([
  {
    $group: {
      _id: "$user_id",
      movies_watched: { $sum: 1 }
    }
  }
]);

// 7. Find the movie that was watched the most
db.watch_history.aggregate([
  {
    $group: {
      _id: "$movie_id",
      views: { $sum: 1 }
    }
  },
  { $sort: { views: -1 } },
  { $limit: 1 }
]);

// 8. Find action genre movies watched by Ravi Teja
db.watch_history.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "user_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $match: { "user.name": "Ravi Teja" } },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  { $match: { "movie.genre": "Action" } },
  {
    $project: {
      _id: 0,
      movie_title: "$movie.title"
    }
  }
]);

// 9. Find users who watched more than 1 movie
db.watch_history.aggregate([
  {
    $group: {
      _id: "$user_id",
      watch_count: { $sum: 1 }
    }
  },
  { $match: { watch_count: { $gt: 1 } } }
]);

// 10. Count how many times each genre was watched
db.watch_history.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $group: {
      _id: "$movie.genre",
      watch_count: { $sum: 1 }
    }
  }
]);
