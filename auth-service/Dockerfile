#
# Build stage
#
FROM maven:3.8.5-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package
EXPOSE 8081
ENTRYPOINT ["java","-jar","/home/app/target/auth-service-0.0.1.jar"]