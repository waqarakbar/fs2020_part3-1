const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));

app.use(cors())

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

app.use(express.json())
// app.use(requestLogger)

let persons = [
	{
		name: 'Ali Khan',
		number: '0333 1231234',
		id: 1
	},
	{
		name: 'Sher Jan',
		number: '0333 9877896',
		id: 2
	},
	{
		name: 'Basheer John',
		number: '0345 7657652',
		id: 3
	},
	{
		name: 'James Bond',
		number: '0321 3453452',
		id: 4
	}
]


app.get('/', (request, response) => {
	// console.log('Server is running')
	response.send('Server is running')
})

app.get('/info', (request, response) => {
	const personCount = persons.length
	const currentDateTime = new Date()
	response.send(`Phonebook has info for ${personCount} people <br> ${currentDateTime}`)
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(p => p.id === id)

	if(person){
		return response.status(200).json(person)
	}else{
		return response.status(404).json({
			error: 'resource not found'
		})
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

app.post('/api/persons', (request, response) => {

	const body = request.body 

	if(!body.name){
		return response.status(422).json({
			error: 'name of person can not be empty'
		})
	}

	if(!body.number){
		return response.status(422).json({
			error: 'number of person can not be empty'
		})
	}

	const personExists = persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase())
	// console.log(personExists.length)
	if(personExists.length > 0){
		return response.status(409).json({
			error: 'the name already exists in phonbook'
		})
	}

	const newPerson = {
		id: Math.floor(Math.random()*10000),
		name: body.name,
		number: body.number
	}
	persons = persons.concat(newPerson)

	response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)