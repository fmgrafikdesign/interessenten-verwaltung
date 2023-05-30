import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import PropertyView from "@/views/PropertyView.vue";
import InteressentView from "@/views/InteressentView.vue";
import {usePropertyStore} from "@/stores/property-store";
import {getCurrentUser} from "vuefire";
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/immobilie/:propertyId',
      name: 'property',
      component: PropertyView,
      props: true,
      beforeEnter(to) {
        const properties = usePropertyStore();
        if (!properties.all.find(property => to.params.propertyId === property.id)) {
          return { name: 'index' };
        }
      }
    },
    {
      path: '/immobilie/:propertyId/interessent/:interessentenId',
      name: 'interessent',
      component: InteressentView,
      props: true,
      beforeEnter(to) {
        const properties = usePropertyStore();
        const property = properties.all.find(property => to.params.propertyId === property.id);
        if (!property?.interessenten.find(interessent => to.params.interessentenId === interessent.id)) {
          return { name: 'index' };
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: async () => {
        const user = await getCurrentUser();
        if (user) return false;
      }
    }
  ]
})

router.beforeEach(async (to) => {
  const user = await getCurrentUser();
  if (!user && to.name !== 'login') {
    return { name: 'login' };
  }
})

export default router
