import Vue from 'vue'
import VueI18n from 'vue-i18n'
import defaultsDeep from 'lodash/defaultsDeep'
import consts from '../utils/consts'

export default ({ app, store, req }) => {
  Vue.use(VueI18n)
  if (process.server) {
    const Negotiator = require('negotiator')
    const negotiator = new Negotiator(req)
    const lang = negotiator.language(store.state.locales)
    store.commit('SET_LANG', lang || 'zh')
  }

  // Project specific locales
  let en = require('@/locales/en.json')
  let fr = require('@/locales/fr.json')
  let zh = require('@/locales/zh.json')

  // Add Examples locales ONLY if we need them for example/kitchen-sink work.
  if (consts.SHOW_EXAMPLES === true) {
    const examplesLocaleEn = require('@/locales/examples/en.json')
    const examplesLocaleFr = require('@/locales/examples/fr.json')
    const examplesLocaleZh = require('@/locales/examples/zh.json')
    en = defaultsDeep(examplesLocaleEn, en)
    fr = defaultsDeep(examplesLocaleFr, fr)
    zh = defaultsDeep(examplesLocaleZh, zh)
  }

  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale || 'zh',
    fallbackLocale: 'zh',
    messages: { en, fr, zh }
  })
}
