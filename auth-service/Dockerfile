FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn package

FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY --from=builder /app/target/auth-*.jar ./auth.jar

ENTRYPOINT ["java", "-jar", "auth.jar"]