"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Filter, Search, X, Plus } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/types/task";
import { useTaskContext } from "@/store/task-context";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  const { state, setFilters, setSortOrder, clearAllFilters } = useTaskContext();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const isMobile = useIsMobile();

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handlePriorityFilter = (priority: TaskPriority | "All") => {
    setFilters({ priority });
  };

  const handleStatusFilter = (status: TaskStatus | "All") => {
    setFilters({ status });
  };

  const toggleSortOrder = () => {
    setSortOrder(state.sortOrder === "asc" ? "desc" : "asc");
  };

  // Check if any filters are active
  const hasActiveFilters =
    state.filters.search !== "" ||
    state.filters.priority !== "All" ||
    state.filters.status !== "All" ||
    state.sortOrder !== "asc";

  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (state.filters.search !== "") count++;
    if (state.filters.priority !== "All") count++;
    if (state.filters.status !== "All") count++;
    if (state.sortOrder !== "asc") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* First Row - Logo and Search */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
            Studio137
            <div className="text-xs">LOGO</div>
          </div>

          {/* Desktop Search */}
          {!isMobile && (
            <div className="relative max-w-sm flex-1 ml-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={state.filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Mobile Search Button */}
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={`bg-transparent ${
                showMobileSearch ? "border-blue-500 text-blue-600" : ""
              }`}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile Search Input (when expanded) */}
        {isMobile && showMobileSearch && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={state.filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Second Row - Tasks Title and Actions */}
        <div className="flex items-center justify-between pb-4">
          {/* Tasks Title */}
          <h1 className="text-2xl font-bold">Tasks</h1>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* Add Task Button */}
            <Button
              onClick={onAddTask}
              className="bg-custom-red hover:bg-red-800 flex items-center gap-2 sm:w-[207px]"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>

            {/* Sort Button */}
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className={`flex items-center gap-2 bg-transparent ${
                state.sortOrder !== "asc"
                  ? "border-custom-red text-custom-red"
                  : "border-custom-red text-custom-red"
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>

            {/* Filter Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 bg-transparent relative border-custom-red text-custom-red`}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-custom-red text-white"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 px-2 text-custom-red hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Priority</h4>
                    <Select
                      value={state.filters.priority}
                      onValueChange={handlePriorityFilter}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Status</h4>
                    <Select
                      value={state.filters.status}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pb-4">
            {state.filters.search && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Search: "{state.filters.search}"
                <button
                  onClick={() => setFilters({ search: "" })}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {state.filters.priority !== "All" && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Priority: {state.filters.priority}
                <button
                  onClick={() => setFilters({ priority: "All" })}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {state.filters.status !== "All" && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                Status: {state.filters.status}
                <button
                  onClick={() => setFilters({ status: "All" })}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {state.sortOrder !== "asc" && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                Sort: Descending
                <button
                  onClick={() => setSortOrder("asc")}
                  className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 bg-transparent"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
