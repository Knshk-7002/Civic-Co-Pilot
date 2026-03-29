# Civic Co-Pilot

## AI-Simulated Civic Grievance and Scheme Recommendation System (Java-Based)

---

# 🚀 Project Overview

**Civic Co-Pilot** is a Java-based backend system designed to streamline grievance handling, improve transparency, and enhance awareness of schemes/services for students and citizens.

The system provides:

* A unified platform for complaint submission
* Rule-based intelligent classification (AI simulation)
* Real-time complaint tracking
* Personalized scheme recommendations

This project demonstrates how **core Java concepts and clean architecture** can be applied to solve real-world governance problems.

---

# 🎯 Key Features

## 1. Complaint Submission

* Users can submit complaints in natural language
* System automatically assigns:

  * Category
  * Priority
  * Department

---

## 2. AI-Simulated Classification

* Uses keyword-based logic instead of ML
* Fast, lightweight, and suitable for academic implementation

---

## 3. Complaint Tracking System

* Track complaint lifecycle:

  * Submitted
  * In Progress
  * Resolved

---

## 4. Scheme Recommendation Engine

* Suggests schemes based on:

  * User type
  * Complaint category

---

## 5. Admin Dashboard

* View all complaints
* Update complaint status
* Handle prioritized complaints

---

# 🧠 Problem Statement

Citizens and students face challenges in:

* Identifying where to submit complaints
* Understanding available schemes
* Tracking complaint progress

Existing systems are:

* Fragmented
* Non-transparent
* Not user-friendly

---

# 💡 Solution

Civic Co-Pilot solves this by providing:

* A centralized grievance system
* Rule-based classification engine
* Transparent tracking mechanism
* Scheme recommendation system

The project replaces complex AI with a **rule-based decision engine**, making it practical for a Java-based implementation.

---

# 🏗️ System Architecture

```plaintext
Client (Postman / Basic UI)
        │
Spring Boot Backend (Civic Co-Pilot)
        │
MySQL Database
```

Architecture Type:

* Layered Architecture
* Modular Design

---

# 🛠️ Tech Stack

| Layer      | Technology      |
| ---------- | --------------- |
| Language   | Java (JDK 17+)  |
| Framework  | Spring Boot     |
| Database   | MySQL           |
| ORM        | Hibernate / JPA |
| Build Tool | Maven           |
| Testing    | JUnit           |

---

# 📂 Project Structure

```plaintext
civic-co-pilot/
│
├── src/main/java/com/civiccopilot/
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── service/impl/
│   ├── ai/
│   ├── dto/
│   ├── exception/
│   ├── util/
│   └── workflow/
│
├── src/main/resources/
│   ├── application.yml
│   ├── schema.sql
│   └── data.sql
│
├── src/test/
│
├── database/
│   └── schema.sql
│
├── docs/
│
└── pom.xml
```

---

# 🧩 Modules

## 1. User Module

* Registration and login
* Role-based access

---

## 2. Complaint Module

* Submit complaints
* Auto classification
* Status tracking

---

## 3. Scheme Module

* Store schemes
* Recommend schemes

---

## 4. Admin Module

* View and manage complaints
* Update status

---

# 🗄️ Database Design

Entities:

* User
* Role
* Complaint
* Department
* Scheme
* StatusHistory
* Recommendation

---

# ⚙️ Example AI Logic (Rule-Based)

```java
public String classifyComplaint(String text) {
    if(text.contains("fee") || text.contains("payment"))
        return "FINANCE";
    else if(text.contains("hostel") || text.contains("room"))
        return "HOSTEL";
    else
        return "GENERAL";
}
```

---

# 🔗 API Endpoints (Sample)

## Authentication

* POST /api/auth/register
* POST /api/auth/login

## Complaint

* POST /api/complaints
* GET /api/complaints/{id}
* PUT /api/complaints/{id}/status

## Scheme

* GET /api/schemes
* GET /api/schemes/recommend/{userId}

## Admin

* GET /api/admin/complaints

---

# 🧪 Testing

* Unit testing using JUnit
* API testing using Postman

---

# ⚡ Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/your-username/civic-co-pilot.git
```

---

## 2. Configure Database

* Create MySQL database
* Update `application.yml`

---

## 3. Run Application

```bash
mvn spring-boot:run
```

---

## 4. Test APIs

* Use Postman
* Base URL: `http://localhost:8080`

---

# 📈 Future Enhancements

* Integration with real AI/ML models
* Mobile application
* Real-time notifications
* Government API integration

---

# 🎓 Learning Outcomes

This project demonstrates:

* Object-Oriented Programming
* Layered architecture
* REST API design
* Database integration
* Rule-based decision systems

---

# 🏁 Conclusion

Civic Co-Pilot showcases how a structured Java backend system can simulate intelligent governance workflows using clean architecture and rule-based logic.

It is designed to be:

* Academically relevant
* Technically strong
* Scalable for future enhancements

---

# 📌 Final Statement

> Civic Co-Pilot is a unified, scalable, and efficient Java-based system that transforms grievance handling into a transparent and intelligent workflow.
