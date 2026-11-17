export type PostType = "looking_for" | "offering" | "update";
export type ConnectionStatus = "pending" | "accepted" | "rejected";

export type Skill = {
  id: string;
  name: string;
  slug: string;
};

export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  description: string;
  avatar_url: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: string;
  profile_id: string;
  university: string;
  degree_or_program: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  profile_id: string;
  title: string;
  organization: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  sort_order: number;
};

export type PortfolioImage = {
  id: string;
  profile_id: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

export type Connection = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
};

export type ProfileWithRelations = Profile & {
  skills: Skill[];
  education: Education[];
  experiences: Experience[];
  portfolio_images: PortfolioImage[];
};

export type PostWithRelations = {
  id: string;
  author_id: string;
  type: PostType;
  body: string;
  created_at: string;
  updated_at: string;
  author: Profile;
  skills: Skill[];
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  is_own: boolean;
  matches_me: boolean;
  applied_by_me: boolean;
  matched_skills: Skill[];
};

export type RecommendationPerson = {
  profile: Profile;
  skills: Skill[];
  score: number;
  reasons: string[];
};

export type RecommendationOpportunity = {
  post: PostWithRelations;
  score: number;
  reasons: string[];
};

export type NetworkPerson = {
  connection: Connection;
  profile: Profile;
  skills: Skill[];
};
