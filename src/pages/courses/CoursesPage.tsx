import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconPlus,
  IconSearch,
  IconBook,
  IconStack2,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLMS } from "@/hooks/use-lms-store";

export function CoursesPage() {
  const navigate = useNavigate();
  const { courses } = useLMS();
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        </div>

        <div className="flex gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => navigate("/courses/new")}
            className="self-start"
          >
            <IconPlus data-icon="inline-start" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
       
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <IconBook className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {search
                ? "No courses match your search"
                : "No courses yet. Create your first one!"}
            </p>
          </div>
        
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="group flex cursor-pointer flex-col transition-shadow hover:shadow-md"
              onClick={() => navigate(`/courses/${course.id}/preview`)}
            >
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      course.status === "published" ? "default" : "secondary"
                    }
                    className="gap-1"
                  >
                    {course.status}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    {course.visibility === "public" ? (
                      <IconWorld className="size-3" />
                    ) : (
                      <IconLock className="size-3" />
                    )}
                    {course.visibility}
                  </Badge>
                </div>

                <CardTitle className="line-clamp-2 text-base leading-snug">
                  {course.title}
                </CardTitle>

                <CardDescription className="line-clamp-2 text-xs">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="mt-auto pt-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IconStack2 className="size-3.5" />
                  <span>{course.modules.length} modules</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
