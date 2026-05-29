import { ref } from 'vue'

// Drives the StickyCta label so it reads the room — "ask a question" on FAQ,
// "discuss approach" on principles, etc. Written by App.vue's section observer,
// read by StickyCta.vue. Values are the anchor hash ('#services', '#faq', ...).
export const activeSection = ref<string>('')
