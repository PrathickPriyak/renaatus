import { Input } from "@/design-system/components/input";
import { Select } from "@/design-system/components/select";
import { Button } from "@/design-system/components/button";
import type { PublicBlogCategory } from "@/lib/blog/public";

type BlogFiltersProps = {
  q: string;
  category: string;
  categories: PublicBlogCategory[];
};

export function BlogFilters({ q, category, categories }: BlogFiltersProps) {
  return (
    <form
      method="get"
      action="/blog"
      className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)_auto]"
    >
      <label className="sr-only" htmlFor="blog-search">
        Search journal
      </label>
      <Input
        id="blog-search"
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Search published notes"
      />
      <label className="sr-only" htmlFor="blog-category">
        Category
      </label>
      <Select id="blog-category" name="category" defaultValue={category}>
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </Select>
      <Button type="submit" variant="secondary" className="w-full sm:w-auto">
        Filter
      </Button>
    </form>
  );
}
