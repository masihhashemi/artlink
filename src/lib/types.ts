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

export type Post = {
  id: string;
  author_id: string;
  type: PostType;
  body: string;
  created_at: string;
  updated_at: string;
};

export type Connection = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
};

export type MessageThread = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export type Like = {
  post_id: string;
  profile_id: string;
  created_at: string;
};

export type Application = {
  id: string;
  post_id: string;
  applicant_id: string;
  note: string;
  thread_id: string | null;
  created_at: string;
};

export type DemoUser = {
  id: string;
  email: string;
  password: string;
  full_name: string;
};

export type Store = {
  users: DemoUser[];
  profiles: Profile[];
  skills: Skill[];
  profile_skills: { profile_id: string; skill_id: string }[];
  education: Education[];
  experiences: Experience[];
  portfolio_images: PortfolioImage[];
  posts: Post[];
  post_skills: { post_id: string; skill_id: string }[];
  connections: Connection[];
  message_threads: MessageThread[];
  thread_participants: { thread_id: string; profile_id: string }[];
  messages: Message[];
  notifications: Notification[];
  likes: Like[];
  comments: Comment[];
  applications: Application[];
};

export type ProfileWithRelations = Profile & {
  skills: Skill[];
  education: Education[];
  experiences: Experience[];
  portfolio_images: PortfolioImage[];
};

export type PostWithRelations = Post & {
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
