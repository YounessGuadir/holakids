FROM maven:3.9.11-eclipse-temurin-21-alpine AS build

WORKDIR /workspace

COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY src ./src
# The runnable image must not be blocked by IDE/test-slice configuration.
# Tests remain available and can be launched explicitly with: mvn test
RUN mvn -B -q clean package -Dmaven.test.skip=true

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S holakids && adduser -S holakids -G holakids

WORKDIR /app

COPY --from=build /workspace/target/holakids-backend.jar app.jar

RUN mkdir -p /app/uploads && chown -R holakids:holakids /app

USER holakids

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=65.0", "-XX:+UseSerialGC", "-jar", "/app/app.jar"]
