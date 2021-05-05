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
    this.bg = d ? '#141d26' : '#fff'
    this.main = d ? '#1c252e' : '#f8fafb'
    // this.bg = d ? '#12181f' : '#fff'
    // this.main = d ? '#141d26' : '#f3f3f3'
    this.title = d ? '#ddd' : '#666'
    this.subtitle = d ? '#8b98b4' : '#7e7e7e'
    this.text = d ? '#fff' : '#000000'
    this.icon = d ? '#f3f3f3' : '#65676b'
    this.iconPrimary = d ? '#fff' : '#000000'
    this.input = d ? '#fff' : '#000000'
    this.inputBg = d ? '#1c252e' : '#f0f2f5'
    this.placeholder = d ? '#8b98b4' : '#90949c'
    this.border = d ? '#212e39' : '#f0f2f5'
    this.selected = d ? '#0067ff' : '#0067ff'
    this.deep = d ? '#292c33' : '#ccc'
    this.primary = d ? '#0067ff' : '#0067ff'
    this.secondary = d ? '#0fb17d' : '#0fb17d'
    this.special = d ? '#1c252e' : '#f8fafb'
    // this.secondary = d ? '#0fb17d' : '#0fb17d'
    this.gradient = d ? '#1c252e' : '#4889e8'
    this.gradient2 = d ? '#141d26' : '#055deb'
  }

  @observable bg: string = '#fff'
  @observable main: string = '#f8fafb'
  @observable title: string = '#666'
  @observable subtitle: string = '#7e7e7e'
  @observable text: string = '#000000'
  @observable typo: string = '#212529'
  @observable icon: string = '#65676b'
  @observable iconPrimary: string = '#000000'
  @observable input: string = '#000000'
  @observable inputBg: string = '#f0f2f5'
  @observable placeholder: string = '#90949c'
  @observable border: string = '#f0f2f5'
  @observable selected: string = '#0067ff'
  @observable deep: string = '#ccc'
  @observable primary: string = '#0067ff'
  @observable secondary: string = '#0fb17d'
  @observable special: string = '#f8fafb'

  @observable white: string = '#fff'
  @observable lightGrey: string = '#f5f6f8'
  @observable grey: string = '#d0d0d0'
  @observable darkGrey: string = '#777'
  @observable black: string = '#000000'
  @observable gradient: string = '#4889e8'
  @observable gradient2: string = '#055deb'
  @observable disabled: string = '#d9dce0'
  @observable clay: string = '#212932'
  @observable blue: string = '#0067ff'
  @observable red: string = '#f50057'
  @observable mirage: string = '#141d26'
  @observable yellow: string = '#FFDF00'
  @observable silver: string = '#afb3b1'

  @observable badge: string = '#f50057'
  @observable accent: string = '#0a84ff'
  @observable active: string = '#49ca97'
  @observable inactive: string = '#febd59'
  @observable error: string = '#DB5554'
}

export const themeStore = new ThemeStore()

// themeStore.setDark(true)
