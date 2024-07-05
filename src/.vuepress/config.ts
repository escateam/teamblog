import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "朝天工作室",
  description: "朝天工作室（EcsaWorkTeam）博客",

  theme,

});
