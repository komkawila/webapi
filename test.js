const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

var movies = [
    {
        id: 0,
        name: "The Flash",
        type: "series",
        isPublished: false
    }
  ];

//const books = require('./db')
const books = [
    {
      "id": "1",
      "name": "Phanuwat Kawila",
      "nickname": "KOM"
    },
    {
      "id": "2",
      "name": "Wipawadee Kawila",
      "namnicknamee2": "Lai"
    },
    {
      "id": "3",
      "name": "Pornwipa Kawila",
      "nickname": "Kat"
    },
    {
      "id": "4",
      "name": "Sompong Kawila",
      "nickname": "Pong"
    }
  ]

app.get('/books', (req, res) => {
  res.json(books)
})

app.get('/books/:id', (req, res) => {
    res.json(books.find(book => book.id === req.params.id))
  })

app.listen(3000, () => {
  console.log('Start server at port 3000.')
}) 