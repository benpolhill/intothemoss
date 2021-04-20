#!/bin/bash

while read line; do
    IP=$(echo $line | awk '{print $1;}')
    LOCATION=$(curl -s "https://freegeoip.app/csv/$IP")
    HOST=$(host $IP | sed 's/.*\(domain name pointer .*\)/\1/g')
    TIME=$(echo $line | cut -d "[" -f2 | cut -d "]" -f1)
    EP=$(echo $line | sed 's/.*episodes\/audio\/\(.*\.mp3\).*/\1/g')
    echo "$EP accessed at $TIME"
    echo "from $LOCATION"
    echo "by $HOST"
    echo " "
done <log.txt

