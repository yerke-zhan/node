express = require('express');
app = express();
const PORT = 3000;
const cors = require('cors')
app.use(express.json())
app.use(cors())

const books = [
  { id: 1, title: 'Абай жолы', author: 'М. Әуезов', year: 1942 },
  { id: 2, title: 'Менің атым Қожа', author: 'Б. Соқпақбаев', year: 1957 },
  { id: 3, title: 'Алтын сақа', author: 'Ертегі', year: 1970 },
  { id: 4, title: 'Батырлар жыры', author: 'Халық шығармашылығы', year: 1950 }
];

app.get('/', (req, res) => {
    res.send('Hello World its my first Backend application');
});


// app.get('/api/books', (req, res) => {
//     res.json(books);
// });

app.get('/api/books/search', (req, res) => {
    const {title} = req.query
    if(!title){
        res.json(books)
    }

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()))
    
    res.json(filteredBooks)
})

app.get('/api/books/:id', (req, res) => {
    const {id} = req.params
    const book = books.find(book => book.id === parseInt(id))
    if(!book){
        res.status(404).json ({error: 'Book not found'})
    }
    res.json(book)
})

app.get('/api/books', (req, res) => {
    const {sort} = req.query

    let result =[...books]
    if(sort === 'asc'){
        result.sort((a,b) => a.year - b.year)
    }else if(sort === 'desc'){
        result.sort((a,b) => b.year - a.year)
    }
    res.send(result)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




