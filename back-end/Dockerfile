# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml first to leverage Docker layer cache for dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the JAR (skip tests for Docker build)
COPY src ./src
RUN mvn package -DskipTests -B

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Add non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the fat JAR from the build stage
COPY --from=builder /app/target/back-end-0.0.1-SNAPSHOT.jar app.jar

RUN chown spring:spring app.jar
USER spring

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
