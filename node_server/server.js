const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '1',
            name: 'Patrick',
            email: 'patrick@gmail.com',
            password: 'cookies',
            joined: new Date(),
        },
    ],
};

app.get('/', (req, res) => {
    res.type('json').send(JSON.stringify(database.users, null, 2));
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const user = database.users.find((u) => u.email === email);
    if (user && user.password === password) {
      return res.json(user);

    } else {
      return res.status(400).json('User not found');
    }
  });
  

  app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json('incorrect form submission');
    }
    const newUser = {
      id: database.users.length + 1,
      name: name,
      email: email,
      password: password,
      joined: new Date(),
    };

    database.users.push(newUser);
    res.json(newUser);
  });

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = database.users.find((u) => u.id === id);
    if (user) {
        res.json(user);
    } else {
        res.status(400).json('Not found');
    }
});


app.listen(3000, () => {
    console.log("app is running on port 3000");
});

