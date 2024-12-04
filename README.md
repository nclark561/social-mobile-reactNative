# Twitter Dupe App

## Overview
Twitter Dupe is a full-stack social media application that mimics core features of Twitter. It consists of an **Expo (React Native)** frontend and a **Python (FastAPI)** backend. Users can perform actions such as posting tweets, liking, commenting, and viewing feeds. This app is a portfolio project that demonstrates scalable architecture, efficient API usage, and modern development practices.

---

## Features

### Frontend
- **Built with Expo (React Native):** Ensures compatibility across iOS, and web.
- **Interactive Feed:** Users can view and scroll through a timeline of posts.
- **Tweet Management:** Users can create, edit, delete, and interact with tweets.
- **Comment System:** Supports nested comments with a visually intuitive design.
- **Authentication:** Login and user sessions integrated with the backend.
- **Responsive Design:** Optimized for different screen sizes and devices.
- **Real-Time Messaging :** Using WebSockets for instant messages.

### Backend
- **Powered by Python and FastAPI:** Provides a robust and scalable RESTful API.
- **PostgreSQL Database:** Manages user data, tweets, likes, and comments.
- **Authentication and Authorization:** User authentication with token-based security.
- **Scalable API Design:** API endpoints designed for high traffic.

---

## Tech Stack

### Frontend
- **Framework:** Expo (React Native)
- **State Management:** React Context API / Redux (optional for larger apps)
- **UI Components:** Custom styling and third-party libraries (e.g., React Native Paper)

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** OAuth2 / JWT
- **Hosting:** Deployed via platforms like Vercel, AWS, or DigitalOcean

---

## Installation

### Prerequisites
- Node.js (for Expo)
- Python 3.9+
- PostgreSQL

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/nclark561/social-mobile-reactNative.git
   cd social-mobile-reactNative
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo server:
   ```bash
   expo start
   ```

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/kaleckh/FastAPI-Python_Server.git
   cd FastAPI-Python_Server
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows, use venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   - Create a PostgreSQL database.
   - Update the database URL in `config.py` or environment variables.

   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/twitter_dupe"
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the FastAPI server:
   ```bash
   uvicorn app:main --host 0.0.0.0 --port 8000
   ```

---

## Deployment

### Frontend Deployment
- Use Expo to build and deploy the app:
  ```bash  
  expo build:ios
  ```
- Host the web version using Vercel or Netlify.


## API Endpoints

### Authentication
- `POST /users/create`: Register a new user.

<!-- ### Tweets
- `GET /tweets`: Get all tweets.
- `POST /tweets`: Create a new tweet.
- `DELETE /tweets/{id}`: Delete a tweet by ID.

### Comments
- `GET /tweets/{id}/comments`: Get comments for a tweet.
- `POST /tweets/{id}/comments`: Add a comment to a tweet. -->


## Future Improvements
- Add support for image and video uploads.
- Implement advanced search and hashtags.
- Real-time updates for tweets, likes, and comments using WebSockets.
- Push notifications for mobile users.


## Contact
For any questions or inquiries, reach out to:
- **Email:** kaleckh@gmail.com
- **GitHub:** [https://github.com/kaleckh]
- **LinkedIn:** [https://linkedin.com/in/kaleck-hamm]

- **Email:** noahwebedev@gmail.com
- **GitHub:** [https://github.com/nclark561]
- **LinkedIn:** [https://www.linkedin.com/in/noah-clark-62532426b/]

