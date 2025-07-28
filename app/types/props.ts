export interface AboutDescProps {
  text: string;
}

export interface BannerProps {
  path: string;
}

export interface AboutImageProps {
  path: string;
}

export interface LoadMoreButtonProps {
  onClick: () => void;
}

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export interface PageTitleProps {
  title: string;
}

export interface PortfolioCardProps {
  item: {
    id: number | string;
    title: string;
    description: string;
    image: string;
    author: string;
  };
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  url: string;
}

export interface PortfolioListProps {
  data: PortfolioItem[];
  onCardClick: (item: PortfolioItem) => void;
}

export interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

export interface Skill {
  icon: string;
  label: string;
  desc: string;
}

export interface SkillsJson {
  technical: Skill[];
  interests: string[];
  softSkills: string[];
}

export interface SkillCardProps {
  icon: string;
  label: string;
  desc: string;
}


export type NavItem = {
  label: string;
  path: string;
};

export type NavigationProps = {
  items: NavItem[];
};

export interface ProfileDetailProps {
  name: string;
  email: string;
  bio: string;
}

export interface ProfileImageProps {
  pathBanner: string;
  pathIcon: string;
}

export type SocialLinkProps = {
  icon: React.ElementType;
  label: string;
  url: string;
  size?: number;
};

export type SocialLinksProps = {
  direction?: "row" | "col";
  iconSize?: number;
  className?: string;
};
