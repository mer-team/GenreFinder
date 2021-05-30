# Obtain Music Genre with [Last.fm API](https://www.last.fm/api)

This service is connected with ['Manager'](https://github.com/mer-team/Tests/blob/rabbit-manager/Manager/manager.js) service through [RabbitMQ](https://www.rabbitmq.com/). Get the five most suitable music genres for each song.

Run `python3.7 last_fm.py`

## Input through RabbitMQ

```javascript
{ "song": "Track Name", "artist": "Artist Name" }
                     OR                      
{ "song": "Undefined", "artist": "Undefined" }
```

## Output
There is an error in the procedure of obtaining the musical genres:
```javascript
{ "Service": "GenreFinder", "Error": "True", "Result": "Error message" }
```

Obtaining the musical genres succeed:
```javascript
{ "Service": "GenreFinder", "Error": "False", "Result": "Genres" }
```

### Docker Params
| Arg | Default | Description |
| --- | --- | --- |
| HOST | localhost | RabbitMQ host |
| USER | guest | HTTP basic auth username  |
| PASS | guest | HTTP basic auth password |
| PORT | 5672 | RabbitMQ Port |
| MNG_PORT | 15672 | RabbitMQ Management Port |
| TIME | 10 | Timeout to check if the service is up |
| LAST_FM_KEY | apikey | Last FM API key |

### Run Local Microservice
Run Rabbit
```
docker run -d -e RABBITMQ_DEFAULT_USER=merUser -e RABBITMQ_DEFAULT_PASS=passwordMER -p 15672:15672 -p 5672:5672 rabbitmq:3-management-alpine
```

Build local `genreFinder` from source
```
docker build -t genrefinder:local .
```

Run local `genreFinder`
```
docker run -e TIME=10 -e USER=merUser -e PASS=passwordMER -e HOST=localhost -e PORT=5672 -e MNG_PORT=15672 -e LAST_FM_KEY=apikey --net=host genrefinder:local
```

Run official `genreFinder` image locally
```
docker run -e TIME=10 -e USER=merUser -e PASS=passwordMER -e HOST=localhost -e PORT=5672 -e MNG_PORT=15672 -e LAST_FM_KEY=apikey --net=host merteam/genrefinder:latest
```

## Tests
The tests can be accessed on the `test` folder. Test list:
- [x] Check the RabbitMQ connection
- [x] Create a RabbitMQ channel
- [x] Send a music to find the genre
- [x] Check the api response and compare it to the expected one