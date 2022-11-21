const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}



const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const morgan = require('morgan')

morgan.token('req-body', function(req, res) {
  return JSON.stringify({
    name: req.body.name,
    number: req.body.number,
  })
})

app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Welcome to Phonebook!</h1>')
})

app.get('/info', (request, response) => {
    let totalPeople = persons.length
    response.send(`<p>Phonebook has info for ${totalPeople} people</p><br/><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  // const person = request.body                        --works!
  const body = request.body
  const generateId = () => {
    return Math.floor(Math.random() * 10000)
  }
  // person.id = Math.floor(Math.random() * 10000)      --works!
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  }
  persons = persons.concat(person)
  // console.log(person)
  response.json(person)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
