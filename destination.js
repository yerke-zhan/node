// const express = require('express');
// const app = express();
// app.use(express.json);
// const port = 3000;

// function logger(req, res, next){
//     console.log(`${req.method} ${req.url}`)
//     next()
// }
// app.use(logger)

// let destinations = [
//   {
//     id: 1,
//     name: "Париж",
//     country: "Франция",
//     description: "Жарықтар қаласы",
//     price: 1200
//   },
//   {
//     id: 2,
//     name: "Токио",
//     country: "Жапония",
//     description: "Күншығыс елі",
//     price: 1500
//   }
// ]

// app.get('/', (req, res) => {
//     res.json(destinations)
// })

// app.get('/api/destinations/search', (req, res) => {
//     const {country} = req.query
//     if(!country){
//         res.json(destinations)
//     }

//     const filtered = destinations.filter
//     (destination => destination.country.toLowerCase().includes(country.toLowerCase()))
    
//     res.json(filtered)
// })

// app.get('/destination/:id', (req, res) => {
//     const id =req.params.id
//     let foundDest = dest.find(el=>el.id == id)
//     foundDest? res.status(200).json(foundDest):res.status(404).json({message: "User not found"})

    
// })

// app.post('/destinations', (req, res) => {
//     const{ destId, name, country, description,price }=req.body
//     destinations.push({destId, name, country, description,price })
//     res.json(destinations)
// })

// app.post('/destinations', (req, res) => {
//     const {destId, name, country, description,price } = req.body;
//     if (!name && !country && !description && !price){
//        return res.status(401).json({error: 'Please provide all the required fields'})
//     }
//     const existingDest = destinations.find(dest =>      
//         dest.name.toLowerCase() === 
//         name.toLowerCase() && 
//         dest.country === country && 
//         dest.price === price
//     )
//     if(existingDest){
//         return res.status(401).json({error: 'Destination already exists'})
//     }
//     const newDestination = {
//         id: destinations.length + 1,  
//         name, 
//         description,  
//         price
//     };  
//     destinations.push(newDestination)
//     res.status(201).json(newDestination)
// })

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // міндетті middleware

let destinations = [
  {
    id: 1,
    name: "Париж",
    country: "Франция",
    description: "Жарықтар қаласы",
    price: 1200
  },
  {
    id: 2,
    name: "Токио",
    country: "Жапония",
    description: "Күншығыс елі",
    price: 1500
  }
];

// 1. GET /destinations (+ country filter)
app.get('/destinations', (req, res) => {
  const country = req.query.country;
  if (country) {
    const filtered = destinations.filter(dest => 
      dest.country.toLowerCase() === country.toLowerCase());
    return res.json(filtered);
  }
  res.json(destinations);
});

// 2. GET /destinations/:id
app.get('/destinations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dest = destinations.find(d => d.id === id);
  if (!dest) {
    return res.status(404).json({ message: "Бағыт табылмады!" });
  }
  res.json(dest);
});

// 3. POST /destinations
app.post('/destinations', (req, res) => {
  const { name, country, description, price } = req.body;
  if (!name || !country || !description || !price) {
    return res.status(400).json({ message: "Барлық ақпарат толтырылмаған!" });
  }

  const newDest = {
    id: destinations.length ? destinations[destinations.length - 1].id + 1 : 1,
    name,
    country,
    description,
    price
  };

  destinations.push(newDest);
  res.status(201).json(newDest);
});

// 4. PUT /destinations/:id
app.put('/destinations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = destinations.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Бағыт табылмады!" });
  }

  const { name, country, description, price } = req.body;
  destinations[index] = { id, name, country, description, price };
  res.json(destinations[index]);
});

// 5. DELETE /destinations/:id
app.delete('/destinations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = destinations.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Бағыт табылмады!" });
  }

  destinations.splice(index, 1);
  res.json({ message: "Бағыт өшірілді!" });
});

app.listen(port, () => {
  console.log(`Сервер http://localhost:${port} адресінде жұмыс істеп тұр`);
});
