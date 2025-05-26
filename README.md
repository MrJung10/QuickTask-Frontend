# QuickTask Frontend

## Project Description

**QuickTask** is a modern task and project management web application built with **Next.js 15.1.8**, **TypeScript**, and **Tailwind CSS**. It provides a user-friendly dashboard to track ongoing projects, active tasks, team members, and task statuses.

It integrates with a backend API using **Zustand** for state management and **Axios** for HTTP requests.

### 🔑 Key Features

- **Dashboard Overview**: Displays total projects, active tasks, team members, and task status counts (To Do, In Progress, Review, Done).
- **Recent Projects**: Lists up to four recent projects with details like name, status, member count, and due date.
- **Authentication**: Token-based authentication via cookies, managed by an Axios interceptor.

> Designed for scalability, type safety, and a seamless user experience using the **Next.js App Router**.

---

## 🛠 Setup and Installation Instructions

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **Git**
- **Backend API**: Running and accessible (e.g., `https://api.example.com/api`)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quicktask-frontend.git
cd quicktask-frontend
```

#### 2. Install Dependencies
```bash
npm install
```
> Key dependencies:
> - "`next@15.1.8`"
> - "`react`, `react-dom`"
> - "`typescript`, `@types/node`, `@types/react`"
> - "`axios`, `js-cookie`"
> - "`zustand`"
> - "`date-fns`"
> - "`lucide-react`"
> - "`@/components/ui` **(assumed to be a custom UI lib)**"

#### 3. Configure Environment Variables
Create a `.env` file in the project root:
```
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```
Replace the URL with your actual backend API.


#### 4. Run Development Server
```
npm run dev
```
> Visit: http://localhost:3000

#### 5. Build for Production
```
npm run build
npm start
```