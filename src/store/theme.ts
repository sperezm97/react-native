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
    this.main = d ? '#1c252e' : '#f3f3f3'
    this.title = d ? '#ddd' : '#666'
    this.subtitle = d ? '#8b98b4' : '#7e7e7e'
    this.text = d ? '#fff' : '#212529'
    this.icon = d ? '#f3f3f3' : '#777'
    this.input = d ? '#f3f3f3' : '#7e7e7e'
    this.border = d ? '#111' : '#ccc'
    this.selected = d ? '#3b4681' : '#ddddff'
    this.deep = d ? '#292c33' : '#ccc'
    this.primary = d ? '#0067ff' : '#0067ff'
    this.secondary = d ? '#131c27' : '#055deb'
    this.gradient = d ? '#212b35' : '#4889e8'
  }

  @observable bg: string = '#fff'
  @observable main: string = '#f3f3f3'
  @observable title: string = '#666'
  @observable subtitle: string = '#7e7e7e'
  @observable text: string = '#212529'
  @observable icon: string = '#777'
  @observable input: string = '#777'
  @observable border: string = '#ccc'
  @observable selected: string = '#ddddff'
  @observable deep: string = '#ccc'
  @observable primary: string = '#0067ff'
  @observable secondary: string = '#055deb'
  @observable white: string = '#fff'
  @observable lightGrey: string = '#f5f6f8'
  @observable grey: string = '#d0d0d0'
  @observable darkGrey: string = '#777'
  @observable black: string = '#212529'
  @observable gradient: string = '#4889e8'
  @observable disabled: string = '#d9dce0'
  @observable clay: string = '#212932'
  @observable blue: string = '#0067ff'

  @observable accent: string = '#48c998'
  @observable active: string = '#49ca97'
  @observable inactive: string = '#febd59'
  @observable error: string = '#DB5554'
}

export const themeStore = new ThemeStore()

// themeStore.setDark(true)
