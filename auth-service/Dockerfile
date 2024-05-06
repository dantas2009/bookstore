FROM maven:3.8.5-openjdk-17 AS build

COPY target/auth-service-0.0.2.jar auth-service-0.0.2.jar

ENTRYPOINT ["java","-jar","/auth-service-0.0.2.jar"]