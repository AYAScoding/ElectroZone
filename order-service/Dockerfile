# Build stage: use Maven + JDK 17 to build the jar
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom and source
COPY pom.xml .
COPY src ./src

# Package the application (skip tests to speed up)
RUN mvn clean package -DskipTests

# Run stage: use slim JRE 17 image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from the build stage
COPY --from=build /app/target/order-service-0.0.1-SNAPSHOT.jar app.jar

# Expose app port
EXPOSE 8082

ENTRYPOINT ["java","-jar","app.jar"]
