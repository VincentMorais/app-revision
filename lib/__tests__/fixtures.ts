import { buildIndex } from "@/lib/content";
import type { Course, Exercise } from "@/lib/types";

export function mcq(id: string, tags: string[] = ["t"]): Exercise {
  return {
    kind: "mcq",
    id,
    difficulty: 1,
    tags,
    prompt: `Question ${id}`,
    explanation: "Parce que.",
    choices: ["a", "b", "c", "d"],
    answer: 1,
  };
}

/**
 * Deux parcours :
 * - java : ch1 (3 ex) → ch2 (3 ex, prérequis ch1) → ch3 (2 ex, prérequis ch2)
 * - react : r1 (2 ex, prérequis java ch1)
 */
export function fixtureCourses(): Course[] {
  return [
    {
      id: "java",
      title: "Java",
      description: "",
      icon: "☕",
      chapters: [
        {
          id: "java-ch1",
          title: "Ch1",
          objective: "",
          prerequisites: [],
          units: [
            { kind: "lesson", id: "java-ch1-l1", title: "L1", blocks: [] },
            mcq("j1a", ["interfaces"]),
            mcq("j1b", ["interfaces"]),
            mcq("j1c", ["abstract"]),
          ],
        },
        {
          id: "java-ch2",
          title: "Ch2",
          objective: "",
          prerequisites: ["java-ch1"],
          units: [mcq("j2a", ["equals"]), mcq("j2b", ["hashcode"]), mcq("j2c", ["equals"])],
        },
        {
          id: "java-ch3",
          title: "Ch3",
          objective: "",
          prerequisites: ["java-ch2"],
          units: [mcq("j3a"), mcq("j3b")],
        },
      ],
    },
    {
      id: "react",
      title: "React",
      description: "",
      icon: "⚛",
      chapters: [
        {
          id: "react-r1",
          title: "R1",
          objective: "",
          prerequisites: ["java-ch1"],
          units: [mcq("r1a", ["hooks"]), mcq("r1b", ["hooks"])],
        },
      ],
    },
  ];
}

export function fixtureIndex() {
  return buildIndex(fixtureCourses());
}
