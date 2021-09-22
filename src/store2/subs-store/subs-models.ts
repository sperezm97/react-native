import { Instance, types } from 'mobx-state-tree'

export const SubModel = types.model('Sub').props({
  id: types.identifierNumber,
})

export interface Sub extends Instance<typeof SubModel> {}
