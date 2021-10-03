import { UserStore } from '../user-store'

export const reportError = async (self: UserStore, label: string, error: any) => {
  try {
    console.tron.display({
      name: 'reportError',
      preview: `Placeholder - ${label}`,
      value: { error },
    })
    return true
  } catch (e) {
    return false
  }
}
