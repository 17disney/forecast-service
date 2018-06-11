docker stop 17disney-forecast-service \
; docker rm 17disney-forecast-service \
; cd /app/forecast-service \
&& git pull \
&& docker build -t 17disney-forecast-service . \
&& docker run -e TZ="Asia/Shanghai" -d -p 28201:80 --name 17disney-forecast-service \
--mount type=bind,source=/app/config/forecast-service,target=/app/config \
17disney-forecast-service npm run docker
