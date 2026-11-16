import type { Store } from "@/lib/types";

const SKILLS = [
  ["Videographer", "videographer"],
  ["Writer", "writer"],
  ["Script", "script"],
  ["Photographer", "photographer"],
  ["Illustrator", "illustrator"],
  ["Designer", "designer"],
  ["Painter", "painter"],
  ["Animator", "animator"],
  ["Editor", "editor"],
  ["Musician", "musician"],
  ["Actor", "actor"],
  ["Director", "director"],
  ["Curator", "curator"],
  ["Sculptor", "sculptor"],
  ["Producer", "producer"],
] as const;

/** Stable demo user ids — used when refreshing store without wiping real accounts. */
export const DEMO_USER_IDS = [
  "user-maya",
  "user-jordan",
  "user-sam",
  "user-aisha",
] as const;

export function createEmptyStore(): Store {
  return {
    users: [],
    profiles: [],
    skills: SKILLS.map(([name, slug], i) => ({
      id: `skill-${i + 1}`,
      name,
      slug,
    })),
    profile_skills: [],
    education: [],
    experiences: [],
    portfolio_images: [],
    posts: [],
    post_skills: [],
    connections: [],
    message_threads: [],
    thread_participants: [],
    messages: [],
    notifications: [],
    likes: [],
    comments: [],
    applications: [],
  };
}

type DemoEducation = {
  id: string;
  university: string;
  degree_or_program: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  sort_order: number;
};

type DemoExperience = {
  id: string;
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  sort_order: number;
};

type DemoPortfolioImage = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

type DemoPerson = {
  id: (typeof DEMO_USER_IDS)[number];
  email: string;
  password: string;
  full_name: string;
  headline: string;
  description: string;
  avatar_url: string;
  skills: string[];
  education: DemoEducation[];
  experiences: DemoExperience[];
  portfolio: DemoPortfolioImage[];
};

const demoPeople: DemoPerson[] = [
  {
    id: "user-maya",
    email: "maya@artlink.demo",
    password: "demo1234",
    full_name: "Maya Chen",
    headline: "Documentary videographer & picture editor · RISD ’22",
    description:
      "I make observational shorts about people who build things with their hands — ceramicists, stagehands, night-shift printers. Most of my work starts with a single handheld camera, natural light, and long takes that leave room for silence. Lately I’ve been collaborating with alumni composers and writers on a series about critique culture in art school. Open to DP/editor roles on narrative shorts, grant-funded docs, and gallery video installs.",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format",
    skills: ["videographer", "editor", "director"],
    education: [
      {
        id: "edu-maya-1",
        university: "Rhode Island School of Design",
        degree_or_program: "BFA",
        field_of_study: "Film / Animation / Video",
        start_date: "2018-09-01",
        end_date: "2022-05-15",
        is_current: false,
        description:
          "Thesis: Still Working — a 22-minute portrait of three Providence craft studios. Received departmental honors for editing.",
        sort_order: 0,
      },
      {
        id: "edu-maya-2",
        university: "Sundance Institute",
        degree_or_program: "Documentary Edit Intensive",
        field_of_study: "Nonfiction Editing",
        start_date: "2023-06-01",
        end_date: "2023-06-21",
        is_current: false,
        description:
          "Two-week lab focused on structure, archival integration, and sound design for character-driven docs.",
        sort_order: 1,
      },
    ],
    experiences: [
      {
        id: "exp-maya-1",
        title: "Director of Photography",
        organization: "Harbor Light Films",
        location: "Brooklyn, NY",
        start_date: "2022-06-01",
        end_date: null,
        is_current: true,
        description:
          "Shoot and cut community documentary shorts for museums and nonprofits. Lead camera packages for day-player crews; deliver color-ready cuts in Premiere and DaVinci.",
        sort_order: 0,
      },
      {
        id: "exp-maya-2",
        title: "Camera Assistant / Editor",
        organization: "Providence Public Access Collective",
        location: "Providence, RI",
        start_date: "2020-09-01",
        end_date: "2022-05-01",
        is_current: false,
        description:
          "Supported student and alumni shoots; built an archive of critique-room footage later used in my thesis film.",
        sort_order: 1,
      },
    ],
    portfolio: [
      {
        id: "port-maya-1",
        image_url:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop&auto=format",
        caption: "Still from Harbor Shift — night shoot on the Gowanus canal",
        sort_order: 0,
      },
      {
        id: "port-maya-2",
        image_url:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800&fit=crop&auto=format",
        caption: "BTS with a two-person crew for Still Working",
        sort_order: 1,
      },
      {
        id: "port-maya-3",
        image_url:
          "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800&fit=crop&auto=format",
        caption: "Color bay — final grade pass on a RISD alumni interview reel",
        sort_order: 2,
      },
      {
        id: "port-maya-4",
        image_url:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop&auto=format",
        caption: "Camera package prep for a gallery loop install",
        sort_order: 3,
      },
    ],
  },
  {
    id: "user-jordan",
    email: "jordan@artlink.demo",
    password: "demo1234",
    full_name: "Jordan Blake",
    headline: "Playwright, dramaturg & short-film scriptwriter · Yale Drama ’21",
    description:
      "I write for black-box stages and 10–20 minute films that sit somewhere between memory and rehearsal. My scripts lean on overlapping dialogue, stage directions that invite physical comedy, and characters who are mid-reinvention. I’ve workshopped new work with alumni ensembles in New Haven and Brooklyn, and I’m looking for directors and producers who want a writer in the room early — treatments, table reads, and rewrite sprints included.",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
    skills: ["writer", "script", "actor"],
    education: [
      {
        id: "edu-jordan-1",
        university: "Yale School of Drama",
        degree_or_program: "MFA",
        field_of_study: "Playwriting",
        start_date: "2018-09-01",
        end_date: "2021-05-20",
        is_current: false,
        description:
          "Thesis play Soft Opening later staged at New Works Lab. Focus on experimental form and dramaturgy for devised work.",
        sort_order: 0,
      },
      {
        id: "edu-jordan-2",
        university: "Kenyon College",
        degree_or_program: "BA",
        field_of_study: "English & Theater",
        start_date: "2014-09-01",
        end_date: "2018-05-15",
        is_current: false,
        description:
          "Editor for the literary magazine; acted in six mainstage productions while drafting first full-length play.",
        sort_order: 1,
      },
    ],
    experiences: [
      {
        id: "exp-jordan-1",
        title: "Resident Writer",
        organization: "New Works Lab",
        location: "New Haven, CT",
        start_date: "2021-09-01",
        end_date: null,
        is_current: true,
        description:
          "Developed three new plays with ensemble casts; run cold reads and dramaturgy notes for visiting alumni writers.",
        sort_order: 0,
      },
      {
        id: "exp-jordan-2",
        title: "Script Consultant",
        organization: "Independent short films (freelance)",
        location: "New York, NY",
        start_date: "2022-01-15",
        end_date: null,
        is_current: true,
        description:
          "Punch-up and structure notes for alumni shorts under 15 minutes; occasional on-set dialogue polish.",
        sort_order: 1,
      },
      {
        id: "exp-jordan-3",
        title: "Teaching Artist",
        organization: "Brooklyn Young Playwrights",
        location: "Brooklyn, NY",
        start_date: "2022-03-01",
        end_date: "2024-06-01",
        is_current: false,
        description:
          "Led weekend workshops on scene objectives and monologue writing for high-school writers.",
        sort_order: 2,
      },
    ],
    portfolio: [
      {
        id: "port-jordan-1",
        image_url:
          "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=800&fit=crop&auto=format",
        caption: "Soft Opening — workshop staging at New Works Lab",
        sort_order: 0,
      },
      {
        id: "port-jordan-2",
        image_url:
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop&auto=format",
        caption: "Draft pages from a short-film treatment on alumni reunions",
        sort_order: 1,
      },
      {
        id: "port-jordan-3",
        image_url:
          "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=1200&h=800&fit=crop&auto=format",
        caption: "Table read with cast for The Understudy’s Understudy",
        sort_order: 2,
      },
    ],
  },
  {
    id: "user-sam",
    email: "sam@artlink.demo",
    password: "demo1234",
    full_name: "Sam Okonkwo",
    headline: "Illustrator & brand designer for galleries, labels & festivals · SVA ’20",
    description:
      "Bold line work, saturated palettes, and poster systems that hold up on a subway wall or a tote. I design campaign art for museum exhibitions, indie record sleeves, and alumni festival identities. Clients come to me when they need illustration that feels handmade but still ships as a modular brand kit — type, stickers, social crops, and print-ready boards. Always happy to collaborate with photographers and curators on show catalogs.",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format",
    skills: ["illustrator", "designer", "painter"],
    education: [
      {
        id: "edu-sam-1",
        university: "School of Visual Arts",
        degree_or_program: "BFA",
        field_of_study: "Illustration",
        start_date: "2016-09-01",
        end_date: "2020-05-15",
        is_current: false,
        description:
          "Senior portfolio focused on editorial illustration and large-format poster design. Teaching assistant for Drawing I.",
        sort_order: 0,
      },
    ],
    experiences: [
      {
        id: "exp-sam-1",
        title: "Lead Illustrator",
        organization: "Studio North",
        location: "New York, NY",
        start_date: "2020-08-01",
        end_date: null,
        is_current: true,
        description:
          "Campaign art and environmental graphics for museum exhibitions and cultural nonprofits. Own illustration through print production.",
        sort_order: 0,
      },
      {
        id: "exp-sam-2",
        title: "Freelance Designer",
        organization: "Independent",
        location: "New York / Remote",
        start_date: "2019-01-01",
        end_date: null,
        is_current: true,
        description:
          "Album covers, festival posters, and merch for indie labels. Typical turnaround 1–3 weeks depending on print specs.",
        sort_order: 1,
      },
      {
        id: "exp-sam-3",
        title: "Gallery Install Assistant",
        organization: "Chelsea Project Space",
        location: "New York, NY",
        start_date: "2018-06-01",
        end_date: "2019-08-31",
        is_current: false,
        description:
          "Helped hang group shows and designed wall vinyl — early crash course in how graphics live in physical space.",
        sort_order: 2,
      },
    ],
    portfolio: [
      {
        id: "port-sam-1",
        image_url:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop&auto=format",
        caption: "Poster system for a Midtown alumni group show",
        sort_order: 0,
      },
      {
        id: "port-sam-2",
        image_url:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&auto=format",
        caption: "Abstract color study used for a vinyl sleeve series",
        sort_order: 1,
      },
      {
        id: "port-sam-3",
        image_url:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&auto=format",
        caption: "Screen-print tests for a festival identity kit",
        sort_order: 2,
      },
      {
        id: "port-sam-4",
        image_url:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=800&fit=crop&auto=format",
        caption: "Ink wash studies from the Studio North sketch wall",
        sort_order: 3,
      },
    ],
  },
  {
    id: "user-aisha",
    email: "aisha@artlink.demo",
    password: "demo1234",
    full_name: "Aisha Rahman",
    headline: "Portrait photographer & emerging curator · RISD ’19",
    description:
      "I photograph artists in their studios and the quiet hour before a show opens. My practice sits between commissioned portraiture and curatorial projects that put alumni work into temporary, walkable spaces — storefronts, courtyards, borrowed galleries. I’m building a rolling network of photographers, designers, and writers for pop-up exhibitions, and I’m always looking for collaborators who care as much about wall labels as about the light.",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format",
    skills: ["photographer", "curator", "producer"],
    education: [
      {
        id: "edu-aisha-1",
        university: "Rhode Island School of Design",
        degree_or_program: "BFA",
        field_of_study: "Photography",
        start_date: "2015-09-01",
        end_date: "2019-05-15",
        is_current: false,
        description:
          "Concentration in portrait and exhibition photography. Capstone: Rooms We Borrow — portraits of alumni in temporary studios.",
        sort_order: 0,
      },
      {
        id: "edu-aisha-2",
        university: "Independent Curators International",
        degree_or_program: "Curatorial Intensive",
        field_of_study: "Contemporary Curating",
        start_date: "2022-10-01",
        end_date: "2022-11-15",
        is_current: false,
        description:
          "Seminar on community-led exhibitions and ethics of artist representation.",
        sort_order: 1,
      },
    ],
    experiences: [
      {
        id: "exp-aisha-1",
        title: "Assistant Curator",
        organization: "East River Gallery",
        location: "Long Island City, NY",
        start_date: "2021-03-01",
        end_date: null,
        is_current: true,
        description:
          "Co-curate emerging alumni photography shows; manage install schedules, wall text, and opening-night documentation.",
        sort_order: 0,
      },
      {
        id: "exp-aisha-2",
        title: "Portrait Photographer",
        organization: "Independent",
        location: "New York / Providence",
        start_date: "2019-06-01",
        end_date: null,
        is_current: true,
        description:
          "Studio and on-location portraits for artists, catalogs, and press kits. Natural light preferred; tethered digital workflow.",
        sort_order: 1,
      },
      {
        id: "exp-aisha-3",
        title: "Exhibition Producer",
        organization: "Alumni Pop-Up Collective",
        location: "Brooklyn, NY",
        start_date: "2020-01-01",
        end_date: "2023-12-01",
        is_current: false,
        description:
          "Produced four temporary shows in borrowed storefronts — budgeting, press lists, and volunteer install crews.",
        sort_order: 2,
      },
    ],
    portfolio: [
      {
        id: "port-aisha-1",
        image_url:
          "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=800&fit=crop&auto=format",
        caption: "Studio portrait — painter mid-prep for a LIC open studios",
        sort_order: 0,
      },
      {
        id: "port-aisha-2",
        image_url:
          "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=800&fit=crop&auto=format",
        caption: "Install view from Rooms We Borrow pop-up",
        sort_order: 1,
      },
      {
        id: "port-aisha-3",
        image_url:
          "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1200&h=800&fit=crop&auto=format",
        caption: "Opening-night documentation at East River Gallery",
        sort_order: 2,
      },
      {
        id: "port-aisha-4",
        image_url:
          "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=800&fit=crop&auto=format",
        caption: "Night portrait series — alumni after critique",
        sort_order: 3,
      },
    ],
  },
];

function pushDemoPerson(store: Store, person: DemoPerson, now: string) {
  store.users.push({
    id: person.id,
    email: person.email,
    password: person.password,
    full_name: person.full_name,
  });
  store.profiles.push({
    id: person.id,
    full_name: person.full_name,
    headline: person.headline,
    description: person.description,
    avatar_url: person.avatar_url,
    onboarded: true,
    created_at: now,
    updated_at: now,
  });
  for (const edu of person.education) {
    store.education.push({
      ...edu,
      profile_id: person.id,
    });
  }
  for (const exp of person.experiences) {
    store.experiences.push({
      ...exp,
      profile_id: person.id,
    });
  }
  for (const image of person.portfolio) {
    store.portfolio_images.push({
      ...image,
      profile_id: person.id,
    });
  }
  for (const slug of person.skills) {
    const skill = store.skills.find((s) => s.slug === slug);
    if (skill) {
      store.profile_skills.push({
        profile_id: person.id,
        skill_id: skill.id,
      });
    }
  }
}

/**
 * Refresh seeded demo people in an existing store without removing
 * user-created accounts or their related data.
 */
export function refreshDemoPeopleInStore(store: Store): Store {
  const now = new Date().toISOString();
  const demoIds = new Set<string>(DEMO_USER_IDS);

  store.users = store.users.filter((u) => !demoIds.has(u.id));
  store.profiles = store.profiles.filter((p) => !demoIds.has(p.id));
  store.education = store.education.filter((e) => !demoIds.has(e.profile_id));
  store.experiences = store.experiences.filter(
    (e) => !demoIds.has(e.profile_id),
  );
  store.portfolio_images = store.portfolio_images.filter(
    (p) => !demoIds.has(p.profile_id),
  );
  store.profile_skills = store.profile_skills.filter(
    (ps) => !demoIds.has(ps.profile_id),
  );

  // Keep shared graph (posts, connections, messages) but re-seed demo people
  // so profiles/avatars/portfolio match the latest seed content.
  for (const person of demoPeople) {
    pushDemoPerson(store, person, now);
  }

  return store;
}

export function createDemoSeedStore(): Store {
  const store = createEmptyStore();
  const now = new Date().toISOString();

  for (const person of demoPeople) {
    pushDemoPerson(store, person, now);
  }

  const posts = [
    {
      id: "post-1",
      author_id: "user-maya",
      type: "looking_for" as const,
      body: "Looking for a script writer for a 12-minute alumni documentary about studio critique culture. Paid short gig, shoot next month.",
      skillSlugs: ["script", "writer"],
    },
    {
      id: "post-2",
      author_id: "user-jordan",
      type: "offering" as const,
      body: "I have script and writing skills and need a short film / theater project to join this spring.",
      skillSlugs: ["script", "writer"],
    },
    {
      id: "post-3",
      author_id: "user-sam",
      type: "offering" as const,
      body: "Offering illustration and poster design for gallery openings and indie releases. Fast turnaround.",
      skillSlugs: ["illustrator", "designer"],
    },
    {
      id: "post-4",
      author_id: "user-aisha",
      type: "looking_for" as const,
      body: "Need a designer and illustrator for a pop-up alumni show catalog. Looking to collaborate this semester.",
      skillSlugs: ["designer", "illustrator"],
    },
    {
      id: "post-5",
      author_id: "user-maya",
      type: "update" as const,
      body: "Wrapped color on my latest short — grateful for the RISD alumni who sat for interviews.",
      skillSlugs: ["videographer"],
    },
  ];

  for (const post of posts) {
    store.posts.push({
      id: post.id,
      author_id: post.author_id,
      type: post.type,
      body: post.body,
      created_at: now,
      updated_at: now,
    });
    for (const slug of post.skillSlugs) {
      const skill = store.skills.find((s) => s.slug === slug);
      if (skill) {
        store.post_skills.push({ post_id: post.id, skill_id: skill.id });
      }
    }
  }

  store.likes.push(
    { post_id: "post-1", profile_id: "user-jordan", created_at: now },
    { post_id: "post-1", profile_id: "user-aisha", created_at: now },
    { post_id: "post-3", profile_id: "user-maya", created_at: now },
  );

  store.comments.push({
    id: "comment-1",
    post_id: "post-1",
    author_id: "user-jordan",
    body: "This sounds perfect — I have a draft treatment if you want to chat.",
    created_at: now,
  });

  store.connections.push({
    id: "conn-1",
    requester_id: "user-maya",
    recipient_id: "user-jordan",
    status: "accepted",
    created_at: now,
    updated_at: now,
  });

  store.message_threads.push({
    id: "thread-1",
    created_at: now,
    updated_at: now,
  });
  store.thread_participants.push(
    { thread_id: "thread-1", profile_id: "user-maya" },
    { thread_id: "thread-1", profile_id: "user-jordan" },
  );
  store.messages.push(
    {
      id: "msg-1",
      thread_id: "thread-1",
      sender_id: "user-maya",
      body: "Hey Jordan — saw your offering post. Want to co-develop the doc script?",
      created_at: now,
    },
    {
      id: "msg-2",
      thread_id: "thread-1",
      sender_id: "user-jordan",
      body: "Absolutely. I can send a one-pager tonight.",
      created_at: now,
    },
  );

  store.notifications.push({
    id: "notif-1",
    user_id: "user-jordan",
    type: "skill_match_post",
    payload: {
      post_id: "post-1",
      author_id: "user-maya",
      message: "Maya Chen is looking for skills you have: Script, Writer",
    },
    read: false,
    created_at: now,
  });

  return store;
}
