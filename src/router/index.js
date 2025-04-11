import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import DuellView from '../views/DuellView.vue'
import TournamentView from '../views/DuellView.vue'
import TabletMatchView from '../views/DuellView.vue'
import TabletCreateMatchView from '../views/DuellView.vue'
import TabletTournamentBetweenView from '../views/DuellView.vue'
import CreateDuellView from '../views/CreateDuellView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/duell/:id',
      name: 'duell',
      component: DuellView,
    },
    {
      path: '/fast-duell/create',
      name: 'fast duell create',
      component: CreateDuellView,
    },
    {
      path: '/tournament',
      name: 'tournament',
      component: TournamentView,
    },
    {
      path: '/tablet/match',
      name: 'tablet match',
      component: TabletMatchView,
    },
    {
      path: '/tablet/create-match',
      name: 'tablet create match',
      component: TabletCreateMatchView,
    },
    {
      path: '/tablet/tournament/between',
      name: 'tablet tournament between',
      component: TabletTournamentBetweenView,
    },
  ],
})

export default router
