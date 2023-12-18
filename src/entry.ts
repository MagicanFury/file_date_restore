import { main } from "./main"

main().then(() => {
  console.log('[LOG] Done')
}).catch(err => {
  console.error(err)
  console.log('[LOG] Interrupted')
})