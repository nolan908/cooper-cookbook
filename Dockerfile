FROM maven:3-eclipse-temurin-21 AS build
ADD . /project
WORKDIR /project
RUN mvn -e -Dmaven.test.skip package

FROM eclipse-temurin:21-jre
COPY --from=build /project/target/cookbook-0.0.1-SNAPSHOT.jar /app/cookbook.jar
ENTRYPOINT ["java", "-jar", "/app/cookbook.jar"]