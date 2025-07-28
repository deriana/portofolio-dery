import { WebLayout } from "@/components/layouts/web-layout";
import { PageLayout } from "@/components/page-layout";
import { PageTitle } from "@/components/page-title";
import { SkillGrid } from "@/components/skill-grid";
import { SkillMeta } from "@/components/skill-meta";
import data from "@/data/skills.json";
import { useEffect, useState } from "react";

interface Skill {
  icon: string;
  label: string;
  desc: string;
}

interface SkillsJson {
  technical: Skill[];
  interests: string[];
  softSkills: string[];
}

export function Skills() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  });

  const skillsData = data as SkillsJson;

  return (
    <WebLayout>
      <PageLayout title="Technical Skills">
        <section>
          <SkillGrid skills={skillsData.technical} />
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Other Things About Me</h2>
          <SkillMeta label="Interested in" items={skillsData.interests} />
          <SkillMeta label="Soft Skills" items={skillsData.softSkills} />
        </section>
      </PageLayout>
    </WebLayout>
  );
}
