1.	Project Title
Taskify – Organize and Manage your Tasks
2.	Problem Statement
In today’s fast-paced world, managing tasks efficiently can be overwhelming. It’s easy to lose track of deadlines, forget important to-dos, and struggle to stay organized. Taskify aims to solve this problem by offering a simple yet powerful platform to create, manage, and track tasks seamlessly. With features for prioritization, progress tracking, and productivity insights, Taskify helps users stay focused and get things done — all in one place.
3.	System Architecture
Structure:
Frontend → Backend (API) → Database
Architecture Description:
•	Frontend: Next.js application for user interaction and managing tasks.
•	Backend: Node.js + Express.js REST API to handle authentication and task management.
•	Database: PostgreSQL for structured and reliable storage of user profiles, tasks, and activity data.

Hosting Plan:
•	Frontend: Vercel
•	Backend: Render
•	Database: Neon
4.	Key Features
Authentication & Authorization
Secure user registration, login, and logout using JWT-based authentication. Users can also log in seamlessly through Google OAuth for faster access.
Profile Management
Users can manage their profiles, update personal details, and view task-related preferences such as priority levels, categories, and progress history.
Task Management (CRUD)
Users can create, read, update, and delete tasks with complete metadata — including title, priority, labels, and status — ensuring full control over their to-do lists.
Searching
Users can search for tasks by title, status, or priority level to quickly find what they need.
Pagination
Task listings and search results are paginated for smoother navigation and better performance when managing large task datasets.
Sorting
Tasks can be sorted by priority, or creation date, allowing users to organize their workflow efficiently.
Filtering
Users can filter tasks by status (e.g., completed, pending), priority, or category to focus on specific goals.
User Interaction
Users can mark tasks as complete, edit task details, delete outdated tasks, or manage their overall productivity dashboard.
Frontend Routing
Smooth client-side navigation between pages such as Home, Login, Signup, Dashboard, and Task Details.

5.	Tech Stack

Layer	Technologies
Frontend	React.js, Next.js, TailwindCSS, Shadcn, Radix
Backend	Node.js, Express.js
Database	Postgres
Authentication	JWT-based login/signup & Google OAuth with JWT
Hosting	Vercel (Frontend), Render (Backend), NeonDB - Postgres (Database)
 
6.	API Overview

Endpoint	Method	Description	Access
/api/auth/register	POST	Register a new user	Public
/api/auth/login	POST	Authenticate and return JWT token	Public
/api/auth/oauth	POST	Authenticate google code and return JWT token	Public

/api/tasks	
GET	Fetches all tasks (with pagination/filtering/sorting
)	Authenticated
/api/tasks	POST	Create new task	Authenticated
/api/tasks/:id	PATCH	Update task details	Authenticated
/api/tasks/:id	DELET E	Delete a task	Authenticated

<img width="460" height="745" alt="image" src="https://github.com/user-attachments/assets/19f2c607-434c-4f87-8a58-331e08069f93" />


7. Hosted links
Frontend: taskify-beta-ten.vercel.app
Backend: https://taskify-c7yg.onrender.com
Database: https://console.neon.tech/app/projects/raspy-meadow-09516285?database=neondb
