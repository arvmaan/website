/**
 * Older work, kept as a compact list rather than full project pages.
 *
 * These are real repositories that no longer represent current work but are
 * worth being findable. To promote one back to a full project, create
 * `src/content/projects/<slug>.md` and delete the entry here.
 */

export interface ArchiveEntry {
  name: string;
  blurb: string;
  year: number;
  repo: string;
}

export const ARCHIVE: ArchiveEntry[] = [
  {
    name: "Find-Me",
    blurb: "Movie finder, built to learn React",
    year: 2020,
    repo: "https://github.com/arvmaan/Find-Me",
  },
  {
    name: "Reco-Me",
    blurb: "Movie recommendations via collaborative filtering",
    year: 2020,
    repo: "https://github.com/arvmaan/Reco-Me",
  },
  {
    name: "Brackify",
    blurb: "Tournament bracket builder",
    year: 2022,
    repo: "https://github.com/arvmaan/Brackify",
  },
  {
    name: "Archetype",
    blurb: "Side-scrolling typing game, Godot, for the CSSA game jam",
    year: 2021,
    repo: "https://github.com/arvmaan/Archetype",
  },
  {
    name: "Procedural Map Generation",
    blurb: "Perlin-noise terrain generation in Unity",
    year: 2020,
    repo: "https://github.com/arvmaan/ProceduralMapGeneration",
  },
  {
    name: "Red-Black Tree",
    blurb: "Self-balancing tree with a Java GUI that shows the rotations",
    year: 2019,
    repo: "https://github.com/arvmaan/Red-BlackTree",
  },
  {
    name: "Learn2Jump",
    blurb: "2D platformer, built to learn Unity and C#",
    year: 2019,
    repo: "https://github.com/arvmaan/Learn2Jump",
  },
  {
    name: "Help-Me",
    blurb: "Microcontroller script that texts me on a button press",
    year: 2020,
    repo: "https://github.com/arvmaan/Help-Me",
  },
  {
    name: "KMeans",
    blurb: "K-means clustering from scratch",
    year: 2023,
    repo: "https://github.com/arvmaan/KMeans",
  },
];
