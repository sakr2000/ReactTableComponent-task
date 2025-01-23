export interface Order {
  id: number;
  customerName: string;
  status: "New" | "Picking" | "Delivering" | "Delivered";
  items: string[];
  createdAt: string;
}