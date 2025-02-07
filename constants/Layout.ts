import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Layout = {
  window: {
    width,
    height,
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

