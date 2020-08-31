const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

console.log(process.argv)
const password = process.argv[2]
const url =
  `mongodb+srv://fs2020:${password}@cluster0.k2scu.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const personSchema = new mongoose.Schema({
	name: String,
	number: String
})
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
	// get all phonebook list
	Person.find({}).then(result => {
		console.log('Phonebook:')
		result.forEach(person => {
			console.log(person.name, person.number)
		})
	  mongoose.connection.close()
	})
}else{
	// add new entry
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})
	  
	person.save().then(result => {
		console.log('added', result.name, 'number', result.number, 'to phonebook')
		mongoose.connection.close()
	})
}

