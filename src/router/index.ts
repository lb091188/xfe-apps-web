import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/apps",
    },
    {
      path: "/apps",
      name: "Apps",
      component: () => import("@/views/AppList.vue"),
    },
    {
      path: "/app/create-fe-bat-code",
      name: "CreateFEBatScriptCode",
      component: () => import("@/views/apps/CreateFEBatScriptCode.vue"),
    },
  ],
});

export default router;
