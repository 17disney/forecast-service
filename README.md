# 17Disney Forecast Service

## docker
```shell
docker stop 17disney-forecast-service \
&& docker rm 17disney-forecast-service \
&& cd /app/forecast-service \
&& docker build -t 17disney-forecast-service . \
&& docker run -e TZ="Asia/Shanghai" -d -p 28201:7001 --name 17disney-forecast-service \
--mount type=bind,source=/app/config/forecast-service,target=/app/config \
17disney-forecast-service npm run dev
```
