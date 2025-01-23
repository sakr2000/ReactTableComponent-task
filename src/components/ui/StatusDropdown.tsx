import { ChevronDown, Package, PackageCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const statusIcons = {
  New: <Package className="h-4 w-4 text-blue-500" />,
  Picking: <PackageCheck className="h-4 w-4 text-yellow-500" />,
  Delivering: <Truck className="h-4 w-4 text-purple-500" />,
  Delivered: <PackageCheck className="h-4 w-4 text-green-500" />,
};

interface StatusDropdownProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusDropdown({
  selectedStatus,
  onStatusChange,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="light:bg-white flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm outline-none hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 dark:bg-stone-950 dark:hover:bg-stone-800"
      >
        <span className="flex items-center gap-2">
          {selectedStatus !== "all" &&
            statusIcons[selectedStatus as keyof typeof statusIcons]}
          <span className="capitalize">
            {selectedStatus === "all" ? "All Orders" : selectedStatus}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border-none bg-white shadow-lg">
          <div className="rounded-md dark:bg-stone-950">
            <button
              onClick={() => {
                onStatusChange("all");
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-stone-800"
            >
              All Orders
            </button>
            {Object.entries(statusIcons).map(([status, icon]) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-stone-800"
              >
                {icon}
                <span className="capitalize">{status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
