import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "主页"
  ],
  "团队简介": [
    "",
    {
      text: "团队简介",
      icon: "book",
      prefix: "/introduction",
      children: "structure",
    },
    {
      text: "项目",
      icon: "book",
      prefix: "/project",
      children: "structure",
    },
  ],
});