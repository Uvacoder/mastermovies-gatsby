import { FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

export interface ILink {
  text: string;
  link: string;
}

export interface ISocialLink extends ILink {
  icon: React.FC<AntdIconProps>;
}

export const NAV_LINKS: ILink[] = [
  { text: "Home", link: "/" },
  { text: "Glacier", link: "/glacier" },
  { text: "Portfolio", link: "/portfolio" },
  { text: "Contact", link: "/contact" },
];

export const FOOTER_LINKS: ILink[] = [
  { text: "Home", link: "/" },
  { text: "Glacier", link: "/glacier" },
  { text: "Portfolio", link: "/portfolio" },
  { text: "Blog", link: "https://blog.mastermovies.uk" },
  { text: "Contact", link: "/contact" },
];

export const SOCIAL_LINKS: ISocialLink[] = [
  {
    text: "Facebook",
    icon: FacebookOutlined,
    link: "https://facebook.com/Marcus.Cemes",
  },
  { text: "Twitter", icon: TwitterOutlined, link: "https://twitter.com/MarcusCemes" },
  {
    text: "Instagram",
    icon: InstagramOutlined,
    link: "https://instagram.com/marcus_cemes",
  },
  {
    text: "YouTube",
    icon: YoutubeOutlined,
    link: "https://www.youtube.com/channel/UCRx9M5nYJfW9F5hsFcklwKQ",
  },
];
