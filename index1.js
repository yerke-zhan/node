const express =require('express')
const cors = require('cors')
const app = express()
const PORT =3000
app.use(express.json())
app.use(cors())

const students = [
  { id: 1, name: "Aruzhan", grade: "A", age: 16 },
  { id: 2, name: "Dias", grade: "B", age: 17 },
  { id: 3, name: "Miras", grade: "A", age: 15 }
]

app.get('/api/students', (req, res) => {
    const {sort} = req.query

    let result =[...students]
    if(sort === 'asc'){
        result.sort((a,b) => a.age -b.age)
    }else if(sort === 'desc'){
        result.sort((a,b) => b.age -a.age)
    }
    res.send(result)
})

app.post('/api/students', (req, res) => {
    const {name, grade, age} = req.body;
    if (!name && !grade && !age){
       return res.status(401).json({error: 'Please provide all the required fields'})
    }
    const existingStudent = students.find(student =>      
        student.name.toLowerCase() === 
        name.toLowerCase() && 
        student.grade.toLowerCase() === 
        grade.toLowerCase() && 
        student.age === age
    )
    if(existingStudent){
        return res.status(401).json({error: 'Student already exists'})
    }
    const newStudent = {
        id: students.length + 1,  
        name, 
        grade,  
        age
    };  
    students.push(newStudent)
    res.status(201).json(newStudent)
})
app.get('/api/students/search', (req, res) => {
    const {name} = req.query
    
    if (!name) {
        return res.status(401).json({error: 'Please provide the name field'})
    }

    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(name.toLowerCase())
    )

    res.json(filtered)
})

app.get('/api/students/:id', (req, res) => {
    const {id} = req.params
    const student = students.find(student => student.id === parseInt(id))
    if (!student){
        return res.status(404).json({error: 'Student not found'})
    }
    res.send(student)
})









app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})