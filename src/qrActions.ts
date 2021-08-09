export async function qrActions(j, ui, chats) {
  const action = j['action']

  switch (action) {
    case 'tribe':
      try {
        const tribeParams = await chats.getTribeDetails(j.host, j.uuid)

        ui.setJoinTribeParams(tribeParams)
      } catch (e) {}

    default:
  }
}
