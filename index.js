const express = require('express')
const app = express()
app.use(express.json())

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

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)