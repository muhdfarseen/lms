import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconPlus,
  IconSearch,
  IconLayoutList,
  IconBook,
  IconLock,
  IconWorld,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLMS } from "@/hooks/use-lms-store";

export function CurriculumPage() {
  const navigate = useNavigate();
  const { curricula, courses } = useLMS();
  const [search, setSearch] = useState("");

  const filtered = curricula.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const getCourseNames = (courseIds: string[]) =>
    courseIds.map((id) => courses.find((c) => c.id === id)?.title ?? "Unknown");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Curriculum</h1>
        </div>

        <div className="flex gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search curricula…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => navigate("/curriculum/new")}
            className="self-start"
          >
            <IconPlus data-icon="inline-start" />
            Create Curriculum
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <IconLayoutList className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {search
                ? "No curricula match your search"
                : "No curricula yet. Create your first one!"}
            </p>
          </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cur) => {
            const courseNames = getCourseNames(cur.courseIds);
            return (
              <Card
                key={cur.id}
                className="group flex cursor-pointer flex-col transition-shadow hover:shadow-md gap-2"
                onClick={() => navigate(`/curriculum/${cur.id}/edit`)}
              >
                <CardHeader className="gap-3 pb-3">
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant={cur.status === "published" ? "default" : "secondary"}>
                      {cur.status === "published" ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {cur.visibility === "public" ? (
                        <IconWorld className="size-3" />
                      ) : (
                        <IconLock className="size-3" />
                      )}
                      {cur.visibility}
                    </Badge>
                  </div>
                  
                  <CardTitle className="line-clamp-2 text-base leading-snug">
                    {cur.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-2 text-xs">
                    {cur.description}
                  </CardDescription>

                  
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      {cur.courseIds.length} course{cur.courseIds.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex flex-col gap-1">
                      {courseNames.slice(0, 2).map((name, i) => (
                        <div key={i} className="flex items-center gap-1.5 min-w-0">
                          <IconBook className="size-3 shrink-0 text-muted-foreground" />
                          <span className="text-xs truncate">{name}</span>
                        </div>
                      ))}
                      {courseNames.length > 2 && (
                        <span className="text-xs text-muted-foreground pl-[18px]">
                          +{courseNames.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
