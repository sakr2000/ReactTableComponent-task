import { useState } from "react";
import { Package, PackageCheck, Truck } from "lucide-react";
import type { Order } from "./types";
import { ThemeToggle } from "./components/ThemeToggle";
import { StatusDropdown } from "./components/ui/StatusDropdown";
import Table, { Column } from "./components/Table";
import { orders } from "./data/ordersData";

const statusIcons = {
  New: <Package className="h-4 w-4 text-blue-500" />,
  Picking: <PackageCheck className="h-4 w-4 text-yellow-500" />,
  Delivering: <Truck className="h-4 w-4 text-purple-500" />,
  Delivered: <PackageCheck className="h-4 w-4 text-green-500" />,
};

export default function App() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });

  // Define the table columns
  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: (value) => `#${value}`,
      sortable: true,
    },
    {
      header: "Customer",
      accessorKey: "customerName",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => (
        <div className="flex items-center gap-2">
          {statusIcons[value as keyof typeof statusIcons]}
          <span>{value as string}</span>
        </div>
      ),
    },
    {
      header: "Items",
      accessorKey: "items",
      cell: (value) => (value as string[]).join(", "),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (value) => new Date(value as string).toLocaleDateString(),
      sortable: true,
    },
  ];

  const filteredOrders = orders
    .filter((order) =>
      selectedStatus === "all" ? true : order.status === selectedStatus,
    )
    .filter(
      (order) =>
        order.customerName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()) ||
        order.id.toString().includes(searchQuery.trim()),
    )
    // Sort the filtered orders by date base on the sortConfig state
    .sort((a, b) => {
      const dateA = new Date(a[sortConfig.key] as string).getTime();
      const dateB = new Date(b[sortConfig.key] as string).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleSort = (key: keyof Order) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <section className="bg-background flex min-h-screen flex-col items-center transition-colors">
      <div className="w-full flex-1 space-y-6 p-4 sm:mx-auto sm:max-w-6xl sm:p-8">
        <header className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex items-center gap-3">
            {/* Theme toggle to toggle between light and dark mode */}
            <ThemeToggle />
          </div>
        </header>

        <div className="flex w-full items-center justify-between gap-4 max-sm:flex-col">
          {/* Search bar to filter orders base on customer name or order id */}
          <div className="flex w-full grow items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 dark:bg-stone-950 dark:hover:bg-stone-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Status dropdown to filter orders base on status */}
          <StatusDropdown
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {/* Table to display the filtered orders */}
        <Table
          data={filteredOrders}
          columns={columns}
          sortConfig={{
            key: sortConfig.key,
            direction: sortConfig.direction,
            onSort: handleSort,
          }}
          emptyMessage="No orders found"
          striped
        />
      </div>
    </section>
  );
}
