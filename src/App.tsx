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
    // Sort the filtered orders by date
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
    <div className="bg-background flex min-h-screen flex-col items-center transition-colors">
      <div className="w-full flex-1 space-y-6 p-4 sm:mx-auto sm:max-w-6xl sm:p-8">
        <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex items-center gap-3">
            <StatusDropdown
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            <ThemeToggle />
          </div>
        </div>

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
    </div>
  );
}
