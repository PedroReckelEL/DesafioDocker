const express = require('express');
const mysql = require('mysql');
const util = require('util');
const waitPort = require('wait-port');

const app = express();
const PORT = 5001;

const config = {
    host: 'db',
    user: 'root',
    password: 'admin',
    database: 'nodedb',
};

const pool = mysql.createPool(config);
const query = util.promisify(pool.query).bind(pool);

const waitForMySQL = async () => {
    try {
        // Aguarda a disponibilidade do MySQL na porta 3306
        await waitPort({ host: 'db', port: 3306, timeout: 20000 });

        // Aguarda mais alguns segundos para garantir que o MySQL está pronto
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
        console.error('Erro ao aguardar MySQL:', error);
        throw error;
    }
};

const insertPerson = async (name) => {
    try {
        const insertSql = 'INSERT INTO people(name) VALUES(?)';
        await query(insertSql, [name]);
    } catch (error) {
        console.error('Erro ao inserir pessoa no banco de dados:', error);
        throw error;
    }
};

const selectPerson = async (name) => {
    try {
        const selectSql = 'SELECT name FROM people WHERE name = ?';
        const result = await query(selectSql, [name]);
        return result[0];
    } catch (error) {
        console.error('Erro ao selecionar pessoa do banco de dados:', error);
        throw error;
    }
};

app.get('/hello/:name', async (req, res) => {
    try {
        const { name } = req.params;

        await insertPerson(name);
        const result = await selectPerson(name);

        res.send(`Olá, ${result.name}`);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/greet', (req, res) => {
    const { name } = req.query;
    res.send(`Saudações, ${name || 'visitante'}!`);
});

const startServer = async () => {
    try {
        await waitForMySQL();

        app.listen(PORT, () => {
            console.log(`Servidor está ouvindo na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
};

startServer();
