/**
 * Older work, kept as a compact list rather than full project pages.
 *
 * These are real repositories that no longer represent current work but are
 * worth being findable. To promote one back to a full project, create
 * `src/content/projects/<slug>.md` and delete the entry here.
 *
 * `group` drives the column layout on the index — it's the affiliation the
 * work happened under, not a category of subject matter. Three private repos
 * (ACubed/WSBStonkChecker, ACubed/chat-room, CouchParty/CouchParty) are left
 * out entirely: a link to a private repo just 404s for a visitor.
 */

export interface ArchiveEntry {
  name: string;
  blurb: string;
  year: number;
  repo: string;
  group: string;
}

/** Column order on the index — not alphabetical, so this array is the source of truth. */
export const ARCHIVE_GROUPS = ["A³", "Coursework", "Solo"] as const;

export const ARCHIVE: ArchiveEntry[] = [
  // --- A³ — CS student group at the University of Manitoba, formed for a
  //     class project, kept making things together after it ended. ---
  {
    name: "EtherBet",
    blurb: "Ethereum betting app for NBA, NHL, and LCS outcomes",
    year: 2023,
    repo: "https://github.com/ACubed/EtherBet",
    group: "A³",
  },
  {
    name: "Archetype",
    blurb: "Side-scrolling typing game, Godot, for the CSSA game jam",
    year: 2021,
    repo: "https://github.com/ACubed/Archetype",
    group: "A³",
  },
  {
    name: "QuickCuisine",
    blurb: "Restaurant ordering system prototype",
    year: 2020,
    repo: "https://github.com/ACubed/QuickCuisine",
    group: "A³",
  },
  {
    name: "Interdimensional Slime",
    blurb: "2D platformer, Unity, built for PegJam",
    year: 2019,
    repo: "https://github.com/ACubed/InterdimensionalSlime",
    group: "A³",
  },
  {
    name: "1HP Dungeon",
    blurb: "Top-down dungeon crawler, Unity, for the CSSA game jam",
    year: 2019,
    repo: "https://github.com/ACubed/1HP-Dungeon",
    group: "A³",
  },

  // --- Coursework — university group projects ---
  {
    name: "Servus",
    blurb: "Marketplace connecting local service providers, COMP 4350 group project",
    year: 2021,
    repo: "https://github.com/COMP4350/Servus",
    group: "Coursework",
  },
  {
    name: "Meal Buddy",
    blurb: "Calorie counter, COMP 3350 group project",
    year: 2020,
    repo: "https://github.com/COMP3350-Group5/meal-buddy",
    group: "Coursework",
  },

  // --- Solo ---
  {
    name: "Brackify",
    blurb: "Tournament bracket builder",
    year: 2022,
    repo: "https://github.com/arvmaan/Brackify",
    group: "Solo",
  },
  {
    name: "KMeans",
    blurb: "K-means clustering from scratch",
    year: 2023,
    repo: "https://github.com/arvmaan/KMeans",
    group: "Solo",
  },
  {
    name: "Find-Me",
    blurb: "Movie finder, built to learn React",
    year: 2020,
    repo: "https://github.com/arvmaan/Find-Me",
    group: "Solo",
  },
  {
    name: "Reco-Me",
    blurb: "Movie recommendations via collaborative filtering",
    year: 2020,
    repo: "https://github.com/arvmaan/Reco-Me",
    group: "Solo",
  },
  {
    name: "Help-Me",
    blurb: "Microcontroller script that texts me on a button press",
    year: 2020,
    repo: "https://github.com/arvmaan/Help-Me",
    group: "Solo",
  },
  {
    name: "Procedural Map Generation",
    blurb: "Perlin-noise terrain generation in Unity",
    year: 2020,
    repo: "https://github.com/arvmaan/ProceduralMapGeneration",
    group: "Solo",
  },
  {
    name: "Red-Black Tree",
    blurb: "Self-balancing tree with a Java GUI that shows the rotations",
    year: 2019,
    repo: "https://github.com/arvmaan/Red-BlackTree",
    group: "Solo",
  },
  {
    name: "Learn2Jump",
    blurb: "2D platformer, built to learn Unity and C#",
    year: 2019,
    repo: "https://github.com/arvmaan/Learn2Jump",
    group: "Solo",
  },
];
