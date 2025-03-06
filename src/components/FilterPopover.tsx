import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

import { ListFilter } from "lucide-react";

export function FilterPopover({
  setSortByRating,
  sortByRating,
  setShowMovies,
  showMovies,
  setShowSeries,
  showSeries
}) {

  function handleApplyFilters() {
    console.log({ movies, series, sortByRating});
  }

  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Filters">
            <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-3 mr-6">
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Filters</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox onCheckedChange={setShowMovies} checked={showMovies} id={`movies`} />
                <Label htmlFor={`movies`} className="font-normal">
                  Movies
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox onCheckedChange={setShowSeries} checked={showSeries} id={`Series`} />
                <Label htmlFor={`Series`} className="font-normal">
                  Series
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox onCheckedChange={setSortByRating} checked={sortByRating} id={`sort-rating`} />
                <Label htmlFor={`sort-rating`} className="font-normal">
                  Sort by rating
                </Label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
