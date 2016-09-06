PackageWatcher
--------------
* Watches for new packages
* Pings FedooralExpress with them when they happen

FedooralExpress
---------------
* HipChat bot
* Receives pings from PackageWatcher
* Pings #Masonite when there's a new package

Mongo
-----
* Persistence
* Data volume

Redis
-----
* HipChat Bot token persistence
* Data volume

Docker Compose
--------------

bot:
    image: jbrjake/fingerbang
    links:
        - redis
    ports:
        - 80:3000
    command: node app.js

redis:
    image: jbrjake/redis
    ports:
        - 6379:6379
    volumes:
        - /data/db
        
watcher:
    image: jbrjake/packagetracker
    links:
        - mongo:mongo
        - bot:bot

mongo:
    volumes:
        - /data/db
    image: mongo
    expose:
        - "27017"

new redis dockerfile:
---------------------

FROM ubuntu:14.04
RUN apt-get update && apt-get install -y redis-server
VOLUME ["/var/lib/redis"]
EXPOSE 6379
ENTRYPOINT ["/usr/bin/redis-server --dir /data/db/"]
