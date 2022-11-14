
const pg = require('pg');
const express = require('express');
const app=express();

const PORT = process.env.PORT || 3000;

const client = new pg.Client('postgres://localhost/pokemon');

app.get('/', async (req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM pokedex;')
        const pokemon = response.rows
        
        res.send(`<html>
        <head></head>

        <body>
        <h1> Select a pokemon </h1>
        <ul>

        ${pokemon.map(ele => {
            return `
            <li>
            <a href=/pokemon/${ele.id}> ${ele.name} </a>
            </li>
            `
        }).join('')
        }

        </ul>
        
        </body>
        </html>`)
 
    }
    catch (err) {
        console.log(err)
    }
})


app.get('/pokemon/:id', async (req, res, next) => {
        try {
        const response = await client.query('SELECT * FROM pokedex WHERE id=$1;', [req.params.id])
        const pokemon = response.rows[0]
        console.log(pokemon)

        res.send(`<html>
        <head></head>
        <body>
            <h1>Pokedex</h1>

            <h2> ${pokemon.name} </h2>
            <h3> A ${pokemon.type} type pokemon </h3>
            <p> Description: ${pokemon.description}</p>

        <input type="button" value="Go back!" onclick="history.back()">
        </body>
        </html>`)
        }
        catch (err) {
            console.log(err)
        }
    })

const syncAndSeed = async() => {
    const SQL = `
    DROP TABLE IF EXISTS playerInventory;
    DROP TABLE IF EXISTS pokedex;
    CREATE TABLE pokedex (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(10) NOT NULL,
        description VARCHAR(200)
    );
    CREATE TABLE playerInventory (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        pokemon_id INTEGER REFERENCES pokedex(id)
    );
    INSERT INTO pokedex (id, name, type, description) values (1, 'Charizard', 'Fire', 'Fire lizard');
    INSERT INTO pokedex (id, name, type, description) values (2, 'Quacksley', 'Water', 'Water duck');
    INSERT INTO pokedex (id, name, type, description) values (3, 'Pikachu', 'Electric', 'Lightning mouse');
    INSERT INTO pokedex (id, name, type, description) values (4, 'Bulbasaur', 'Fire', 'Grass turtle');
    INSERT INTO playerInventory (id, name, pokemon_id) values (1, 'Larry', 3);
    INSERT INTO playerInventory (id, name, pokemon_id) values (2, 'Pinky', 2);
    INSERT INTO playerInventory (id, name, pokemon_id) values (3, 'Thirdy', 4);
    `

    await client.query(SQL)
}

const setUp = async() => {
    try {
        await client.connect();
        await syncAndSeed();
        console.log('connected to database')
    }
    catch (ex) {
        console.log(ex);
    }
}

setUp();

app.listen(PORT, () => console.log(`listening on ${PORT}`))