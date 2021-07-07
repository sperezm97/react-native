import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '../../../constants'

export default StyleSheet.create({
  gifContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gif: {
    alignSelf: 'stretch',
    borderRadius: 4,
    width: '100%',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 6,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    fontSize: 20,
  },
  select: {
    fontSize: 18,
    fontWeight: "600",
  },
});