import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "赞助",
    icon: "thumbs-up",
    prefix: "like",
    link: "like"
  },
  {
    text: "关于",
    icon: "info",
    prefix: "about",
    link: "about"
  },
  {
    text: "友情链接",
    icon: "link",
    prefix: "link",
    link: "link"
  }
]);
