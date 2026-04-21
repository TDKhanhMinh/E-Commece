# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies trước (cache layer)
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# Stage 2: Runtime — image nhỏ hơn nhiều
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user không có quyền root (bảo mật)
RUN addgroup -S logistics && adduser -S logistics -G logistics
USER logistics

COPY --from=builder /app/target/*.jar app.jar

# Port Spring Boot lắng nghe
EXPOSE 8080

# Entrypoint — JAVA_OPTS được inject từ docker-stack.yml
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --spring.profiles.active=prod"]
