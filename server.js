const express = require('express');
const pg = require('pg');
const vb = require('volleyball');

const app = express();

const PORT = 3000 || process.env.port;

// app.get('/', async (req, res, next) => {
//     try {
//         // const response = await client.query('SELECT * FROM pokemon;')
//         // const pokemon = response.rows
//         //
// //         res.send(`<html>
// //         <head></head>
// //         <body>
// //         <ul>
// //         ${pokemon.map
// //             <li>
// //             <a href=${}`> </a>
// //             </li>
// //         }
// //         </ul>
        
// //         </body>
// //         </html>`)
 
// //     }
// //     catch (err) {
// //         console.log(err)
// //     }
// // })


// app.get('/:id', async (req, res, next) => {
//     try {
//         res.send(`<html>
//         <head></head>
//         <body>
//             <h1>Pokedex</h1>

//             <h2> ${pokemon.name} </h2>
//             <h3> A ${pokemon.type} type pokemon </h3>
//             <p> ${pokemon.description} </p>
//         </body>
//         </html>`)

app.listen(PORT, () => console.log('listening on port 3000'));


const client = new pg.Client('postgres://localhost/pokemon');
// // process.env.PGPASSWORD = 'Entertain123!';

const syncAndSeed = async () => {
    const SQL = `
    DROP TABLE IF EXISTS pokedex;
    DROP TABLE IF EXISTS pokemon;
    CREATE TABLE pokemon-types (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL
    );//
    INSERT INTO 'pokemon' (id, type, name, description) VALUES (1, 'Fire', 'Charizard', 'A flaming dragon.');
    INSERT INTO 'pokemon' (id, type, name, description) VALUES (2, 'Water', 'Squirtle', 'A watery turtle.');
    INSERT INTO 'pokemon' (id, type, name, description) VALUES (3, 'Electric', 'Pikachu', 'An electric mouse.' );
    `

    await client.query(SQL);
}

const setUp = async () => {
    try {
        await client.connect();
        await syncAndSeed();
    }
    catch (err) {
        console.log(err)
    }
}

setUp();