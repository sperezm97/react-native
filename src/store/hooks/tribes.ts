import { useStores } from '../index'

export function useTribes() {
  const { chats, ui } = useStores()

  const theTribes = chats.tribes
  const tribesToShow = filterTribes(theTribes, ui.tribesSearchTerm)
  return tribesToShow
}

export function filterTribes(theTribes, searchTerm) {
  return theTribes.filter(c => {
    if (!searchTerm) return true

    return c.description.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())
  })
}
