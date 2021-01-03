const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: `localhost`,

    port: `3306`,

    user: `root`,

    password: `mikeServer1!`,

    database: `top_songsDB`
});

// Node Start and Prompt
const nodeStart = () => {
    inquirer.prompt(
        {
            type: `list`,
            name: `query`,
            message: `What would you like to find in the TopSongs table?`,
            choices: [`Search by artist`,
                `All artists who have more than one songs in top list`,
                `Search table by range and position`,
                `Search by song name`,
                `Search for artist who's album and song made it into the Top Charts`,
                `Search by album to see if any of it's songs made it into the Top 5000 Song Chart`],
        }
    )
        .then((user) => {
            if (user.query === `Search by artist`) {
                searchArtist();
            }
            else if (user.query === `All artists who have more than one songs in top list`) {
                searchMultiple();
            }
            else if (user.query === `Search table by range and position`) {
                searchRange();
            }
            else if (user.query === `Search by song name`) {
                searchSong();
            }
            else if (user.query === `Search for artist who's album and song made it into the Top Charts`) {
                searchAlbumSong();
            }
            if (user.query === `Search by album to see if any of it's songs made it into the Top 5000 Song Chart`) {
                searchSongsInAlbum();
            }
        })
        .catch((err) => {
            if (err) throw err;
        });
};
// Search Top Song by Artist
const searchArtist = () => {
    inquirer.prompt(
        {
            type: `input`,
            name: `artist`,
            message: `What is the artists name?`,
        }
    )
        .then((user) => {
            let artist = user.artist;
            console.log(artist);
            connection.query(
                `SELECT * FROM top5000 WHERE ?`, (
                {
                    artist: artist,
                }
            ),
                (err, res) => {
                    if (err) throw err;
                    res.forEach(({ position, song, year }) => {
                        console.log(`Position: ${position}   Song:    ${song}  --  Year:    ${year}`)
                    });
                    nodeStart();
                })
        })
        .catch((err) => {
            if (err) throw err;
        });
};
// Search which artists made the top 5000 song list multiple times
const searchMultiple = () => {
    console.log(`These artists have more than one song listed in the Top 5000 list!`)

    connection.query(`SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1`,
        ((err, res) => {
            if (err) throw err;
            res.forEach(({ artist }) => console.log(artist));
            nodeStart();
        })
    )
};
// Search a specific range in top 5000 table
const searchRange = () => {
    inquirer.prompt([
        {
            type: `input`,
            name: `start`,
            message: `From what position do you want your search to begin?`,
            validate(value) {
                if (isNaN(value)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        {
            type: `input`,
            name: `end`,
            message: `From what position do you want your search to end?`,
            validate(value) {
                if (isNaN(value)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ])
        .then((user) => {
            console.log(user);
            let x = user.start;
            let y = user.end;
            connection.query(
                `SELECT * FROM top5000 WHERE position BETWEEN ${x} AND ${y}`,
                (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    nodeStart();
                }
            )
        })
};
// Search for Specific Song in top 5000 table
const searchSong = () => {
    inquirer.prompt(
        {
            type: `input`,
            name: `song`,
            message: `WHat is the name of the song you would like to search for?`
        }
    )
        .then((user) => {
            connection.query(
                `SELECT * FROM top5000 WHERE ?`,
                {
                    song: user.song,
                },
                ((err, res) => {
                    if (err) throw err;
                    console.log(`Position: ${res[0].position} || Song: ${res[0].song} || Artist: ${res[0].artist} || Year: ${res[0].year}`);
                    nodeStart();
                })
            )
        });
};
// Search which artist have both the song and the album the song is released on make the top list
const searchAlbumSong = () => {
    inquirer.prompt(
        {
            type: `input`,
            name: `artist`,
            message: `What is the artists name?`
        }
    )
        .then((user) => {
            connection.query(
                `SELECT top5000.position,top5000.artist,topalbums.album,top5000.song,top5000.year
            FROM top5000
            INNER JOIN topalbums ON (top5000.artist = topalbums.artist AND
            top5000.year = topalbums.year)
            WHERE (top5000.artist = "${user.artist}")
            ORDER BY top5000.position;`
                ,
                ((err, res) => {
                    if (err) throw err;
                    if (res.length == 0) {
                        console.log("No matches have been found!");
                        searchAlbumSong();
                    }
                    else {
                        res.forEach((song) => {
                            console.log(`Position: ${song.position} || Artist: ${song.artist}|| Album: ${song.album}  || Song: ${song.song}|| Year: ${song.year}`);
                        })
                        nodeStart();
                    }
                }))
        })
};

// Search by album to see if any of it's songs made it into the Top 5000 Song Chart
const searchSongsInAlbum = () => {
    inquirer.prompt(
        {
            type: `input`,
            name: `album`,
            message: `What is the albums name?`
        }
    )
        .then((user) => {
            connection.query(
                `SELECT top5000.position, top5000.artist, top5000.song,top5000.year, topalbums.album
                FROM top5000 
                INNER JOIN topalbums ON (top5000.artist = topalbums.artist AND top5000.year = topalbums.year)
                WHERE topalbums.album = "${user.album}";`,
                ((err, res) => {
                    if (err) throw err;
                    if (res.length == 0) {
                        console.log("No songs from this album made it to the top5000 list!")
                        searchSongsInAlbum();
                    }
                    else {
                        res.forEach((song) => {
                            console.log(`Position: ${song.position} || Artist: ${song.artist}|| Album: ${song.album}  || Song: ${song.song}|| Year: ${song.year}`);
                        })
                        nodeStart();
                    }
                }))
        })
};

// Connection to sql
connection.connect((err, res) => {

    if (err) throw error;
    console.log('Connected to database');
    nodeStart();

});