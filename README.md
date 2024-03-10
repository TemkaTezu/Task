## Project Overview
This project encompasses a robust REST API coupled with a Database module and with a Website.
The REST API is built on Node.js, leveraging the NestJS framework, while the database relies on MongoDB and Website  is built on React Typescript, leveraging the NextJS framework,
The application is containerized using Docker for seamless deployment and execution.

## Setup
### Before initiating the project, ensure the following steps are completed:
#### 1. Configure Environment Variables
Create a ".env" file in the "./api/" folder where the "package.json" file is located, and populate it with the following variables:
```bash
PORT=3000
CONNECTION_STRING=mongodb://admin:password@localhost:27017
AWS_ACCESS_KEY_ID=[YOUR AWS ACCESS KEY]
AWS_SECRET_ACCESS_KEY=[YOUR AWS SECRET ACCESS KEY]
AWS_REGION=[YOUR AWS REGION]
AWS_BUCKET_NAME=[YOUR AWS S3 BUCKET NAME]
```
Create a ".env.local" file in the "./front/" folder where the "package.json" file is located, and populate it with the following variables:
```bash
PORT=3000
NEXT_PUBLIC_API_URL=http://[YOUR IPv4 Address]
```

#### 2. Docker Installation
Ensure Docker is installed on your machine to facilitate containerization.

## Getting Started
#### 1. Run Docker Compose
Open a terminal in the "./" root folder, then execute the following command:
```bash
docker-compose up -d
```