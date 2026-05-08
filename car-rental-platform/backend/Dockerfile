FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw || true
RUN ./mvnw clean package || mvn clean package

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/car-rental-backend-1.0.0.jar"]