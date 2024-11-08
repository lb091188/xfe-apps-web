import { createRouter, createWebHashHistory } from "vue-router";
import AppsChildrenViews from "@/layout/AppsChildrenViews.vue";

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
      path: "/app",
      name: "CreateFEBatScriptCode",
      component: AppsChildrenViews,
      children: [
        {
          path: "create-fe-bat-code",
          name: "CreateFEBatScriptCode",
          component: () => import("@/views/apps/CreateFEBatScriptCode.vue"),
        },
        {
          path: "time-calculation",
          name: "TimeCalculation",
          component: () => import("@/views/apps/TimeCalculation.vue"),
        },
        {
          path: "num-pad",
          name: "NumberPad",
          component: () => import("@/views/apps/NumberPad.vue"),
        },
        {
          path: "count-down",
          name: "countDown",
          component: () => import("@/views/apps/countDown.vue"),
        },
        {
          path: "listen-1",
          name: "Listen1",
          component: () => import("@/views/apps/listen1.vue"),
        },
      ],
    },
  ],
});

export default router;
