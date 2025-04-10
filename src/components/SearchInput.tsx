import { Input } from "@/components/ui/input";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

export function SearchInput({ searchValue, setSearchValue }: any) {
  const id = useId();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchValue) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [searchValue]);

  return (
    <div className="space-y-2 w-full">
      <div className="relative">
        <Input
          id={id}
          className="peer pe-14 ps-6 bg-primary/10 rounded-xl py-6 text-base border-none"
          placeholder="Search..."
          autoFocus
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-8 text-primary peer-disabled:opacity-50">
          {isLoading ? (
            <LoaderCircle
              className="animate-spin"
              size={16}
              strokeWidth={2}
              role="status"
              aria-label="Loading..."
            />
          ) : (
            <Search className="size-4" strokeWidth={2} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
