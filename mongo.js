const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://beto:${password}@cluster0.otp1c.mongodb.net/Phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
  important: Boolean,
})


const Person = mongoose.model('people', personSchema)

if (process.argv.length < 4) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
})
}
           





if (process.argv.length > 4) {

    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
      console.log(`Added ${name} number ${number}`)
      mongoose.connection.close()   // If the connection is not closed, the program will never finish its execution.
    })
}

