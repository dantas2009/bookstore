FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY --from=builder /app/target/gateway-service*.jar ./api-gateway.jar

ENTRYPOINT ["java", "-jar", "api-gateway.jar"]