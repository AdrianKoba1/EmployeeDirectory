const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render('home')
})
//adding an employee
app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const address = req.body.address
    const email = req.body.email
    const status = req.body.status

if ((!name || name.trim() === '') && (!address || address.trim() === '')){
    res.render('add', {error: true})
}

else {
    fs.readFile('./data/employees.json', (err,data) => {
        if (err) throw err

        const employees = JSON.parse(data)

        employees.push({
            id: id(),
            name: name,
            phone: phone,
            address: address,
            email: email,
            status: status
        })

        fs.writeFile('./data/employees.json', JSON.stringify(employees), err => {
            if (err) throw err

            res.render('add', {success: true})
        })
    })
}
})


//saving employees to database
app.get('/employees', (req, res) => {

    fs.readFile('./data/employees.json', (err, data) => {
        if (err) throw err

        const employees = JSON.parse(data)

        res.render('employees', {employees: employees})
    })
    
})

//reading details of each employee
app.get('/employees/:id', (req, res) => {
    
    const id = req.params.id

    fs.readFile('./data/employees.json', (err, data) => {
        if (err) throw err

        const employees = JSON.parse(data)

        const employee = employees.filter(employee => employee.id == id)[0]

        res.render('detail', {employee: employee})
    })
       
})


//delete operation

app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/employees.json', (err, data) => {
        if (err) throw err

        const employees = JSON.parse(data)

        const filteredEmployees = employees.filter(employee => employee.id != id)

        fs.writeFile('./data/employees.json', JSON.stringify(filteredEmployees), (err) => {
            if (err) throw err

            res.render('employees', { employees:filteredEmployees, deleted: true})
        })
    
    })
})



// employee archive do not know what went wrong

app.get("/:id/archive", (req, res) => {
    fs.readFile(getCollection('employees.json'), (err, data) => {
      if (err) res.sendStatus(500)
  
      const employees = JSON.parse(data)
      const employeee = employees.filter(employee => employee.id == req.params.id)[0]
      const employeeIdx = employees.indexOf(employeee)
      const splicedEmployee = employees.splice(employeeIdx, 1)[0]
      splicedEmployee.archive = true
      employees.push(splicedEmployee)
  
      fs.writeFile(getCollection('employees.json'), JSON.stringify(employees), err => {
        if (err) res.sendStatus(500)
  
        res.redirect('/employees')
      })
      
    })
  })

//employee update 



app.get('/employees/:id/update', async (req, res) => {
    const id = req.params.id; // Extract the id parameter from the request
    fs.readFile('./data/employees.json', (err, data) => {
      if (err) throw err;
      const employees = JSON.parse(data);
      const employee = employees.filter(employee => employee.id == id)[0];
      res.render('update', { employee: employee });
    });
  });
  
  app.post('/employees/:id/update', async (req, res) => {
    const id = req.params.id;

    fs.readFile('./data/employees.json', (err, data) => {
      if (err) throw err
  
      const employees = JSON.parse(data)
      const employee = employees.filter(employee => employee.id == id)[0]
  
      employee.name = req.body.name
      employee.phone = req.body.phone
      employee.address = req.body.address
      employee.email = req.body.email
      employee.status = req.body.status
  
      fs.writeFile('./data/employees.json', JSON.stringify(employees), err => {
        if (err) throw err
  
        res.redirect(`/employees/${employee.id}`)
      })
    })
  
  })



//defining ports
app.listen(7000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 7000...')
})
// implementing unique id generator
function id () {
    return '_' + Math.random().toString(36).substr(2,9);
}



