# Responsive Order Table with Filtering 

Your task is to create a responsive and visually appealing webpage that displays a table of orders and includes functionality to filter the orders by their status.


## Features 

1. **Fully responsive generic table**  that looks good on both desktop and mobile devices.
2. A dropdown menu to **filter** the table based on the order status.
3. A search bar to search orders by customer name or ID. Include a message (e.g., "No orders found") when the table is empty after filtering.
4. Modern React best practices (e.g., functional components, hooks).
5. A **"Sort by Date"** feature to sort orders by the `createdAt` field on table header clicked. (Also added sort by `ID` with columns can be marked as sortable )
6. Light/Dark Themes with toggle button.
7. Strong type checking using TS features 

## Project setup 

1. Clone this repository using git : 

```bash 
git clone https://github.com/sakr2000/ReactTableComponent-task.git
```

2. Go to the cloned folder and install the project dependencies:

```bash
cd ReactTableComponent-task

bun install
```

> **Note**: I used [Bun](https://bun.sh/) as the package manager in this project. You can use [Npm](https://www.npmjs.com/) or any other package manager you prefer. 

3. Run the development server:

```bash
bun run dev 
```

