import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

type Mode = 'System' | 'Dark' | 'Light'

export class ThemeStore {
  @persist
  @observable
  mode: Mode = 'System'

  @action setMode(m: Mode) {
    this.mode = m
  }

  @observable dark: boolean = false
  @action setDark(d: boolean) {
    this.dark = d
    this.main = d ? '#1c252e' : '#FFF'
    this.bg = d ? '#141d26' : '#ffff'
    this.title = d ? '#ddd' : '#666'
    this.subtitle = d ? '#8b98b4' : '#7e7e7e'
    this.border = d ? '#111' : '#ccc'
    this.selected = d ? '#3b4681' : '#ddddff'
    this.deep = d ? '#292c33' : '#ccc'
    this.primary = d ? '#283593' : '#0067ff'
    this.secondary = d ? '#1a237e' : '#055deb'
  }

  @observable bg: string = '#ffff'
  @observable main: string = '#f3f3f3'
  @observable title: string = '#666'
  @observable subtitle: string = '#7e7e7e'
  @observable border: string = '#ccc'
  @observable selected: string = '#ddddff'
  @observable deep: string = '#ccc'
  @observable primary: string = '#0067ff'
  @observable secondary: string = '#055deb'
  @observable white: string = '#ffff'
  @observable lightGrey: string = '#f5f6f8'
  @observable grey: string = '#d0d0d0'
  @observable darkGrey: string = '#777'
  @observable black: string = '#212529'
  @observable gradient: string = '#4889e8'
  @observable disabled: string = '#d9dce0'

  // @observable grey: string = '#ddd'

  // primary: string = '#6289FD'
  // secondary: string = '#6289FD'
  accent: string = '#48c998'
  active: string = '#49ca97'
  inactive: string = '#febd59'
  error: string = '#DB5554'
}

export const themeStore = new ThemeStore()
