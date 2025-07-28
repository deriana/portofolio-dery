import { WebLayout } from "@/components/layouts/web-layout";
import { PageTitle } from "@/components/page-title";
import { SkillGrid } from "@/components/skill-grid";
import { SkillMeta } from "@/components/skill-meta";
import data from "@/data/skills.json";

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
  const skillsData = data as SkillsJson;

  return (
    <WebLayout>
      <div className="container mx-auto px-4 py-12 space-y-16">
        <section>
          <PageTitle title="Technical Skills" />
          <SkillGrid skills={skillsData.technical} />
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Other Things About Me</h2>
          <SkillMeta label="Interested in" items={skillsData.interests} />
          <SkillMeta label="Soft Skills" items={skillsData.softSkills} />
        </section>
      </div>
    </WebLayout>
  );
}
