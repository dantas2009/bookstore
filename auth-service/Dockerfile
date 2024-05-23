# Estágio de construção
FROM maven:3.8.5-openjdk-17 AS builder

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo pom.xml e a pasta src para o diretório de trabalho
COPY pom.xml .
COPY src ./src

# Executar o Maven para compilar o projeto e criar o pacote
RUN mvn package

# Estágio de execução
FROM openjdk:17-jdk-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o jar do estágio de construção para o diretório de trabalho do container
COPY --from=builder /app/target/auth-*.jar ./auth.jar

# Definir o entrypoint para executar a aplicação
ENTRYPOINT ["java", "-jar", "auth.jar"]