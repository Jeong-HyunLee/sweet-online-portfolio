import { BookOpen, Star } from "lucide-react";

interface Course {
  name: string;
  level: string;
  semesters: { term: string; enrollment: number; evaluation: string }[];
}

const courses: Course[] = [
  {
    name: "Sedimentology and Laboratory",
    level: "2nd year undergraduate",
    semesters: [
      { term: "Spring 2025", enrollment: 59, evaluation: "4.589/5" },
      { term: "Spring 2024", enrollment: 33, evaluation: "4.851/5" },
      { term: "Spring 2023", enrollment: 37, evaluation: "4.512/5" },
      { term: "Spring 2021", enrollment: 51, evaluation: "4.635/5" },
      { term: "Spring 2020", enrollment: 43, evaluation: "4.266/5" },
    ],
  },
  {
    name: "History of Earth",
    level: "2nd year undergraduate",
    semesters: [
      { term: "Spring 2024", enrollment: 16, evaluation: "4.827/5" },
      { term: "Spring 2023", enrollment: 25, evaluation: "4.754/5" },
      { term: "Spring 2021", enrollment: 60, evaluation: "4.697/5" },
      { term: "Spring 2020", enrollment: 47, evaluation: "4.619/5" },
    ],
  },
  {
    name: "Paleontology and Laboratory",
    level: "3rd year undergraduate",
    semesters: [
      { term: "Fall 2024", enrollment: 19, evaluation: "4.607/5" },
      { term: "Fall 2023", enrollment: 32, evaluation: "4.359/5" },
      { term: "Fall 2021", enrollment: 27, evaluation: "4.971/5" },
      { term: "Spring 2019", enrollment: 28, evaluation: "4.262/5" },
    ],
  },
  {
    name: "Geological Practice",
    level: "1st year undergraduate",
    semesters: [
      { term: "Fall 2024", enrollment: 30, evaluation: "4.492/5" },
      { term: "Fall 2023", enrollment: 11, evaluation: "4.954/5" },
      { term: "Fall 2021", enrollment: 34, evaluation: "4.351/5" },
      { term: "Fall 2020", enrollment: 42, evaluation: "4.467/5" },
    ],
  },
];

function avgEval(semesters: Course["semesters"]): string {
  const vals = semesters.map((s) => parseFloat(s.evaluation));
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
}

const TeachingSection = () => (
  <section id="teaching" className="py-20">
    <div className="container max-w-5xl">
      <div className="flex items-center gap-3">
        <BookOpen className="text-accent" size={28} />
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">Teaching</h2>
      </div>
      <div className="mt-2 h-1 w-16 rounded-full bg-accent" />

      <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
        I teach undergraduate courses in sedimentology, paleontology, and earth history at Chungnam National University. 
        Recent semesters shown below with student evaluation scores.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {courses.map((course) => (
          <div key={course.name} className="rounded-md border bg-card overflow-hidden">
            {/* Header */}
            <div className="bg-primary/5 px-5 py-4 border-b">
              <h3 className="font-display text-base font-bold text-primary">{course.name}</h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">{course.level}</p>
            </div>

            {/* Average score */}
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Average evaluation</span>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-sm font-bold text-primary font-display">{avgEval(course.semesters)}/5</span>
              </div>
            </div>

            {/* Semester rows */}
            <div className="divide-y">
              {course.semesters.map((s) => (
                <div key={s.term} className="px-5 py-2.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.term}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{s.enrollment} students</span>
                    <span className="font-semibold text-accent">{s.evaluation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TeachingSection;
