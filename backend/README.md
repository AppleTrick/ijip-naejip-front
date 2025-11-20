# SafeHome Backend ⚙️

This directory contains the backend source code for the SafeHome application.

## Tech Stack

- **Framework**: Spring Boot
- **Language**: Java
- **Build Tool**: Maven

## Project Setup

### Prerequisites

- Java Development Kit (JDK) 17 or later
- Maven

### Installation & Running

1. Navigate to the backend directory.
2. Run the application using Maven:

```bash
./mvnw spring-boot:run
```

(Or use your IDE's run configuration)

## API Endpoints

- `/api/v1/analysis/safety-check`: Performs safety analysis on a property.

## Configuration

- `src/main/resources/application.properties`: Application configuration settings.
