import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '../../../constants'

export default StyleSheet.create({
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
    borderBottomColor: 'transparent',
  },
  gifContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gifWrapper: {
    padding: 3
  },
  gif: {
    borderRadius: 4,
  },
  loadingWrapper: {
    flexDirection: "row",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
